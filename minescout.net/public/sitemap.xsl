<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>Sitemap Index - Minescout</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;600&amp;family=Playfair+Display:wght@700&amp;display=swap" rel="stylesheet" />
        <style type="text/css">
          body { font-family: 'Jost', sans-serif; background: #fdfcfb; color: #1c2b3a; padding: 40px; margin: 0; }
          .container { max-width: 800px; margin: 0 auto; background: #fff; padding: 40px; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #eee; }
          h1 { font-family: 'Playfair Display', serif; margin-top: 0; color: #1a1916; }
          p.intro { color: #888; font-size: 0.9rem; margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
          
          /* The Tree Structure */
          ul.tree { list-style: none; padding-left: 0; }
          ul.tree li { position: relative; padding-left: 25px; margin-bottom: 12px; font-size: 0.95rem; }
          ul.tree li::before {
            content: ""; position: absolute; top: 0; left: 0;
            border-left: 2px solid #e8e4dd; border-bottom: 2px solid #e8e4dd;
            width: 15px; height: 14px; border-bottom-left-radius: 4px;
          }
          ul.tree li::after {
            content: ""; position: absolute; top: 14px; left: 0;
            border-left: 2px solid #e8e4dd; height: 100%;
          }
          ul.tree li:last-child::after { display: none; }
          
          a { color: #1c2b3a; text-decoration: none; font-weight: 600; transition: color 0.2s; }
          a:hover { color: #ff4d1c; }
          .meta { font-size: 0.75rem; color: #aaa; margin-left: 10px; font-weight: 400; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Minescout Architecture Map</h1>
          <p class="intro">This is the visual sitemap used by Google and search engines to index the application.</p>
          <ul class="tree">
            <xsl:for-each select="sitemap:urlset/sitemap:url">
              <li>
                <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                <span class="meta">Priority: <xsl:value-of select="sitemap:priority"/> | Freq: <xsl:value-of select="sitemap:changefreq"/></span>
              </li>
            </xsl:for-each>
          </ul>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>