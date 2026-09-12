import { useEffect, useState } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { cn } from "@/lib/utils";

// Small in-memory cache so the same STL isn't re-rendered every time a card
// mounts (product grids, related-products, etc all reuse the same file).
const thumbnailCache = new Map<string, string>();

/**
 * Renders an STL file offscreen at an isometric angle and displays the
 * captured PNG as a normal <img>. Used as an automatic stand-in preview
 * image for digital products that only ship a 3D file, not a photo.
 */
export function StlThumbnail({
  url,
  alt = "",
  className,
}: {
  url: string;
  alt?: string;
  className?: string;
}) {
  const [dataUrl, setDataUrl] = useState<string | null>(thumbnailCache.get(url) ?? null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    thumbnailCache.has(url) ? "ready" : "loading",
  );

  useEffect(() => {
    if (thumbnailCache.has(url)) {
      setDataUrl(thumbnailCache.get(url)!);
      setStatus("ready");
      return;
    }

    let cancelled = false;
    setStatus("loading");

    const loader = new STLLoader();
    loader.load(
      url,
      (geometry) => {
        if (cancelled) return;
        try {
          // STL files are typically authored Z-up (the printer-bed
          // convention). Three.js treats Y as up, so without correcting
          // for this the model renders tipped over on its back/side.
          // Rotating -90° about X puts it upright the way it would sit
          // on a table, matching how the physical tool actually looks.
          geometry.rotateX(-Math.PI / 2);
          geometry.center();
          geometry.computeBoundingBox();
          geometry.computeVertexNormals();
          const box = geometry.boundingBox!;
          const size = new THREE.Vector3();
          box.getSize(size);
          const maxDim = Math.max(size.x, size.y, size.z) || 1;

          const dim = 640;
          const scene = new THREE.Scene();
          scene.background = new THREE.Color(0xe8dfd0);
          scene.add(new THREE.AmbientLight(0xffffff, 0.9));
          const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
          dirLight.position.set(2.5, 4, 3.5);
          scene.add(dirLight);
          const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
          fillLight.position.set(-2.5, 1.5, -1.5);
          scene.add(fillLight);

          const viewSize = maxDim * 1.7;
          const camera = new THREE.OrthographicCamera(
            -viewSize / 2,
            viewSize / 2,
            viewSize / 2,
            -viewSize / 2,
            0.1,
            2000,
          );
          // A gentle, mostly-front three-quarter angle so the tool reads
          // as "sitting there" rather than spun into an odd orientation.
          camera.position.set(maxDim * 1.6, maxDim * 1.1, maxDim * 2.0);
          camera.up.set(0, 1, 0);
          camera.lookAt(0, 0, 0);

          const renderer = new THREE.WebGLRenderer({
            antialias: true,
            preserveDrawingBuffer: true,
          });
          renderer.setPixelRatio(1);
          renderer.setSize(dim, dim);

          const material = new THREE.MeshStandardMaterial({
            color: 0x7a3e2b,
            metalness: 0.08,
            roughness: 0.75,
          });
          const mesh = new THREE.Mesh(geometry, material);
          scene.add(mesh);

          const edges = new THREE.EdgesGeometry(geometry, 30);
          scene.add(new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x1c1712 })));

          renderer.render(scene, camera);
          const png = renderer.domElement.toDataURL("image/png");
          renderer.dispose();

          thumbnailCache.set(url, png);
          setDataUrl(png);
          setStatus("ready");
        } catch {
          if (!cancelled) setStatus("error");
        }
      },
      undefined,
      () => {
        if (!cancelled) setStatus("error");
      },
    );

    return () => {
      cancelled = true;
    };
  }, [url]);

  if (status === "ready" && dataUrl) {
    return <img src={dataUrl} alt={alt} className={className} />;
  }

  if (status === "error") {
    return (
      <div className={cn("flex items-center justify-center bg-bg-warm text-xs text-muted", className)}>
        Preview unavailable
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex animate-pulse items-center justify-center bg-bg-warm text-xs font-medium text-muted",
        className,
      )}
    >
      Loading preview…
    </div>
  );
}
