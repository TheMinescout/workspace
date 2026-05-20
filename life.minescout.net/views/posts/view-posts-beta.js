// views/view-posts-beta.js — Minescout Beta Views

export const betaViews = {
  
    '/beta/how-to': `
      <style>
          #user-display a { text-decoration: none; color: white; }
          .back-link {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              color: var(--md-primary);
              font-weight: 700;
              text-decoration: none;
              transition: all 0.3s var(--motion-standard);
              margin-bottom: 16px;
              font-size: 0.95rem;
              text-transform: uppercase;
              letter-spacing: 0.05em;
          }
          .back-link:hover {
              filter: brightness(0.8);
              transform: translateX(-4px);
          }
          .article-card {
              background: var(--card-bg);
              border: 1px solid var(--md-outline-variant);
              border-radius: var(--radius-lg);
              padding: 40px;
              box-shadow: var(--shadow-1);
          }
          .article-card h1 {
              font-family: 'Space Grotesk', sans-serif;
              font-size: 2.5rem;
              color: var(--text-color);
              margin-bottom: 8px;
              line-height: 1.2;
          }
          .post-meta {
              color: var(--md-outline);
              font-size: 0.95rem;
              margin-bottom: 32px;
              font-weight: 500;
          }
          .post-image-full {
              width: 100%;
              height: auto;
              border-radius: var(--radius-md);
              margin-bottom: 32px;
              box-shadow: var(--shadow-2);
              border: 1px solid var(--md-outline-variant);
          }
          .post-content h2 {
              font-family: 'Space Grotesk', sans-serif;
              font-size: 1.8rem;
              color: var(--md-primary);
              margin-top: 48px;
              margin-bottom: 16px;
              padding-bottom: 8px;
              border-bottom: 2px solid var(--md-outline-variant);
          }
          .post-content p {
              font-size: 1.05rem;
              color: var(--text-color);
              opacity: 0.9;
              line-height: 1.8;
              margin-bottom: 24px;
          }
          @media (max-width: 768px) {
              .article-card { padding: 24px; }
              .article-card h1 { font-size: 2rem; }
          }
          .hidden { display: none !important; }
      </style>
  
      <header class="main-header">
          <div class="container site-title-container">
              <div class="site-title-wrapper">
                  <h1 class="site-title"><a href="/" style="color: white; text-decoration: none;">Minescouts Life</a></h1>
                  <p class="tagline">Beta Mainframe</p>
              </div>
          </div>
      </header>
  
      <div class="main-content-area">
          <div class="container">
              <main class="post-main" data-post-id="beta-mainframe-guide">
                  <a href="/beta" class="back-link">
                      <span class="material-symbols-rounded" style="font-size: 20px;">arrow_back</span>
                      Back to Beta Hub
                  </a>
  
                  <article class="article-card">
                      <h1>Navigating the Beta Mainframe</h1>
                      <p class="post-meta">Posted on March 25, 2026 by TheMinescouter</p>
  
                      <img src="/assests/images/updates/minescout-net-launch.png" 
                           alt="Minescout Beta Mainframe Interface" 
                           class="post-image-full"
                           onerror="this.onerror=null; this.src='https://placehold.co/800x400/e0e0e0/333333?text=Beta+Mainframe+Guide';">
                      
                      <div class="post-content">
                          <p>Welcome to the guide on navigating the Minescout Beta mainframe. This interface has been built from the ground up to offer a highly interactive, responsive, and gamified experience for community testers.</p>
  
                          <h2>Interactive Physics & Gravity</h2>
                          <p>One of the standout features of the Minescout Beta is its interactive workspace. The environment includes a built-in <strong>physics engine</strong> that allows users to disrupt the layout of the site, causing elements to fall and bounce off the bottom of the screen.</p>
                          
                          <h2>Secrets & Anomalies</h2>
                          <p>Observant users may notice anomalies in the digital rain or hidden touch-points in the corners of the interface. Investigating these elements often requires thinking outside the box, sometimes even utilizing the browser's developer console to find override codes that unlock hidden playgrounds.</p>
  
                          <h2>Persistent State</h2>
                          <p>Ultimately, Minescout Beta is more than just a website; it is a persistent web application that remembers your preferences. Whether you are there to download the latest project build or simply to play with the gravity physics engine, the site offers a unique, gamified experience.</p>
                      </div>
                  </article>
              </main>
          </div>
      </div>
  
      <footer class="main-footer">
          <div class="container text-center">
              <p id="copyright">© 2026 Minescouts Life. All rights reserved.</p>
          </div>
      </footer>
    `
  };