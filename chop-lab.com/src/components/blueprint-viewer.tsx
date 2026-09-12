import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

type ViewName = "front" | "top" | "side" | "iso";

const BG = 0xf3eee4;
const LINE = 0x1c1712;
const HIDDEN = 0x8a8176;
const DIM = 0x7a3e2b;

function buildDimGroup(
  p1: THREE.Vector3,
  p2: THREE.Vector3,
  offsetDir: THREE.Vector3,
  pad: number,
  label: string,
) {
  const group = new THREE.Group();
  const mat = new THREE.LineBasicMaterial({ color: DIM });

  const off = offsetDir.clone().multiplyScalar(pad);
  const start = p1.clone().add(off);
  const end = p2.clone().add(off);

  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([start, end]), mat));
  group.add(
    new THREE.Line(new THREE.BufferGeometry().setFromPoints([p1, start]), mat),
  );
  group.add(
    new THREE.Line(new THREE.BufferGeometry().setFromPoints([p2, end]), mat),
  );

  // label sprite
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#f3eee4";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "bold 34px Instrument Sans, sans-serif";
  ctx.fillStyle = "#7a3e2b";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, canvas.width / 2, canvas.height / 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const spriteMat = new THREE.SpriteMaterial({ map: texture, depthTest: false });
  const sprite = new THREE.Sprite(spriteMat);
  const mid = start.clone().lerp(end, 0.5);
  sprite.position.copy(mid);
  const scale = pad * 2.2;
  sprite.scale.set(scale * 2, scale * 0.5, 1);
  group.add(sprite);

  return group;
}

export function BlueprintViewer({ url, label }: { url: string; label: string }) {
  const mountRefs = {
    front: useRef<HTMLDivElement>(null),
    top: useRef<HTMLDivElement>(null),
    side: useRef<HTMLDivElement>(null),
    iso: useRef<HTMLDivElement>(null),
  };
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [dims, setDims] = useState<{ x: number; y: number; z: number } | null>(null);
  const renderersRef = useRef<THREE.WebGLRenderer[]>([]);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setDims(null);
    renderersRef.current.forEach((r) => r.dispose());
    renderersRef.current = [];

    const loader = new STLLoader();
    loader.load(
      url,
      (geometry) => {
        if (cancelled) return;
        // STL files are typically authored Z-up (printer-bed convention);
        // Three.js is Y-up. Correct orientation before framing the views.
        geometry.rotateX(-Math.PI / 2);
        geometry.center();
        geometry.computeBoundingBox();
        geometry.computeVertexNormals();
        const box = geometry.boundingBox!;
        const size = new THREE.Vector3();
        box.getSize(size);
        setDims({ x: size.x, y: size.y, z: size.z });

        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const pad = maxDim * 0.18;

        const configs: { name: ViewName; ref: React.RefObject<HTMLDivElement | null>; camPos: THREE.Vector3; up: THREE.Vector3; dims: boolean }[] = [
          { name: "front", ref: mountRefs.front, camPos: new THREE.Vector3(0, 0, 1), up: new THREE.Vector3(0, 1, 0), dims: true },
          { name: "top", ref: mountRefs.top, camPos: new THREE.Vector3(0, 1, 0), up: new THREE.Vector3(0, 0, -1), dims: true },
          { name: "side", ref: mountRefs.side, camPos: new THREE.Vector3(1, 0, 0), up: new THREE.Vector3(0, 1, 0), dims: true },
          { name: "iso", ref: mountRefs.iso, camPos: new THREE.Vector3(1, 0.85, 1), up: new THREE.Vector3(0, 1, 0), dims: false },
        ];

        configs.forEach((cfg) => {
          const mountEl = cfg.ref.current;
          if (!mountEl) return;
          mountEl.innerHTML = "";

          const scene = new THREE.Scene();
          scene.background = new THREE.Color(BG);
          scene.add(new THREE.AmbientLight(0xffffff, 0.8));
          const dirLight = new THREE.DirectionalLight(0xffffff, 0.55);
          dirLight.position.set(3, 5, 4);
          scene.add(dirLight);

          const width = mountEl.clientWidth || 300;
          const height = mountEl.clientHeight || 300;
          const aspect = width / height;
          const viewSize = maxDim * 1.7;
          const camera = new THREE.OrthographicCamera(
            (-viewSize * aspect) / 2,
            (viewSize * aspect) / 2,
            viewSize / 2,
            -viewSize / 2,
            0.1,
            2000,
          );
          camera.position.copy(cfg.camPos.clone().multiplyScalar(maxDim * 3));
          camera.up.copy(cfg.up);
          camera.lookAt(0, 0, 0);

          const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          renderer.setSize(width, height);
          mountEl.appendChild(renderer.domElement);
          renderersRef.current.push(renderer);

          const material = new THREE.MeshStandardMaterial({
            color: 0xe8dfd0,
            metalness: 0.05,
            roughness: 0.85,
            polygonOffset: true,
            polygonOffsetFactor: 1,
            polygonOffsetUnits: 1,
          });
          const mesh = new THREE.Mesh(geometry, material);
          scene.add(mesh);

          const edgesGeom = new THREE.EdgesGeometry(geometry, 22);
          const edgeMat = new THREE.LineBasicMaterial({ color: LINE });
          scene.add(new THREE.LineSegments(edgesGeom, edgeMat));

          if (cfg.name === "iso") {
            const hiddenMat = new THREE.LineBasicMaterial({
              color: HIDDEN,
              transparent: true,
              opacity: 0.35,
            });
            void hiddenMat;
          }

          if (cfg.dims) {
            const half = size.clone().multiplyScalar(0.5);
            if (cfg.name === "front") {
              scene.add(
                buildDimGroup(
                  new THREE.Vector3(-half.x, -half.y, 0),
                  new THREE.Vector3(half.x, -half.y, 0),
                  new THREE.Vector3(0, -1, 0),
                  pad,
                  `${size.x.toFixed(1)} mm`,
                ),
              );
              scene.add(
                buildDimGroup(
                  new THREE.Vector3(half.x, -half.y, 0),
                  new THREE.Vector3(half.x, half.y, 0),
                  new THREE.Vector3(1, 0, 0),
                  pad,
                  `${size.y.toFixed(1)} mm`,
                ),
              );
            } else if (cfg.name === "top") {
              scene.add(
                buildDimGroup(
                  new THREE.Vector3(-half.x, 0, half.z),
                  new THREE.Vector3(half.x, 0, half.z),
                  new THREE.Vector3(0, 0, 1),
                  pad,
                  `${size.x.toFixed(1)} mm`,
                ),
              );
              scene.add(
                buildDimGroup(
                  new THREE.Vector3(half.x, 0, -half.z),
                  new THREE.Vector3(half.x, 0, half.z),
                  new THREE.Vector3(1, 0, 0),
                  pad,
                  `${size.z.toFixed(1)} mm`,
                ),
              );
            } else if (cfg.name === "side") {
              scene.add(
                buildDimGroup(
                  new THREE.Vector3(0, -half.y, -half.z),
                  new THREE.Vector3(0, -half.y, half.z),
                  new THREE.Vector3(0, -1, 0),
                  pad,
                  `${size.z.toFixed(1)} mm`,
                ),
              );
              scene.add(
                buildDimGroup(
                  new THREE.Vector3(0, -half.y, half.z),
                  new THREE.Vector3(0, half.y, half.z),
                  new THREE.Vector3(0, 0, 1),
                  pad,
                  `${size.y.toFixed(1)} mm`,
                ),
              );
            }
          }

          renderer.render(scene, camera);
        });

        setStatus("ready");
      },
      undefined,
      () => {
        if (!cancelled) setStatus("error");
      },
    );

    return () => {
      cancelled = true;
      renderersRef.current.forEach((r) => r.dispose());
      renderersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const exportPng = (name: ViewName) => {
    const mountEl = mountRefs[name].current;
    const canvas = mountEl?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${label.toLowerCase().replace(/\s+/g, "-")}-${name}.png`;
    link.href = (canvas as HTMLCanvasElement).toDataURL("image/png");
    link.click();
  };

  const panels: { name: ViewName; title: string }[] = [
    { name: "front", title: "Front" },
    { name: "top", title: "Top" },
    { name: "side", title: "Side" },
    { name: "iso", title: "Isometric" },
  ];

  return (
    <div>
      {status === "error" ? (
        <div className="rounded-md border border-border bg-surface p-6 text-sm text-muted">
          Couldn&apos;t load this model. Try another file.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {panels.map((p) => (
              <div
                key={p.name}
                className="group relative overflow-hidden rounded-md border border-border bg-surface"
              >
                <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted">
                    {p.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => exportPng(p.name)}
                    className="text-xs font-medium text-primary opacity-0 transition-opacity duration-quick hover:underline group-hover:opacity-100"
                  >
                    Export PNG
                  </button>
                </div>
                <div ref={mountRefs[p.name]} className="aspect-square w-full" />
              </div>
            ))}
          </div>

          {dims ? (
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
              <span>
                <span className="font-medium text-fg">X:</span> {dims.x.toFixed(1)} mm
              </span>
              <span>
                <span className="font-medium text-fg">Y:</span> {dims.y.toFixed(1)} mm
              </span>
              <span>
                <span className="font-medium text-fg">Z:</span> {dims.z.toFixed(1)} mm
              </span>
            </div>
          ) : null}

          {status === "loading" ? (
            <p className="mt-3 text-sm text-muted">Rendering orthographic views…</p>
          ) : null}
        </>
      )}
    </div>
  );
}
