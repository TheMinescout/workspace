// views.js — Stores all HTML templates for the SPA
export const views = {
  '/': `
    <div class="hero-layout">
      <div class="hero">
        <p class="hero-greeting">Welcome</p>
        <h1 class="hero-title">Hi, I'm<br><em>Thomas.</em></h1>
        <p class="hero-sub">Builder. Student. Eagle Scout.</p>
        <p class="hero-desc">
          I'm a 9th grader who builds things on the internet —
          from Minecraft tools to web apps. This is where I share what I've made.
        </p>
        <div class="hero-links">
          <a href="/work" class="btn-primary">See My Work</a>
          <a href="/about" class="btn-ghost">About Me →</a>
        </div>
      </div>
      <img src="/assets/photo.png" alt="Thomas Carleton" class="hero-photo" />
    </div>
  `,
  '/about': `
    <div class="main--page">
      <div class="page-content">
        <p class="page-label">About</p>
        <h1 class="page-title">A little about me</h1>
        <div class="about-layout">
          <div class="about-text">
            <p>Hey, I'm Thomas — a 9th grader based in the Pacific Northwest. I've been building things on the internet for a few years now, starting with Minecraft tools and expanding into full web apps.</p>
            <p>Minescout started as a personal project and grew into something I'm genuinely proud of. I like making things that solve real problems, even small ones.</p>
            <p>Outside of building, I earned my Eagle Scout rank and spend a lot of time outdoors — running, hiking, and fly-fishing.</p>
          </div>
          <div class="about-aside">
            <div class="about-detail"><div class="about-detail-label">Grade</div><div class="about-detail-value">9th (2025–26)</div></div>
            <div class="about-detail"><div class="about-detail-label">Location</div><div class="about-detail-value">Pacific Northwest</div></div>
            <div class="about-detail"><div class="about-detail-label">Building since</div><div class="about-detail-value">2023</div></div>
            <div class="about-detail"><div class="about-detail-label">Currently</div><div class="about-detail-value">FRC Team 1294</div></div>
          </div>
        </div>
      </div>
    </div>
  `,
  '/now': `
    <div class="main--page">
      <div class="page-content now-wrap">
        <p class="page-label">Now</p>
        <h1 class="page-title">What I'm up to</h1>
        <p class="now-updated">Last updated <span>April 2026</span> — Sammamish, WA</p>
        <div class="now-section" style="--delay: 0.3s;">
          <p class="now-section-label">Building & Engineering</p>
          <ul>
            <li>Wrapping up an incredible season with <a href="https://frc1294.org" target="_blank">FRC Team 1294</a> — we won the Glacier Peak District and advanced all the way to the District Championship (DCMP)!</li>
            <li>Just rebuilt <a href="https://chop-lab.com" target="_blank">The Chop Lab</a> as a lightning-fast Single Page Application (SPA) with a completely redesigned UI and brand new product lines.</li>
            <li>Maintaining <a href="https://minescout.net" target="_blank">Minescout AI</a> and its network of nodes.</li>
          </ul>
        </div>
        <div class="now-section" style="--delay: 0.45s;">
          <p class="now-section-label">School</p>
          <ul><li>9th grade at Eastlake High School, focusing on CS and Engineering Design</li><li>Keeping a 4.0 GPA</li></ul>
        </div>
        <div class="now-section" style="--delay: 0.55s;">
          <p class="now-section-label">Running</p>
          <ul><li>Distance running — current 5K PR is 26:00. Taking a break from intensive race training to focus on other projects.</li></ul>
        </div>
        <div class="now-section" style="--delay: 0.65s;">
          <p class="now-section-label">Outdoors</p>
          <ul>
            <li>Fly-fishing and hiking in the Pacific Northwest when the weather cooperates.</li>
            <li>Looking forward to Fly Fishing Camp in June and Scout Summer Camp in August!</li>
          </ul>
        </div>
        <div class="now-section" style="--delay: 0.75s;">
          <p class="now-section-label">Recently</p>
          <ul>
            <li>Earned my Eagle Scout rank — constructed a Little Free Library in Illahee Park.</li>
          </ul>
        </div>
        <p class="now-note">This is a <a href="https://nownownow.com/about" target="_blank">/now page</a> — a simple snapshot of what I'm focused on at this point in my life. I update it whenever something changes.</p>
      </div>
    </div>
  `,
  '/resume': `
    <div class="main--page">
      <div class="page-content" style="max-width: 740px;">
        <div class="print-header">
          <h1 class="print-name">Thomas Carleton</h1>
          <div class="print-contact">Sammamish, WA &nbsp;|&nbsp; 425-520-8683 &nbsp;|&nbsp; tmcarleton11@gmail.com &nbsp;|&nbsp; minescout.net</div>
        </div>
        
        <p class="page-label no-print">Resume</p>
        <h1 class="page-title no-print">Experience &amp; Leadership</h1>
        
        <button onclick="window.downloadResume()" class="pdf-btn no-print">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2-2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          Download PDF / Print
        </button>

        <div class="resume-summary-box" style="margin-bottom: 2.5rem; line-height: 1.6; font-size: 0.95rem; color: var(--fg);">
          <strong>Professional Summary:</strong> Motivated high school student and aspiring engineer with experience in software development, robotics, CAD design, and technical leadership. Founder of multiple technology projects involving web applications, cloud infrastructure, and AI-powered systems. Proven track record of leadership through Scouting America, FIRST Robotics, community service, and entrepreneurship. Seeking opportunities to apply engineering and software development skills while continuing to grow as a builder, problem solver, and team contributor.
        </div>

        <table class="resume-table">
          <tbody>
            <tr class="year-row"><td colspan="3">2026</td></tr>
            <tr class="entry-row" style="--delay: 100ms;">
              <td class="resume-date">Feb 2026 – Pres.</td>
              <td class="resume-title">Minescout AI</td>
              <td><strong>Founder &amp; Systems Architect</strong> — Designed and launched a multi-tenant SaaS platform utilizing AI integrations and cloud-based infrastructure. Engineered application routing systems using Cloudflare Workers and KV storage to achieve sub-second global edge latency. Developed scalable web architecture supporting multiple users and services from a single codebase.</td>
            </tr>
            <tr class="entry-row" style="--delay: 150ms;">
              <td class="resume-date">Jan – Apr 2026</td>
              <td class="resume-title">The Chop Lab</td>
              <td><strong>Lead Designer &amp; Developer</strong> — Developed a custom digital storefront for an artisanal ceramics business. Led a complete platform redesign and v2 overhaul focused on performance, usability, and scalability. Built a custom Single Page Application (SPA) architecture supporting expanded product offerings and a redesigned UI.</td>
            </tr>
            <tr class="entry-row" style="--delay: 200ms;">
              <td class="resume-date">Mar 2026</td>
              <td class="resume-title">Troop 571</td>
              <td><strong>Eagle Scout, Scouting America</strong> — Directed a comprehensive community literacy initiative, leading a team of volunteers over 60+ hours to construct and install a local Little Free Library in Illahee Park. Demonstrated advanced leadership, project logistics management, and team coordination skills to achieve Scouting's highest rank.</td>
            </tr>
          </tbody>

          <tbody>
            <tr class="year-row"><td colspan="3">2025</td></tr>
            <tr class="entry-row" style="--delay: 250ms;">
              <td class="resume-date">Jan 2025 – Apr 2026</td>
              <td class="resume-title">FRC Team 1294</td>
              <td><strong>Mechanical Assembly &amp; Hardware Integration</strong> — Contributed to robot assembly, hardware integration, and turret subsystem development. Assisted with precision turret assembly, electrical wiring, and mechanical fabrication. Contributed to a team that earned First Place at the Glacier Peak District Event and advanced to the Pacific Northwest District Championship.</td>
            </tr>
            <tr class="entry-row" style="--delay: 300ms;">
              <td class="resume-date">Mar 2025 – Jan 2026</td>
              <td class="resume-title">Minescout Beta</td>
              <td><strong>Founder</strong> — Created a technology review and beta testing platform focused on AI tools and large language model workflows. Evaluated emerging technologies and documented performance findings to validate AI-assisted workflows. Organized testing processes and structured user feedback collection.</td>
            </tr>
          </tbody>

          <tbody>
            <tr class="year-row"><td colspan="3">Education &amp; Community</td></tr>
            <tr class="entry-row" style="--delay: 350ms;">
              <td class="resume-date">2025 – Present</td>
              <td class="resume-title">Eastlake High School</td>
              <td><strong>9th Grade (GPA: 4.0)</strong> — Expected Graduation: June 2029. Areas of focus include Engineering, Computer Science, and CAD Design (Fusion 360). Honors include National Junior Honor Society, English Achievement, and School Spirit Awards.</td>
            </tr>
            <tr class="entry-row" style="--delay: 400ms;">
              <td class="resume-date">Jan 2024 – Pres.</td>
              <td class="resume-title">Sammamish Botanical</td>
              <td><strong>Community Volunteer</strong> — Support local horticultural and garden operations through regular maintenance and service projects. Contribute to beautification and preservation efforts within the local community garden.</td>
            </tr>
            <tr class="entry-row" style="--delay: 450ms;">
              <td class="resume-date">Jan 2024 – Pres.</td>
              <td class="resume-title">City of Sammamish</td>
              <td><strong>Park Restoration Volunteer</strong> — Participated in environmental stewardship and community restoration initiatives. Assisted with park improvement, trail preservation, and conservation projects.</td>
            </tr>
            <tr class="entry-row" style="--delay: 500ms;">
              <td class="resume-date">Jan 2023 – Jan 2025</td>
              <td class="resume-title">Pack 551</td>
              <td><strong>Den Chief, Scouting America</strong> — Mentored Cub Scouts and led weekly activities, skills challenges, and development programs. Served as a dedicated youth leader and positive role model. Earned the Den Chief Service Award.</td>
            </tr>
          </tbody>
        </table>

        <div class="pricing-section-label" style="margin-top: 2.5rem; margin-bottom: 1rem;">Awards &amp; Achievements</div>
        <div class="resume-skills" style="grid-template-columns: 1fr; gap: 0.5rem; margin-bottom: 2rem; font-size: 0.88rem; line-height: 1.5;">
          <div>• <strong>Eagle Scout Rank</strong>, Scouting America (Troop 571)</div>
          <div>• <strong>Washington Regional Champion</strong>, Future City Competition (Awarded Best Overall City Essay and NCEES Best Land Surveying Practices)</div>
          <div>• <strong>Regional Award Winner</strong>, National History Day (Junior Individual Documentary)</div>
          <div>• <strong>Glacier Peak District Event Champion</strong>, FIRST Robotics Team 1294</div>
        </div>

        <div class="resume-skills">
          <div class="skills-block"><span class="skills-label">Dev Stack</span><span class="skills-value">JavaScript (ES6+), Python, React, HTML5, CSS3</span></div>
          <div class="skills-block"><span class="skills-label">Cloud &amp; Tools</span><span class="skills-value">Cloudflare Workers, Git, GitHub, VS Code</span></div>
          <div class="skills-block"><span class="skills-label">Engineering</span><span class="skills-value">Fusion 360 (CAD Modeling), Mechanical Fabrication, Electrical Wiring, Robotics Assembly</span></div>
        </div>
      </div>
    </div>
  `,
  '/work': `
    <div class="main--page">
      <div class="page-content">
        <p class="page-label">Portfolio</p>
        <h1 class="page-title">Things I've Built</h1>
        <div class="projects">
          <a class="project-card" href="/ai" style="--delay: 100ms;">
            <div class="project-date">Feb<br>2026</div>
            <div><div class="project-title">Minescout AI</div><div class="project-url">minescout.net/ai</div></div>
            <div class="project-arrow">→</div>
          </a>
          <a class="project-card" href="https://chop-lab.com" target="_blank" style="--delay: 200ms;">
            <div class="project-date">Jan<br>2026</div>
            <div><div class="project-title">The Chop Lab</div><div class="project-url">chop-lab.com</div></div>
            <div class="project-arrow">→</div>
          </a>
          <a class="project-card" href="https://beta.minescout.net" target="_blank" style="--delay: 300ms;">
            <div class="project-date">Oct<br>2025</div>
            <div><div class="project-title">Minescout Beta</div><div class="project-url">beta.minescout.net</div></div>
            <div class="project-arrow">→</div>
          </a>
          <a class="project-card" href="https://life.minescout.net" target="_blank" style="--delay: 400ms;">
            <div class="project-date">Mar<br>2025</div>
            <div><div class="project-title">Minescout Life</div><div class="project-url">life.minescout.net</div></div>
            <div class="project-arrow">→</div>
          </a>
        </div>
      </div>
    </div>
  `,
  '/blog': `
    <div class="main--page">
      <div class="page-content" style="max-width: 760px;">
        <p class="page-label">Blog</p>
        <h1 class="page-title">Thoughts &amp; Writing</h1>
        <div class="blog-grid">
          <a class="blog-card featured" href="/blog/minescout-genesis.html" style="--delay: 0.1s;">
            <div>
              <div class="blog-card-meta"><span class="blog-card-date">Mar 9, 2026</span><span class="blog-card-tag tag-engineering">Engineering</span></div>
              <div class="blog-card-title">Minescout Genesis: The 17-Day Multi-Tenant Pivot</div>
              <div class="blog-card-excerpt">Moving from static sites to a serverless SaaS engine. Here is how I architected the multi-tenant core of Minescout AI and launched its first two nodes in under three weeks.</div>
              <div class="blog-card-footer">Read case study →</div>
            </div>
            <span class="featured-label">Latest</span>
          </a>
          <a class="blog-card" href="/blog/launching-this-site.html" style="--delay: 0.2s;">
            <div class="blog-card-meta"><span class="blog-card-date">Feb 21, 2026</span><span class="blog-card-tag tag-building">Building</span></div>
            <div class="blog-card-title">Launching This Site</div>
            <div class="blog-card-excerpt">I've been wanting a personal corner of the internet for a while. Not just a GitHub profile — something that actually felt like me.</div>
            <div class="blog-card-footer">Read post →</div>
          </a>
        </div>
      </div>
    </div>
  `,
  '/ai': `
    <div class="main--page">
      <div class="page-content ai-wrap">
        <p class="ai-eyebrow">Minescout Studio</p>
        <h1 class="ai-title">Custom Websites.<br><em>Practical AI.</em><br>Built for Local Businesses.</h1>
        
        <p class="ai-lead" style="font-weight: 600; color: var(--fg); font-size: 1.1rem; margin-bottom: 0.5rem;">Still answering the same customer questions every day? Need a better website?</p>
        <p class="ai-lead">MineScout builds fast custom websites and AI assistants that save you time. Every project is coded from scratch, delivered quickly, and designed to evolve over time.</p>
        
        <div class="ai-stats">
          <div class="ai-stat"><span class="ai-stat-val">&lt;7<em>days</em></span><span class="ai-stat-label">To Launch</span></div>
          <div class="ai-stat"><span class="ai-stat-val">100<em>%</em></span><span class="ai-stat-label">Custom Built</span></div>
          <div class="ai-stat"><span class="ai-stat-val">24/7</span><span class="ai-stat-label">AI Support</span></div>
        </div>
        
        <div class="ai-section-label">What We Build</div>
        <div class="ai-features">
          <a href="/ai/pricing" class="ai-feature"><div class="ai-feature-icon">⚡</div><div><div class="ai-feature-title">Fast, Secure Custom Websites</div><div class="ai-feature-desc">One website that grows with your business. No servers for you to manage.</div></div><span class="ai-feature-badge badge-live">Core</span></a>
          <a href="/ai/demo/index.html" class="ai-feature"><div class="ai-feature-icon">🤖</div><div><div class="ai-feature-title">An AI Employee for Your Site</div><div class="ai-feature-desc">Imagine every visitor getting an instant answer—even at 2 AM. A chatbot trained specifically on YOUR business.</div></div><span class="ai-feature-badge badge-ready">Demo Ready</span></a>
          <a href="/portal" target="_blank" class="ai-feature"><div class="ai-feature-icon">🎭</div><div><div class="ai-feature-title">The "Backstage" Dashboard</div><div class="ai-feature-desc">Your private dashboard where you can edit AI knowledge, see conversations, and manage your site without touching code.</div></div><span class="ai-feature-badge badge-node">Included</span></a>
        </div>
        
        <div class="ai-callout" style="border-left-color: var(--fg); background: var(--bg);">
          <div class="ai-callout-title">🤝 Agency Quality, Direct Access.</div>
          <div class="ai-callout-desc">Traditional agencies have project managers, sales teams, designers, and heavy overhead. MineScout is different. You work directly with the founder building your project, allowing me to deliver custom work at a fraction of typical agency pricing.</div>
        </div>

        <div class="ai-callout">
          <div class="ai-callout-title">🛡️ Clear Ownership.</div>
          <div class="ai-callout-desc">You own your domain, branding, and content. MineScout licenses the software that powers your site, allowing continuous improvements and lightning-fast support. It feels intentional, never restrictive.</div>
        </div>
        
        <div class="ai-cta-group" style="margin-bottom: 3rem;">
          <a href="/contact" class="btn-primary">Book a Call</a>
          <a href="/ai/pricing" class="btn-ghost">See Pricing &rarr;</a>
        </div>
        
        <p class="ai-disclaimer">Every project is built directly by the founder from start to finish. Minescout is operated by <a href="/">Thomas Carleton</a>. Whether you're a student building your first portfolio or a business looking to automate customer support, the goal is the same: build something that lasts.</p>
      </div>
    </div>
  `,
  '/ai/clients': `
    <div class="main--page">
      <div class="page-content clients-wrap">
        <p class="page-label">Portfolio</p>
        <h1 class="page-title">Client Work</h1>
        <p class="clients-intro">MineScout builds custom websites and AI systems for people who want agency-quality results without agency complexity. Below are our active deployments.</p>
        
        <div class="section-divider">Live Client Deployments</div>
        <div class="client-card" style="--d:0.3s;">
          <div class="client-card-header"><div><div class="client-name">Chris Franz</div><div class="client-type">Fine Art & Studio Pottery</div></div><span class="client-status status-live">Live</span></div>
          <div class="client-card-body">
            <div class="client-detail-grid">
              <div><div class="client-detail-label">Deployment</div><div class="client-detail-val">June 2026</div></div>
              <div><div class="client-detail-label">Solution</div><div class="client-detail-val">Serverless Edge SPA</div></div>
              <div><div class="client-detail-label">Performance</div><div class="client-detail-val">100% Best Practices / Zero Render-Blocking</div></div>
            </div>
            <p class="client-note">Deploying a highly optimized, single-page serverless portfolio at the network edge for Pacific Northwest artist Chris Franz. This node leverages a decoupled cloud architecture to deliver sub-second paint times, localized asset caching, and a secure, low-latency administrative back panel for zero-maintenance content management.</p>
            
            <div style="margin: 1.25rem 0; padding: 1rem 1.25rem; background: var(--light); border-left: 3px solid var(--accent); border-radius: 0 6px 6px 0;">
              <div style="color: #f5b041; font-size: 0.9rem; letter-spacing: 2px; margin-bottom: 0.4rem;">★★★★★</div>
              <p style="font-size: 0.85rem; font-style: italic; color: var(--fg); margin: 0; line-height: 1.6;">
                "Minescout does a great job replying to questions in a timely manner. They quickly created a plug and play website for me, work fast, and will walk you through how to make updates to your webpage."
              </p>
            </div>
            <p style="margin: 0;"><a href="https://chrisdfranz.com" class="view-link" target="_blank">View Live Site &rarr;</a></p>
          </div>
        </div>
        <div class="client-card" style="--d:0.35s;">
          <div class="client-card-header"><div><div class="client-name">The Chop Lab</div><div class="client-type">Manufacturing & Robotics Automation</div></div><span class="client-status status-live">Live</span></div>
          <div class="client-card-body">
            <div class="client-detail-grid">
              <div><div class="client-detail-label">Vertical</div><div class="client-detail-val">E-Commerce Automation</div></div>
              <div><div class="client-detail-label">Deployment</div><div class="client-detail-val">April 2026</div></div>
              <div><div class="client-detail-label">Architecture</div><div class="client-detail-val">Custom AI & STL Engine</div></div>
              <div><div class="client-detail-label">Performance</div><div class="client-detail-val">Sub-second Edge Latency</div></div>
            </div>
            <p class="client-note">An advanced integration of robotics and automated sales. Features a custom AI employee capable of providing instant quotes from a technical database and managing 3D fabrication requests.<br><a href="https://chop-lab.com" class="view-link" target="_blank">Analyze Live Integration &rarr;</a></p>
          </div>
        </div>

        <div class="section-divider">Capabilities & Frameworks</div>
        <div class="client-card" style="--d:0.45s;">
          <div class="client-card-header"><div><div class="client-name">Handmade by Jayme</div><div class="client-type">Artisanal Goods & Lifestyle</div></div><span class="client-status status-live">Live</span></div>
          <div class="client-card-body">
            <div class="client-detail-grid">
              <div><div class="client-detail-label">Deployment</div><div class="client-detail-val">March 2026</div></div>
              <div><div class="client-detail-label">Solution</div><div class="client-detail-val">Organic Modern Architecture</div></div>
            </div>
            <p class="client-note">A complete serverless edge migration. We transformed a legacy site into a high-performance visual experience featuring dynamic gallery rendering and fast mobile load times.</p>
            
            <div style="margin: 1.25rem 0; padding: 1rem 1.25rem; background: var(--light); border-left: 3px solid var(--accent); border-radius: 0 6px 6px 0;">
              <div style="color: #f5b041; font-size: 0.9rem; letter-spacing: 2px; margin-bottom: 0.4rem;">★★★★★</div>
              <p style="font-size: 0.85rem; font-style: italic; color: var(--fg); margin: 0; line-height: 1.6;">
                "Excellent communication. My favorite part about the final product is that I can easily edit things myself and add new pages."
              </p>
            </div>
            <p style="margin: 0;"><a href="https://jaymecarleton.com" class="view-link" target="_blank">View Live Site &rarr;</a></p>
          </div>
        </div>
        <div class="client-card" style="--d:0.5s;">
          <div class="client-card-header"><div><div class="client-name">Fern Carleton Studio</div><div class="client-type">Fine Arts & Visual Media</div></div><span class="client-status status-live">Live</span></div>
          <div class="client-card-body">
            <div class="client-detail-grid">
              <div><div class="client-detail-label">Deployment</div><div class="client-detail-val">March 2026</div></div>
              <div><div class="client-detail-label">Solution</div><div class="client-detail-val">Digital Asset Archiving</div></div>
            </div>
            <p class="client-note">Designed for high-fidelity visual archiving without sacrificing backend speed. This framework ensures rapid asset delivery globally.<br><a href="https://ferncarleton.com" class="view-link" target="_blank">View Live Site &rarr;</a></p>
          </div>
        </div>
        <div class="client-card" style="--d:0.55s;">
          <div class="client-card-header"><div><div class="client-name">Smith &amp; Cole Law</div><div class="client-type">Professional Services Demo</div></div><span class="client-status status-demo">Internal Concept</span></div>
          <div class="client-card-body">
            <div class="client-detail-grid">
              <div><div class="client-detail-label">Objective</div><div class="client-detail-val">Lead Triage & Qualification</div></div>
              <div><div class="client-detail-label">Industry</div><div class="client-detail-val">Legal Consulting</div></div>
            </div>
            <p class="client-note">A demonstration of how Minescout can capture and qualify professional service leads 24/7.<br><a href="/ai/demo/index.html" class="view-link">Test AI Agent &rarr;</a></p>
          </div>
        </div>
        
        <div class="clients-cta" style="margin-top: 3rem;">
          <a href="/contact" class="btn-primary">Book a Call</a>
        </div>
      </div>
    </div>
  `,'/ai/process': `
    <div class="main--page">
      <div class="page-content process-wrap">
        <p class="page-label">Minescout Studio</p>
        <h1 class="page-title">The Process</h1>
        <div style="display: inline-block; background: var(--fg); color: var(--bg); padding: 0.4rem 0.8rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1.5rem;">Total time: ~5–7 days</div>
        <p class="process-intro">From first conversation to live website — here's exactly what working with MineScout looks like, step by step. No surprises, no jargon.</p>
        <div class="timeline">
          <div class="phase" style="--d:0.3s;">
            <div class="phase-dot active">01</div>
            <div class="phase-content">
              <div class="phase-header"><div class="phase-title">Initial conversation</div><span class="phase-timeline-tag">Day 1 &mdash; 30 min</span></div>
              <p class="phase-desc">We talk (email or call) about your business, what questions customers ask most, and what you want the site to handle. I'll ask about your hours, services, pricing, and anything that trips up your current process. No tech knowledge required from you.</p>
              <ul class="phase-deliverables"><li>Scope agreed and plan selected</li><li>Content checklist sent to you</li><li>Timeline confirmed</li></ul>
            </div>
          </div>
          <div class="phase" style="--d:0.38s;">
            <div class="phase-dot">02</div>
            <div class="phase-content">
              <div class="phase-header"><div class="phase-title">You send your content</div><span class="phase-timeline-tag">Day 1&ndash;2</span></div>
              <p class="phase-desc">You send me your FAQs, hours, service descriptions, pricing, and anything else I should know. A Google Doc, PDF, Word file, or even a bullet-point email works perfectly. I don't need it to be formatted — I'll handle that.</p>
              <ul class="phase-deliverables"><li>FAQ document (any format)</li><li>Business hours &amp; contact info</li><li>Services or menu with pricing</li></ul>
            </div>
          </div>
          <div class="phase" style="--d:0.50s;">
            <div class="phase-content" style="margin-left: 52px; padding: 1rem; text-align: center; background: var(--light); border: 1px dashed var(--border);">
              <span style="font-weight: 600; font-size: 0.85rem; color: var(--fg);">Days 2–5: I build the site and train the AI from scratch.</span>
            </div>
          </div>
          <div class="phase" style="--d:0.54s;">
            <div class="phase-dot">03</div>
            <div class="phase-content">
              <div class="phase-header"><div class="phase-title">Review & launch</div><span class="phase-timeline-tag">Day 5–7</span></div>
              <p class="phase-desc">You test the site yourself, ask the AI your hardest questions, and tell me anything it got wrong. I fix it. Once you're happy, we flip the switch and go live.</p>
              <ul class="phase-deliverables"><li>Test session with you</li><li>Admin Portal credentials delivered</li><li>Website goes live</li></ul>
            </div>
          </div>
          <div class="phase" style="--d:0.58s;">
            <div class="phase-dot">04</div>
            <div class="phase-content">
              <div class="phase-header"><div class="phase-title">Ongoing maintenance</div><span class="phase-timeline-tag">Monthly</span></div>
              <p class="phase-desc">You have 24/7 access to your Backstage Portal to update the AI's instructions, tweak pricing, or change business hours instantly. On my end, I actively monitor the infrastructure, apply security updates, and handle hosting.</p>
              <ul class="phase-deliverables"><li>24/7 Backstage Portal access</li><li>Backend infrastructure scaling</li><li>Hosting and SSL management</li></ul>
            </div>
          </div>
        </div>
        <div class="process-cta">
          <a href="/contact" class="btn-primary">Book a Call</a>
          <a href="/ai/pricing" class="btn-ghost" style="border-color: var(--border); color: var(--fg);">View pricing &rarr;</a>
        </div>
      </div>
    </div>
  `,
  '/ai/legal': `
    <div class="main--page">
      <div class="page-content legal-wrap">
        <p class="page-label">Minescout AI</p>
        <h1 class="page-title">Legal &amp; Terms</h1>
        <p class="legal-updated">Last updated: <span id="legal-date"></span></p>
        <div class="legal-section" style="--d:0.28s;">
          <div class="legal-section-title">Who we are</div>
          <p class="legal-body">Minescout AI is operated by <strong>Thomas Carleton</strong>, based in Sammamish, Washington. This is not a registered business entity. All services are delivered directly by Thomas Carleton as an individual. By engaging Minescout AI, you agree to work with Thomas Carleton personally as your service provider.</p>
        </div>
        <div class="legal-section" style="--d:0.34s;">
          <div class="legal-section-title">Services &amp; scope</div>
          <p class="legal-body">Minescout AI provides web development, AI assistant configuration, and related technical services for small businesses. Deliverables, pricing, and timeline are agreed upon in writing before work begins.</p>
          <p class="legal-body">Services are delivered on a best-effort basis. I cannot guarantee specific outcomes such as increased sales, lead conversion rates, or AI response accuracy beyond what is tested and agreed upon at launch.</p>
        </div>
        <div class="legal-section" style="--d:0.4s;">
          <div class="legal-section-title">Charter Partner program</div>
          <p class="legal-body">The Charter Partner program is an invite-only arrangement in which Minescout AI provides the full AI Upgrade at no cost in exchange for a defined set of commitments from the partner. <strong>2 spots are currently available.</strong> <a href="/contact">Get in touch to apply.</a></p>
          <p class="legal-body">The terms of the Charter Partner arrangement are as follows:</p>
          <div class="charter-detail">
            <div class="charter-detail-row"><div class="charter-key">What you receive</div><div class="charter-val">The full AI Upgrade at no cost &mdash; custom-trained AI assistant, website integration, and 12 months of maintenance.</div></div>
            <div class="charter-detail-row"><div class="charter-key">Testimonial</div><div class="charter-val">A signed written testimonial about your experience, provided within 30 days of the AI going live. The testimonial may be published on minescout.net and used in marketing materials.</div></div>
            <div class="charter-detail-row"><div class="charter-key">Case study</div><div class="charter-val">Permission for a named, published case study documenting the project &mdash; including your business name, what was built, and measurable outcomes where available. You will be given the opportunity to review the case study before publication.</div></div>
            <div class="charter-detail-row"><div class="charter-key">Feedback commitment</div><div class="charter-val">12 months of active participation in the feedback loop &mdash; reviewing AI responses via your client portal, submitting corrections when the AI gets something wrong, and responding to occasional check-in messages (no more than once per month).</div></div>
            <div class="charter-detail-row"><div class="charter-key">Corrections &amp; updates</div><div class="charter-val">Corrections may be submitted at any time via your client portal. All corrections are applied within <strong>48 hours</strong>. Scheduled content updates (changed hours, new services, pricing changes) are processed in the monthly maintenance cycle. Urgent updates are handled within 24 hours on request.</div></div>
            <div class="charter-detail-row"><div class="charter-key">Early termination</div><div class="charter-val">If a Charter Partner exits the program before 12 months, the free setup benefit is forfeited. A standard, pro-rated setup fee may be invoiced at my discretion. Partners who have already delivered a signed testimonial and published case study may exit without penalty after 6 months.</div></div>
          </div>
        </div>
        <div class="legal-section" style="--d:0.46s;">
          <div class="legal-section-title">AI accuracy &amp; limitations</div>
          <p class="legal-body">AI assistants are trained on content you provide. <strong>Response accuracy depends directly on the accuracy of your source material.</strong> I am not responsible for incorrect responses resulting from outdated, incomplete, or inaccurate content supplied by the client.</p>
          <p class="legal-body">The client portal exists to catch and fix these issues. Corrections submitted will be applied within 48 hours.</p>
          <ul class="legal-list">
            <li>AI assistants may occasionally produce incorrect or incomplete responses.</li>
            <li>AI assistants should not be relied upon for legal, medical, or financial advice.</li>
            <li>Guardrails keep responses on-topic but cannot guarantee complete coverage.</li>
          </ul>
        </div>
        <div class="legal-section" style="--d:0.52s;">
          <div class="legal-section-title">Data &amp; privacy</div>
          <p class="legal-body">Conversations are logged to your private client portal. <strong>You own your data.</strong> I do not share conversation logs with third parties.</p>
          <p class="legal-body">The AI infrastructure uses:</p>
          <ul class="legal-list">
            <li><strong>Cloudflare Workers AI (Llama 3)</strong> &mdash; processes messages. Subject to <a href="https://www.cloudflare.com/privacypolicy/" target="_blank">Cloudflare's Privacy Policy</a>.</li>
            <li><strong>Cloudflare Workers</strong> &mdash; routes requests. Subject to <a href="https://www.cloudflare.com/privacypolicy/" target="_blank">Cloudflare's Privacy Policy</a>.</li>
            <li><strong>Firebase / Firestore</strong> &mdash; stores conversation logs and client data. Subject to <a href="https://policies.google.com/privacy" target="_blank">Google's Privacy Policy</a>.</li>
          </ul>
          <p class="legal-body">No personally identifiable information is stored beyond what appears in the conversation itself.</p>
        </div>
        <div class="legal-section" style="--d:0.58s;">
          <div class="legal-section-title">Payment &amp; cancellation</div>
          <p class="legal-body">Setup fees are due before work begins. Monthly fees are due at the start of each billing period. Rates for the Full AI Upgrade and monthly maintenance are outlined in your individual service agreement. No long-term contracts or lock-ins &mdash; monthly services can be cancelled with 7 days written notice.</p>
          <p class="legal-body">On cancellation: the widget is removed, all training data is returned in a readable format, and charges stop within one billing cycle. Setup fees are non-refundable once work has begun.</p>
        </div>
        <div class="legal-section" style="--d:0.62s;">
          <div class="legal-section-title">Affiliate links</div>
          <p class="legal-body">The <a href="/ai/tools">Tools I Use</a> page contains affiliate links, clearly labeled. I earn a small commission if you sign up through them at no cost to you. This does not influence what I recommend.</p>
        </div>
        <div class="legal-section" style="--d:0.66s;">
          <div class="legal-section-title">Intellectual property</div>
          <p class="legal-body">Code and content I produce for clients becomes the client's property upon full payment. I retain the right to reference the engagement in my portfolio unless a confidentiality agreement is in place. Charter Partners explicitly grant permission for a named case study as detailed above.</p>
        </div>
        <div class="legal-section" style="--d:0.7s;">
          <div class="legal-section-title">Limitation of liability</div>
          <p class="legal-body">Services are provided "as is." Thomas Carleton shall not be liable for any indirect, incidental, or consequential damages. Total liability is limited to the amount paid for the specific service in question.</p>
        </div>
        <div class="legal-contact">
          <div class="legal-contact-title">Questions about these terms?</div>
          <div class="legal-contact-body">Reach out directly &mdash; happy to clarify anything. <a href="/contact">Contact page</a> or <a href="mailto:thomas@minescout.net">thomas@minescout.net</a>.</div>
        </div>
        
        <div style="margin-top: 3rem; text-align: center;">
          <a href="https://scamadviser.com/check-website/minescout.net" target="_blank" ><img src="https://files.scamadviser.com/thumbs/scamadviser-logo-4ad94.jpg_900x.jpg" alt="Check My Site on ScamAdviser.com" style="width:260px;height:auto;"></a>
        </div>
      </div>
    </div>
  `,
  '/ai/tools': `
    <div class="main--page">
      <div class="page-content tools-wrap">
        <p class="page-label">Minescout AI</p>
        <h1 class="page-title" style="opacity:0;animation:fadeUp 0.5s ease 0.1s forwards;">Tools I Use</h1>
        <div class="tools-disclaimer"><strong>Honest reviews only.</strong> No sponsored picks. These are the tools I actually use daily for building Minescout AI, client projects, schoolwork, and FRC robotics. I list where things fall short too.</div>
        
        <div class="tools-category" style="--cd:0.2s;">AI &amp; Language Models</div>
        <div class="tool-card" style="--td:0.25s;">
          <div class="tool-logo">&#10024;</div>
          <div class="tool-body">
            <div class="tool-name-row"><span class="tool-name">Gemini 3.1 Pro</span><span class="tool-badge badge-core">Core</span></div>
            <div class="tool-rating"><span class="star">&#9733;</span><span class="star">&#9733;</span><span class="star">&#9733;</span><span class="star">&#9733;</span><span class="star">&#9733;</span></div>
            <p class="tool-desc">My advanced reasoning engine. I rely heavily on Gemini 3.1 Pro for deep integration, parsing massive amounts of context, and solving complex architectural problems for Minescout AI.</p>
            <div class="tool-verdict-grid">
              <div class="verdict-box pro"><div class="verdict-label">Works well for</div><div class="verdict-text">Deep reasoning, contextual understanding across huge workspaces, and integrated ecosystem tasks.</div></div>
              <div class="verdict-box con"><div class="verdict-label">Watch out for</div><div class="verdict-text">Sometimes its strict guardrails can get in the way of highly creative, out-of-the-box coding requests.</div></div>
            </div>
          </div>
          <a href="https://gemini.google.com" target="_blank" rel="noopener" class="tool-link tool-link-ghost">Visit</a>
        </div>

        <div class="tool-card" style="--td:0.3s;">
          <div class="tool-logo">&#x1F9E0;</div>
          <div class="tool-body">
            <div class="tool-name-row"><span class="tool-name">Claude Opus 4.6</span></div>
            <div class="tool-rating"><span class="star">&#9733;</span><span class="star">&#9733;</span><span class="star">&#9733;</span><span class="star">&#9733;</span><span class="star">&#9733;</span></div>
            <p class="tool-desc">My go-to for nuanced writing, precise documentation, and drafting professional proposals. It has an incredibly natural tone and acts more like a thoughtful collaborator than a standard chatbot.</p>
            <div class="tool-verdict-grid">
              <div class="verdict-box pro"><div class="verdict-label">Works well for</div><div class="verdict-text">High-end copywriting, client proposals, drafting complex system prompts, and detailed code explanations.</div></div>
              <div class="verdict-box con"><div class="verdict-label">Watch out for</div><div class="verdict-text">Usage limits can sneak up on you during heavy development sprints.</div></div>
            </div>
          </div>
          <a href="https://claude.ai" target="_blank" rel="noopener" class="tool-link tool-link-ghost">Visit</a>
        </div>

        <div class="tool-card" style="--td:0.34s;">
          <div class="tool-logo">&#128171;</div>
          <div class="tool-body">
            <div class="tool-name-row"><span class="tool-name">ChatGPT 5.1</span></div>
            <div class="tool-rating"><span class="star">&#9733;</span><span class="star">&#9733;</span><span class="star">&#9733;</span><span class="star">&#9733;</span><span class="star-empty">&#9733;</span></div>
            <p class="tool-desc">A highly versatile powerhouse. I use this for rapid coding iterations, general brainstorming, and quick problem-solving. It's incredibly fast and great for getting a working prototype up quickly.</p>
            <div class="tool-verdict-grid">
              <div class="verdict-box pro"><div class="verdict-label">Works well for</div><div class="verdict-text">Fast code generation, rapid prototyping, and general-purpose technical questions.</div></div>
              <div class="verdict-box con"><div class="verdict-label">Watch out for</div><div class="verdict-text">Can be confidently incorrect. Always verify its code logic on complex backend implementations.</div></div>
            </div>
          </div>
          <a href="https://chatgpt.com" target="_blank" rel="noopener" class="tool-link tool-link-ghost">Visit</a>
        </div>

        <div class="tools-category" style="--cd:0.48s;">Hosting &amp; Infrastructure</div>
        <div class="tool-card" style="--td:0.5s;">
          <div class="tool-logo">&#x26A1;</div>
          <div class="tool-body">
            <div class="tool-name-row"><span class="tool-name">Cloudflare</span><span class="tool-badge badge-free">Free tier</span><span class="tool-badge badge-core">Core</span></div>
            <div class="tool-rating"><span class="star">&#9733;</span><span class="star">&#9733;</span><span class="star">&#9733;</span><span class="star">&#9733;</span><span class="star">&#9733;</span></div>
            <p class="tool-desc">The absolute backbone of the Minescout AI platform. DNS, CDN, Edge Workers, and KV Storage—all in one place. It provides sub-second latency and handles my multi-tenant routing perfectly.</p>
            <div class="tool-verdict-grid">
              <div class="verdict-box pro"><div class="verdict-label">Works well for</div><div class="verdict-text">Serverless architecture, instant global deployments, and maintaining a strict $0.00 risk profile.</div></div>
              <div class="verdict-box con"><div class="verdict-label">Watch out for</div><div class="verdict-text">Serverless environments require a different mental model than traditional server hosting.</div></div>
            </div>
          </div>
          <a href="https://cloudflare.com" target="_blank" rel="noopener" class="tool-link tool-link-ghost">Visit</a>
        </div>

        <div class="tool-card" style="--td:0.53s;">
          <div class="tool-logo">&#x1F525;</div>
          <div class="tool-body">
            <div class="tool-name-row"><span class="tool-name">Firebase</span><span class="tool-badge badge-free">Free tier</span><span class="tool-badge badge-core">Core</span></div>
            <div class="tool-rating"><span class="star">&#9733;</span><span class="star">&#9733;</span><span class="star">&#9733;</span><span class="star">&#9733;</span><span class="star">&#9733;</span></div>
            <p class="tool-desc">Handles real-time database requirements (Firestore) and secure client authentication. I use it to power the "Backstage" portals where clients can safely edit their information without breaking the site.</p>
            <div class="tool-verdict-grid">
              <div class="verdict-box pro"><div class="verdict-label">Works well for</div><div class="verdict-text">Secure logins, real-time database syncing, and rapid frontend integration.</div></div>
              <div class="verdict-box con"><div class="verdict-label">Watch out for</div><div class="verdict-text">Firestore security rules must be written carefully to prevent accidental data exposure.</div></div>
            </div>
          </div>
          <a href="https://firebase.google.com" target="_blank" rel="noopener" class="tool-link tool-link-ghost">Visit</a>
        </div>

        <div class="tools-category" style="--cd:0.55s;">Development</div>
        <div class="tool-card" style="--td:0.56s;">
          <div class="tool-logo">&#x1F419;</div>
          <div class="tool-body">
            <div class="tool-name-row"><span class="tool-name">GitHub</span><span class="tool-badge badge-free">Free</span><span class="tool-badge badge-core">Core</span></div>
            <div class="tool-rating"><span class="star">&#9733;</span><span class="star">&#9733;</span><span class="star">&#9733;</span><span class="star">&#9733;</span><span class="star">&#9733;</span></div>
            <p class="tool-desc">I use GitHub for absolutely everything development-related. It handles all my version control, deployment pipelines, and code management. I don't use external editors—GitHub is the sole hub for my code.</p>
            <div class="tool-verdict-grid">
              <div class="verdict-box pro"><div class="verdict-label">Works well for</div><div class="verdict-text">Version control, repository management, and seamless integrations with modern edge hosts.</div></div>
              <div class="verdict-box con"><div class="verdict-label">Watch out for</div><div class="verdict-text">Command-line git requires practice, but web-based GitHub tools bridge the gap perfectly.</div></div>
            </div>
          </div>
          <a href="https://github.com" target="_blank" rel="noopener" class="tool-link tool-link-ghost">Visit</a>
        </div>

        <div class="not-for-me">
          <div class="not-header">Tried &mdash; not for me</div>
          <div class="not-item">
            <div class="not-icon">&#128187;</div>
            <div><div class="not-name">Wix</div><div class="not-reason">I initially looked at this for visual building, but it lacked the deep flexibility I needed. Writing raw HTML and custom CSS from scratch gave me vastly more control and resulted in a much better product for me.</div></div>
          </div>
          <div class="not-item">
            <div class="not-icon">&#129302;</div>
            <div><div class="not-name">GitHub Copilot</div><div class="not-reason">I wanted to like it, but I found it just isn't as good as using ChatGPT directly. I prefer having a dedicated conversational interface to think through problems rather than relying on inline code autocomplete.</div></div>
          </div>
          <div class="not-item">
            <div class="not-icon">&#128176;</div>
            <div><div class="not-name">WordPress</div><div class="not-reason">Simply too expensive for what I needed. Between hosting costs and the premium plugins required to get true design freedom, it completely violated my strict $0.00 infrastructure mandate.</div></div>
          </div>
        </div>
      </div>
    </div>
  `,
  '/ai/roi': `
    <div class="main--page">
      <div class="page-content">
        <p class="page-label">Business Intelligence</p>
        <h1 class="page-title">Growth & Efficiency Calculator</h1>
        <p style="margin-bottom: 2rem; color: var(--muted);">Estimate the combined impact of automated support and optimized lead capture.</p>

        <div class="verdict-bar" id="verdict-bar">
          <div style="flex: 1;">
            <div class="verdict-text" id="verdict-text">Enter your numbers below to see your estimated ROI.</div>
            <button type="button" class="btn-ghost" id="ai-verdict-btn" onclick="window.getAIVerdict()" style="margin-top: 1rem; font-size: 0.7rem; padding: 0.5rem 1rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;">✨ Generate AI Analysis</button>
          </div>
          <a href="/ai/intake" class="verdict-cta">Get started</a>
        </div>

        <div class="calc-container">
          <div class="input-section">
            <h3 style="margin-bottom: 1.5rem; font-family: var(--serif);">Efficiency Metrics</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
              <div class="form-group"><label>Weekly Inquiries (Email/Phone)</label><input type="number" id="volume" value="50" oninput="window.calcROI()"></div>
              <div class="form-group"><label>Avg. Time per Response (Minutes)</label><input type="number" id="time" value="8" oninput="window.calcROI()"></div>
            </div>
            <h3 style="margin: 2.5rem 0 1.5rem; font-family: var(--serif);">Growth Metrics</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
              <div class="form-group"><label>Estimated Monthly Website Visitors</label><input type="number" id="traffic" value="800" oninput="window.calcROI()"></div>
              <div class="form-group"><label>Avg. Customer Value ($)</label><input type="number" id="value" value="250" oninput="window.calcROI()"></div>
            </div>
            <h3 style="margin: 2.5rem 0 1.5rem; font-family: var(--serif);">Minescout Plan</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
              <div class="form-group">
                <label>Select Plan Tier</label>
                <select id="plan" onchange="window.calcROI()" style="width: 100%; padding: 14px 16px; border: 1px solid #e0dbd3; border-radius: 6px; font-family: var(--sans); font-size: 0.95rem; background: #faf9f8; outline: none; appearance: none; transition: 0.2s;">
                  <option value="59" data-setup="799">Full AI Upgrade — $799 setup + $59/mo</option>
                  <option value="0" data-setup="599">Digital Remodel — $599 one-time</option>
                  <option value="0" data-setup="499">Starter Site — $499 one-time</option>
                  <option value="0" data-setup="150">Widget — $150 one-time</option>
                  </select>
                </div>
              <div class="form-group"><label>AI Coverage (Est. % of questions handled)</label><input type="number" id="aiCoverage" value="80" min="10" max="100" oninput="window.calcROI()"></div>
            </div>
          </div>
          <div class="output-section">
            <div class="result-card">
              <div class="result-label">Annual Business Impact</div>
              <div class="result-val" id="total-impact">$0</div>
              <p style="font-size: 0.75rem; color: rgba(255,255,255,0.4);">Combined value of time saved + new lead revenue</p>
            </div>
            <div class="stat-grid">
              <div class="mini-stat"><div class="mini-label">Monthly Net Value</div><div class="mini-val" id="netMonthly" style="color: #4caf82;">$0</div></div>
              <div class="mini-stat"><div class="mini-label">Payback Period</div><div class="mini-val" id="payback" style="color: var(--accent);">—</div></div>
              <div class="mini-stat"><div class="mini-label">Monthly Hrs Reclaimed</div><div class="mini-val" id="hours-saved">0</div></div>
              <div class="mini-stat"><div class="mini-label">New Leads / Mo</div><div class="mini-val" id="new-leads">0</div></div>
            </div>
            <p class="impact-note">*Based on a conservative 2% increase in conversion rate via instant AI engagement and modern site speed optimization.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  '/ai/intake': `
    <div class="main--page" style="padding: 0; width: 100%;">
      <div class="intake-root">
        <div class="form-wrapper">
          <div class="form-header">
            <h1>Custom Intelligence Intake</h1>
            <p>Provide the operational data for your Minescout AI integration.</p>
          </div>
          <form id="intakeForm" onsubmit="event.preventDefault(); window.openIntakePreview();">
            <div class="form-grid">
              <div class="form-group"><label>Business Name</label><input type="text" id="f_business" required></div>
              <div class="form-group"><label>Primary Contact Name</label><input type="text" id="f_contact" required></div>
              <div class="form-group"><label>Contact Email</label><input type="email" id="f_email" required></div>
              <div class="form-group"><label>Contact Phone</label><input type="tel" id="f_phone" required></div>
              <div class="form-group full"><label>Website URL</label><input type="url" id="f_website" placeholder="https://"></div>
              <div class="form-group full"><label>The Time-Wasters (Top 5 FAQs)</label><textarea id="f_faqs" placeholder="What questions do customers constantly ask you?" required></textarea></div>
              <div class="form-group full"><label>Pricing Structure</label><textarea id="f_pricing" placeholder="Flat rates? Custom quotes? Starting minimums?" required></textarea></div>
              <div class="form-group full"><label>Logistics, Hours, & Policies</label><textarea id="f_logistics" required></textarea></div>
              <div class="form-group full"><label>Conversion Objective & AI Tone</label><textarea id="f_tone" placeholder="Should the AI be professional? Casual? Is the goal to book a call?" required></textarea></div>
            </div>
            <button type="submit" class="intake-btn">Generate Intelligence Document</button>
          </form>
        </div>

        <div class="modal-overlay" id="previewModal">
          <div class="modal-content">
            <div class="modal-actions">
              <button class="btn-outline" onclick="window.closeIntakePreview()">← Edit Answers</button>
              <span style="font-weight: 600; color: var(--fg);">Review Data</span>
              <button class="btn-submit" onclick="window.submitIntakeToCloudflare()">Approve & Submit</button>
            </div>
            <div class="plan-container" id="pdfDocument">
              <div class="status-stamp">Client Intake</div>
              <div class="pdf-header">
                <div class="brand"><h1>Minescout AI</h1><p>Custom Intelligence File</p></div>
                <div style="text-align: right; font-size: 0.85rem; line-height: 1.5; color: var(--fg);">
                  <strong>Client:</strong> <span id="p_client"></span><br>
                  <strong>Project:</strong> Managed AI Integration<br>
                  <strong>Date:</strong> <span id="p_date"></span>
                </div>
              </div>
              <section>
                <h2>Part 01: The Basics</h2>
                <ul class="question-list">
                  <li><strong>Business Name:</strong> <div class="data-fill" id="p_business"></div></li>
                  <li><strong>Primary Contact:</strong> <div class="data-fill" id="p_contact"></div></li>
                  <li><strong>Website URL:</strong> <div class="data-fill" id="p_website"></div></li>
                  <li><strong>Email & Phone:</strong> <div class="data-fill" id="p_contactInfo"></div></li>
                </ul>
              </section>
              <section>
                <h2>Part 02: Knowledge Base & Policies</h2>
                <ul class="question-list">
                  <li><strong>The Time-Wasters (FAQs):</strong> <div class="data-fill" id="p_faqs"></div></li>
                  <li><strong>Pricing Structure:</strong> <div class="data-fill" id="p_pricing"></div></li>
                  <li><strong>Logistics & Hours:</strong> <div class="data-fill" id="p_logistics"></div></li>
                </ul>
              </section>
              <section>
                <h2>Part 03: Conversion & Voice</h2>
                <ul class="question-list">
                  <li><strong>Tone & Objectives:</strong> <div class="data-fill" id="p_tone"></div></li>
                </ul>
              </section>
              <div class="pdf-footer">
                <div>Generated by Minescout AI System</div><div>minescout.net/ai</div>
              </div>
            </div>
          </div>
        </div>

        <div id="loading-screen">
          <div class="spinner"></div>
          <h2 style="font-family: var(--serif); color: var(--fg);">Encrypting & Transmitting</h2>
          <p style="color: var(--muted);">Routing data via Minescout Edge Network...</p>
        </div>
      </div>
    </div>
  `,
  '/ai/generator/audit': `
    <div class="main--page" style="display:block; width:100%; max-width:100%; padding: 0;">
      <div class="audit-root">
        <div class="app-header no-print">
          <div class="toolbar-top">
            <div>
              <h2 style="font-family: var(--serif); font-size: 1.2rem; margin: 0; line-height: 1; color: var(--fg);">Minescout Operations</h2>
              <p style="margin: 0; font-size: 0.75rem; color: var(--muted);">Autonomous Target Scanner v4.0 (Edge Linked)</p>
            </div>
            <button class="btn" onclick="window.print()">Export Audit PDF</button>
          </div>
          <div class="mode-toggle">
            <button id="btn-auto" class="mode-btn active" onclick="window.setAuditMode('auto')">Auto Scan (Edge API)</button>
            <button id="btn-manual" class="mode-btn" onclick="window.setAuditMode('manual')">Manual Override (Air-Gap)</button>
            <label class="offer-settings"><input type="checkbox" id="charter-toggle"> Offer 'Charter' Free Setup</label>
          </div>
          <div id="panel-auto" class="scanner-controls">
            <div class="input-row">
              <input type="url" id="target-url" placeholder="Enter target URL (e.g., sammamishbotanical.org)" />
              <button class="btn" onclick="window.runAuditScan()">Run Diagnostic</button>
            </div>
          </div>
          <div id="panel-manual" class="scanner-controls" style="display: none;">
            <div class="input-row">
              <input type="url" id="manual-url" placeholder="Target URL (Just for the PDF report)" />
              <select id="manual-rec-type">
                <option value="full">Pitch: Full Makeover w/ AI</option>
                <option value="remodel">Pitch: Remodel Only (Headless CMS)</option>
              </select>
              <button class="btn" onclick="window.runAuditScan()">Run Diagnostic</button>
            </div>
            <textarea id="manual-code" placeholder="Right-click target site -> 'View Page Source' -> Paste all HTML code here..."></textarea>
          </div>
          <div id="scan-status" class="status-text" style="text-align: left;">System Ready</div>
        </div>

        <div class="plan-container" contenteditable="true">
          <div class="status-stamp" id="doc-stamp">Action Required</div>
          <header>
            <div class="brand"><h1>Minescout AI</h1><p>Digital Health & Conversion Audit</p></div>
            <div style="text-align: right; font-size: 0.85rem; line-height: 1.5; color: var(--fg);">
              <strong>Generated by:</strong> Minescout Engine<br>
              <strong>Date:</strong> <span id="auto-date"></span>
            </div>
          </header>
          <div class="target-meta">
            <div class="meta-block"><label>Target Infrastructure</label><div id="out-name">Pending Scan...</div></div>
            <div class="meta-block"><label>URL Scanned</label><div id="out-url" style="color: var(--accent); font-family: var(--sans);">Pending...</div></div>
          </div>
          <section><p>An automated structural scan of your primary web infrastructure was conducted to evaluate lead-conversion efficiency and modern AI readiness. The results indicate friction in your current digital operations.</p></section>
          <section>
            <h2>Diagnostic Findings</h2>
            <div class="diagnostic-grid" id="audit-results"><p style="color: var(--muted); font-size: 0.9rem; font-style: italic;">Select a mode and click "Run Diagnostic" to generate findings...</p></div>
          </section>
          <section class="solution-box" id="audit-solution">
            <h3>The Minescout Upgrade</h3>
            <p>To resolve these conversion bottlenecks, we recommend a complete architectural overhaul tailored to your specific operational needs.</p>
          </section>
          <footer style="margin-top: 50px; padding-top: 20px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--muted); font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;">
            <div>Verified by Minescout Lead Architect</div>
            <div>minescout.net/ai</div>
          </footer>
        </div>
      </div>
    </div>
  `,
  '/ai/admin': `
    <div id="admin-root">
      <div id="admin-loading-screen">
        <div class="ls-logo">Minescout AI</div><div class="ls-sub">Admin</div>
        <div class="ls-bar"><div class="ls-fill"></div></div>
      </div>
      <div id="login-screen">
        <div class="login-box">
          <div class="login-box-title">Admin Sign In</div><div class="login-box-sub">minescout.net/ai/admin</div>
          <div class="lf"><label>Email</label><input type="email" id="l-email" placeholder="thomas@minescout.net" /></div>
          <div class="lf"><label>Password</label><input type="password" id="l-pass" placeholder="••••••••" /></div>
          <button class="login-btn" id="l-btn" onclick="doLogin()">Sign In</button>
          <div class="login-err" id="l-err"></div>
        </div>
      </div>
      <div id="admin">
        <div class="topbar">
          <div><span class="topbar-logo">Minescout AI</span><span class="topbar-badge">Admin</span></div>
          <div class="topbar-right"><span class="topbar-user" id="admin-user-label"></span><button class="signout-btn" onclick="doSignOut()">Sign out</button></div>
        </div>
        <div class="shell">
          <nav class="sidenav">
            <div class="sidenav-section">Main</div>
            <a href="#" class="active" onclick="showPanel('dashboard',this)"><span class="sidenav-icon">&#128202;</span>Dashboard</a>
            <a href="#" onclick="showPanel('clients',this)"><span class="sidenav-icon">&#128101;</span>Clients</a>
            <a href="#" onclick="showPanel('corrections',this)"><span class="sidenav-icon">&#9997;&#65039;</span>Corrections</a>
            <div class="sidenav-section">Tools</div>
            <a href="#" onclick="showPanel('new-client',this)"><span class="sidenav-icon">&#10133;</span>New Client</a>
            <a href="/portal" target="_blank"><span class="sidenav-icon">&#128279;</span>Client Portal ↗</a>
            <a href="/ai" target="_blank"><span class="sidenav-icon">&#127760;</span>Public Site ↗</a>
          </nav>
          <div class="main-area">
            <div class="main-content">
              <div class="panel active" id="panel-dashboard">
                <div class="panel-title">Dashboard</div><p class="panel-desc">Overview of all active clients and the platform.</p>
                <div class="dash-grid">
                  <div class="dash-stat"><span class="dash-val g" id="d-clients">—</span><span class="dash-label">Active clients</span></div>
                  <div class="dash-stat"><span class="dash-val" id="d-convos">—</span><span class="dash-label">Total conversations</span></div>
                  <div class="dash-stat"><span class="dash-val a" id="d-pending">—</span><span class="dash-label">Pending corrections</span></div>
                </div>
                <div class="card">
                  <div class="card-header"><span class="card-label">Client roster</span><button class="btn btn-primary btn-sm" onclick="showPanel('new-client', document.querySelector('.sidenav a:nth-child(5)'))">+ New client</button></div>
                  <div id="dash-client-list"><div class="empty-state">Loading...</div></div>
                </div>
              </div>
              <div class="panel" id="panel-clients">
                <div class="panel-title">Clients</div><p class="panel-desc">All registered client accounts. Click a client to view or edit their data.</p>
                <div class="card">
                  <div class="card-header"><span class="card-label">All clients</span><button class="btn btn-primary btn-sm" onclick="showPanel('new-client', document.querySelector('.sidenav a:nth-child(5)'))">+ New client</button></div>
                  <div id="clients-list"><div class="empty-state">Loading...</div></div>
                </div>
              </div>
              <div class="panel" id="panel-corrections">
                <div class="panel-title">Corrections</div><p class="panel-desc">Corrections submitted by clients across all accounts. Mark as applied once you've updated the AI.</p>
                <div class="card">
                  <div class="card-header"><span class="card-label">Pending corrections</span><span id="pending-count-label" style="font-size:0.65rem;color:var(--muted);"></span></div>
                  <div id="corrections-list"><div class="empty-state">Loading...</div></div>
                </div>
              </div>
              <div class="panel" id="panel-new-client">
                <div class="panel-title">New Client</div><p class="panel-desc">Create a Firebase account and seed their Firestore data in one flow. They can log in immediately after.</p>
                <div class="card">
                  <div class="card-header"><span class="card-label">Account</span></div>
                  <div class="card-body">
                    <div class="field-row">
                      <div class="field"><label>Client email</label><input type="email" id="nc-email" placeholder="client@theirbusiness.com" /></div>
                      <div class="field"><label>Temporary password</label><input type="text" id="nc-pass" placeholder="Min 6 characters" /></div>
                    </div>
                  </div>
                </div>
                <div class="card">
                  <div class="card-header"><span class="card-label">Business info</span></div>
                  <div class="card-body">
                    <div class="field-row">
                      <div class="field"><label>Business name</label><input type="text" id="nc-name" placeholder="e.g. Overlake Fly Fishing Club" /></div>
                      <div class="field"><label>Phone</label><input type="text" id="nc-phone" placeholder="e.g. (425) 555-0100" /></div>
                    </div>
                    <div class="field"><label>Address</label><input type="text" id="nc-address" placeholder="e.g. 123 Main St, Sammamish WA 98075" /></div>
                    <div class="field-row">
                      <div class="field"><label>Website</label><input type="text" id="nc-website" placeholder="https://..." /></div>
                      <div class="field">
                        <label>Plan</label>
                        <select id="nc-plan">
                          <option value="Charter Partner">Charter Partner (Free)</option>
                          <option value="Full AI Upgrade">Full AI Upgrade ($799 + $59/mo)</option>
                          <option value="Digital Remodel">Digital Remodel ($599)</option>
                          <option value="Starter Site">Starter Site ($499)</option>
                          <option value="Widget">Widget ($150)</option>
                        </select>
                      </div>
                    </div>
                    <div class="field"><label>Hours</label><input type="text" id="nc-hours" placeholder="e.g. Mon–Fri 9am–5pm. Closed weekends." /></div>
                    <div class="field"><label>About / description (2–3 sentences)</label><textarea id="nc-description" placeholder="What does this business do?"></textarea></div>
                    <div class="field"><label>Services (one per line)</label><textarea id="nc-services" placeholder="Service 1\nService 2\nService 3"></textarea></div>
                  </div>
                </div>
                <div class="card">
                  <div class="card-header"><span class="card-label">Seed FAQs (optional)</span></div>
                  <div class="card-body">
                    <div id="nc-faqs"></div>
                    <button class="btn btn-ghost btn-sm" onclick="addNcFaqRow()" style="margin-top:0.75rem;">+ Add FAQ</button>
                  </div>
                </div>
                <div style="display:flex;gap:0.75rem;align-items:center;margin-bottom:1rem;">
                  <button class="btn btn-primary" id="nc-submit-btn" onclick="createClient()">Create client account</button>
                  <span style="font-size:0.68rem;color:var(--muted);">Creates Firebase account + seeds Firestore</span>
                </div>
                <div class="seed-progress" id="seed-progress"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-bg" id="client-modal">
        <div class="modal">
          <div class="modal-header"><div class="modal-title" id="cm-title">Client</div><button class="modal-close" onclick="closeModal('client-modal')">&times;</button></div>
          <div class="modal-body">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;">
              <div><div style="font-size:0.6rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--muted);margin-bottom:0.3rem;">UID</div><div style="font-size:0.72rem;color:var(--fg);word-break:break-all;" id="cm-uid"></div></div>
              <div><div style="font-size:0.6rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--muted);margin-bottom:0.3rem;">Email</div><div style="font-size:0.72rem;color:var(--fg);" id="cm-email"></div></div>
              <div><div style="font-size:0.6rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--muted);margin-bottom:0.3rem;">Plan</div><div style="font-size:0.72rem;color:var(--fg);" id="cm-plan"></div></div>
              <div><div style="font-size:0.6rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--muted);margin-bottom:0.3rem;">Conversations</div><div style="font-size:0.72rem;color:var(--fg);" id="cm-convos"></div></div>
            </div>
            <div style="font-size:0.6rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--muted);margin-bottom:0.5rem;">FAQs loaded</div>
            <div id="cm-faqs" style="font-size:0.75rem;color:var(--muted);line-height:1.7;"></div>
          </div>
          <div class="modal-footer"><button class="btn btn-danger btn-sm" id="cm-delete-btn">Delete client</button></div>
        </div>
      </div>

      <div class="modal-bg" id="delete-modal">
        <div class="modal">
          <div class="modal-header"><div class="modal-title">Delete client?</div><button class="modal-close" onclick="closeModal('delete-modal')">&times;</button></div>
          <div class="modal-body"><p style="font-size:0.82rem;color:var(--muted);line-height:1.7;">This will delete all Firestore data for <strong id="del-client-name" style="color:var(--fg);"></strong>. The Firebase Auth account must be deleted separately from the Firebase Console.<br><br>This cannot be undone.</p></div>
          <div class="modal-footer"><button class="btn btn-ghost btn-sm" onclick="closeModal('delete-modal')">Cancel</button><button class="btn btn-danger btn-sm" id="del-confirm-btn">Yes, delete</button></div>
        </div>
      </div>

      <div class="toast" id="toast"></div>
    </div>
  `,
  '/ai/demo/index.html': `
    <div class="main--page">
      <div class="page-content">
        <p class="page-label">Minescout AI</p>
        <h1 class="page-title">Live Demo</h1>
        <p style="color: var(--muted); font-size: 0.9rem; line-height: 1.6;">Agent interface placeholder. This space is reserved for the live AI chat widget implementation.</p>
      </div>
    </div>
  `,
  '404': `
    <div class="not-found-wrap">
      <div class="not-found-number">40<em>4</em></div>
      <h1 class="not-found-title">Page Not Found</h1>
      <p class="not-found-desc">Looks like you've ventured off the map. The page you're looking for doesn't exist or has been moved.</p>
      <div class="not-found-links">
        <a href="/" class="not-found-link primary">Return Home</a>
        <a href="/work" class="not-found-link">View Work</a>
      </div>
    </div>
  `,
  
  // -- ADD-ON COMPONENTS --
  '/contact': `
    <div class="main--page">
      <div class="page-content contact-wrap">
        <p class="page-label">Contact</p>
        <h1 class="page-title">Get in Touch</h1>
        <p class="contact-intro">
          Whether you want to collaborate on a project, ask about my work, or just say hello —
          I'd love to hear from you. I'll get back to you as soon as I can.
        </p>
        <form class="contact-form" id="contact-form">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" placeholder="Your name" required />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" placeholder="your@email.com" required />
          </div>
          <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" name="message" placeholder="What's on your mind?" required></textarea>
          </div>
          <button type="submit" class="form-submit" id="form-btn">Send Message</button>
        </form>
        <div class="form-success" id="form-success">
          ✓ &nbsp; Message sent! I'll get back to you soon.
        </div>
        <hr class="contact-divider" />
        <p class="contact-alt">
          You can also reach me directly via email or find my work at
          <a href="https://minescout.net" target="_blank">minescout.net</a> and
          <a href="https://github.com/Theminescout" target="_blank">GitHub</a>.
        </p>
      </div>
    </div>
  `,
  '/guestbook': `
    <div class="main--page">
      <div class="page-content guestbook-wrap" id="gb-wrap">
        <p class="page-label">Guestbook</p>
        <h1 class="page-title">Say Hello</h1>
        <p class="gb-intro">
          You stopped by — leave a note! Whether you have a question, a kind word,
          or just want to say hi, I'd love to hear from you.
        </p>
        <div class="gb-form">
          <div class="gb-form-row">
            <div class="form-group">
              <label for="gb-name">Name <span style="color:var(--accent)">*</span></label>
              <input type="text" id="gb-name" placeholder="Your name" maxlength="60" required />
            </div>
            <div class="form-group">
              <label for="gb-location">Location <span style="color:var(--muted);font-weight:300">(optional)</span></label>
              <input type="text" id="gb-location" placeholder="City, Country" maxlength="60" />
            </div>
          </div>
          <div class="form-group">
            <label for="gb-message">Message <span style="color:var(--accent)">*</span></label>
            <textarea id="gb-message" placeholder="Leave a note..." maxlength="500"></textarea>
          </div>
          <button class="gb-submit" id="gb-submit">Post to Guestbook</button>
        </div>
        <div class="admin-bar">
          <button class="admin-toggle" id="admin-toggle" onclick="window.gbShowPin()">Admin</button>
          <span class="admin-active-label">● Admin mode on</span>
          <div class="admin-pin-wrap" id="admin-pin-wrap">
            <input type="password" class="admin-pin-input" id="admin-pin" placeholder="Enter PIN" />
            <button class="admin-pin-btn" onclick="window.gbCheckPin()">Unlock</button>
          </div>
        </div>
        <p class="gb-entries-label" id="entries-label">— Entries —</p>
        <div class="gb-entries" id="gb-entries">
          <p class="gb-loading">Loading entries...</p>
        </div>
      </div>
    </div>
  `,
  '/ask': `
    <div class="main--page">
      <div class="page-content ask-wrap">
        <div id="status-badge" class="status-badge status-loading">● Scraping Live Data...</div>
        <h1 class="page-title">Ask Thomas</h1>
        
        <div class="chat-window" id="chat-window">
          <div id="chat-empty" style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#aaa; font-size:0.8rem; text-align:center;">
            <p>I am connected directly to Thomas's live resume and Minescout AI infrastructure. What would you like to know?</p>
          </div>
        </div>

        <div class="chat-input-row">
          <input type="text" class="chat-input" id="chat-input" placeholder="Loading Thomas's data..." autocomplete="off" disabled />
          <button class="chat-send" id="chat-send" onclick="window.sendMessage()" disabled>Send</button>
        </div>
      </div>
    </div>
  `,
  '/ai/pricing': `
    <div class="main--page">
      <div class="page-content">
        <p class="page-label">Minescout Studio</p>
        <h1 class="page-title">Pricing</h1>

        <div class="anchor-bar" style="opacity:0;animation:fadeUp 0.5s ease 0.15s forwards;">
          <div class="anchor-bar-icon">💡</div>
          <div class="anchor-bar-text">
            This isn't the cheapest option—but it's one of the best values. MineScout competes on <strong>speed, quality, and personal service</strong>, delivering agency-quality results without agency complexity.
          </div>
        </div>

        <div class="pricing-wrap" style="margin: 0 auto; max-width: 850px;">

          <div class="tiers">

            <div class="tier tier--horizontal" style="opacity:0;animation:fadeUp 0.5s ease 0.2s forwards;">
              <div class="tier-h-left">
                <div class="tier-name">Portfolio Website</div>
                <div class="tier-price-sub">Starting at</div>
                <div class="tier-price">$<em>750</em></div>
              </div>
              <div class="tier-h-body">
                <p class="tier-target">Perfect for portfolios, creators, freelancers, and resumes.</p>
                <ul class="tier-features tier-features--row">
                  <li class="tier-feature">Custom design</li>
                  <li class="tier-feature">Responsive layout</li>
                  <li class="tier-feature">Contact form</li>
                  <li class="tier-feature">SEO basics</li>
                  <li class="tier-feature">Fast hosting setup</li>
                </ul>
              </div>
              <div class="tier-h-cta">
                <a href="/contact" class="tier-cta btn-ghost">Book a call</a>
              </div>
            </div>

            <div class="tier tier--horizontal" style="opacity:0;animation:fadeUp 0.5s ease 0.27s forwards;">
              <div class="tier-h-left">
                <div class="tier-name">Professional Website</div>
                <div class="tier-price-sub">Starting at</div>
                <div class="tier-price">$<em>1,500</em></div>
              </div>
              <div class="tier-h-body">
                <p class="tier-target">Perfect for photographers, consultants, creators, and local services.</p>
                <ul class="tier-features tier-features--row">
                  <li class="tier-feature">Everything in Portfolio</li>
                  <li class="tier-feature">Multiple pages</li>
                  <li class="tier-feature">Booking/contact integrations</li>
                  <li class="tier-feature">Analytics</li>
                  <li class="tier-feature">Performance optimization</li>
                </ul>
              </div>
              <div class="tier-h-cta">
                <a href="/contact" class="tier-cta btn-ghost">Book a call</a>
              </div>
            </div>

            <div class="tier tier--horizontal" style="opacity:0;animation:fadeUp 0.5s ease 0.34s forwards;">
              <div class="tier-h-left">
                <div class="tier-name">Business Website</div>
                <div class="tier-price-sub">Starting at</div>
                <div class="tier-price">$<em>2,500</em></div>
              </div>
              <div class="tier-h-body">
                <p class="tier-target">Perfect for restaurants, contractors, medical, legal, and retail.</p>
                <ul class="tier-features tier-features--row">
                  <li class="tier-feature">Discovery meeting</li>
                  <li class="tier-feature">Fully custom design</li>
                  <li class="tier-feature">Advanced SEO</li>
                  <li class="tier-feature">Custom Forms</li>
                  <li class="tier-feature">AI-ready foundation</li>
                </ul>
              </div>
              <div class="tier-h-cta">
                <a href="/contact" class="tier-cta btn-primary">Book a call</a>
              </div>
            </div>

            <div class="tier tier--horizontal tier--featured" style="opacity:0;animation:fadeUp 0.5s ease 0.41s forwards;">
              <div class="tier-h-left">
                <div class="tier-name">Business + AI</div>
                <div class="tier-price-sub">Starting at</div>
                <div class="tier-price">$<em>3,500</em></div>
              </div>
              <div class="tier-h-body">
                <p class="tier-target">The ultimate growth platform. A complete custom website integrated with an autonomous AI employee.</p>
                <ul class="tier-features tier-features--row">
                  <li class="tier-feature">Custom Website</li>
                  <li class="tier-feature">Custom AI Assistant</li>
                  <li class="tier-feature">Knowledge Base</li>
                  <li class="tier-feature">Automation</li>
                  <li class="tier-feature">Dashboard</li>
                </ul>
              </div>
              <div class="tier-h-cta">
                <a href="/contact" class="tier-cta btn-primary">Book a call</a>
              </div>
            </div>

          </div>
        </div>

        <div class="ai-callout" style="opacity:0;animation:fadeUp 0.5s ease 0.45s forwards;">
          <div class="ai-callout-title" style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 0.5rem;">🎓 Student & Startup Program</div>
          <div class="ai-callout-desc" style="color: var(--fg); font-size: 0.9rem;">
            Just getting started? I know what it's like to launch your first project. That's why I reserve a limited number of discounted projects each semester for students, nonprofits, and first-time entrepreneurs.<br><br>
            Typical projects range from <strong>$250–$750</strong> depending on scope. Availability is extremely limited.
          </div>
          <div style="margin-top: 1.5rem;">
            <a href="/contact" class="btn-ghost">Apply for the Program</a>
          </div>
        </div>

        <div class="pricing-section-label" style="--ad:0.38s;">Maintenance & Support Plans</div>
        <div style="font-size:0.85rem; color:var(--muted); text-align:center; margin:-1rem auto 1.5rem; max-width:600px; opacity:0; animation:fadeUp 0.5s ease 0.46s forwards;">
          💡 <strong>Please note:</strong> None of these recurring monthly support plans are required to work with me. You are completely free to handle your own hosting independently, however updates can always be handled by me.
        </div>
        
        <div class="dash-grid" style="margin-bottom:2rem; opacity:0; animation:fadeUp 0.5s ease 0.48s forwards; display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;">
          <div class="dash-stat" style="text-align: left;">
            <div style="font-size:1rem;font-family:var(--serif);font-weight:700;color:var(--fg);margin-bottom:0.3rem;">Priority Care</div>
            <div style="color:var(--accent); font-weight: 600; margin-bottom: 0.5rem; font-size: 0.85rem;">$10 / month</div>
            <div style="font-size:0.8rem;color:var(--muted);line-height:1.6;">Priority support tickets and code checkups. <strong>Does not include hosting.</strong></div>
          </div>
          <div class="dash-stat" style="text-align: left;">
            <div style="font-size:1rem;font-family:var(--serif);font-weight:700;color:var(--fg);margin-bottom:0.3rem;">Hosting Only</div>
            <div style="color:var(--accent); font-weight: 600; margin-bottom: 0.5rem; font-size: 0.85rem;">$15 / month</div>
            <div style="font-size:0.8rem;color:var(--muted);line-height:1.6;">Ultra-fast edge hosting and SSL certificates.</div>
          </div>
          <div class="dash-stat" style="text-align: left;">
            <div style="font-size:1rem;font-family:var(--serif);font-weight:700;color:var(--fg);margin-bottom:0.3rem;">Hosting + Maintenance</div>
            <div style="color:var(--accent); font-weight: 600; margin-bottom: 0.5rem; font-size: 0.85rem;">$40 / month</div>
            <div style="font-size:0.8rem;color:var(--muted);line-height:1.6;">Includes hosting, platform updates, and regular backups.</div>
          </div>
          <div class="dash-stat" style="text-align: left;">
            <div style="font-size:1rem;font-family:var(--serif);font-weight:700;color:var(--fg);margin-bottom:0.3rem;">Business Care</div>
            <div style="color:var(--accent); font-weight: 600; margin-bottom: 0.5rem; font-size: 0.85rem;">$75 / month</div>
            <div style="font-size:0.8rem;color:var(--muted);line-height:1.6;">Hosting, updates, backups, AI maintenance, and priority support.</div>
          </div>
        </div>

        <div class="pricing-section-label" style="--ad:0.5s;">Not sure what plan?</div>
        <div style="font-size:0.78rem;color:var(--muted);line-height:1.7;margin-bottom:1.25rem;">
          Take a quick quiz to find the best fit for your business.
          <button type="button" class="btn-ghost" id="open-plan-quiz" style="margin-left:0.5rem; padding: 0.5rem 1rem;">Take the Quiz</button>
        </div>

        <div class="plan-quiz is-hidden" id="plan-quiz">
          <div class="plan-quiz-header">
            <div class="plan-quiz-title">Find your plan</div>
            <div class="plan-quiz-desc">Answer 4 questions and we&rsquo;ll suggest the best plan for you.</div>
          </div>
          <div class="plan-quiz-progress"><div class="plan-quiz-progress-fill" id="quiz-progress"></div></div>
          <div class="plan-quiz-body" id="quiz-body">
            <div class="plan-quiz-step active" data-step="1">
              <div class="plan-quiz-q">What best describes your situation?</div>
              <div class="plan-quiz-options">
                <button type="button" class="plan-quiz-opt" data-starter="2">I don&rsquo;t have a website yet</button>
                <button type="button" class="plan-quiz-opt" data-remodel="2">I have a site but it needs a serious upgrade</button>
                <button type="button" class="plan-quiz-opt" data-ai="2">I have a decent site but I want an AI on it</button>
                <button type="button" class="plan-quiz-opt" data-widget="2">I just need a specific tool or form added</button>
              </div>
            </div>
            <div class="plan-quiz-step" data-step="2">
              <div class="plan-quiz-q">How do you currently handle customer questions?</div>
              <div class="plan-quiz-options">
                <button type="button" class="plan-quiz-opt" data-starter="1" data-remodel="1">Phone or email — I answer them myself</button>
                <button type="button" class="plan-quiz-opt" data-ai="2">I miss leads because I can&rsquo;t respond fast enough</button>
                <button type="button" class="plan-quiz-opt" data-widget="2">I need an instant quote or calculator tool</button>
              </div>
            </div>
            <div class="plan-quiz-step" data-step="3">
              <div class="plan-quiz-q">How important is after-hours customer coverage to you?</div>
              <div class="plan-quiz-options">
                <button type="button" class="plan-quiz-opt" data-starter="1" data-remodel="1">Not very — I can follow up next day</button>
                <button type="button" class="plan-quiz-opt" data-ai="2">Very — I lose jobs when I don&rsquo;t respond fast</button>
                <button type="button" class="plan-quiz-opt" data-widget="1">Somewhat — a form would help capture leads</button>
              </div>
            </div>
            <div class="plan-quiz-step" data-step="4">
              <div class="plan-quiz-q">What&rsquo;s your priority right now?</div>
              <div class="plan-quiz-options">
                <button type="button" class="plan-quiz-opt" data-starter="2" data-remodel="1">Looking professional online</button>
                <button type="button" class="plan-quiz-opt" data-ai="2">Automating customer questions and lead capture</button>
                <button type="button" class="plan-quiz-opt" data-widget="2">Adding a specific interactive feature to my site</button>
              </div>
            </div>
          </div>
          <div class="plan-quiz-nav" style="padding: 0 1.5rem 1.5rem;">
            <button type="button" class="plan-quiz-back" id="quiz-back" style="visibility: hidden;">&larr; Back</button>
            <button type="button" class="plan-quiz-next btn-primary" id="quiz-next" disabled>Next Step</button>
          </div>
          <div class="plan-quiz-result" id="quiz-result">
            <div class="plan-quiz-result-label">Our recommendation</div>
            <div class="plan-quiz-result-title" id="quiz-result-title"></div>
            <div class="plan-quiz-result-desc" id="quiz-result-desc"></div>
            <a href="/contact" class="plan-quiz-result-cta btn-primary" id="quiz-result-cta">Get started</a>
            <button type="button" class="plan-quiz-retry" id="quiz-retry">Take the quiz again</button>
          </div>
        </div>

        <div class="pricing-cta">
          <div class="pricing-cta-text">
            <div class="pricing-cta-title">Not sure which plan?</div>
            <div class="pricing-cta-desc">Send me a quick message and I&rsquo;ll recommend the right fit based on your site and goals. No sales pitch &mdash; just a straight answer.</div>
          </div>
          <div class="pricing-cta-btns">
            <a href="/contact" class="btn-primary">Get in touch</a>
          </div>
        </div>

        <p class="pricing-disclaimer">
          Minescout Studio is operated by Thomas Carleton, a student developer in Sammamish, WA.
          <a href="/contact">Questions? Reach out directly.</a>
        </p>

      </div>
    </div>
  `,
  '/ai/review': `
    <div class="main--page">
      <div class="page-content">
        <p class="page-label">Client Feedback</p>
        <h1 class="page-title">Project Review</h1>
        
        <p style="color: var(--muted); margin-bottom: 2.5rem; max-width: 650px; line-height: 1.6; font-size: 1.05rem;">
          Thank you for trusting Minescout AI with your digital infrastructure. Your honest feedback helps me improve the platform and shows future clients what to expect when working together.
        </p>

        <div style="border: 1px solid var(--border); border-radius: 8px; overflow: hidden; background: #ffffff; box-shadow: 0 4px 20px rgba(0,0,0,0.02);">
          <iframe 
            src="https://docs.google.com/forms/d/e/1FAIpQLSdwRb4TMCKMLCqudnWCnckwChUHpfvdUsW4ASfHUD-ufaux_g/viewform?embedded=true" 
            width="100%" 
            height="2000" 
            frameborder="0" 
            marginheight="0" 
            marginwidth="0"
            style="display: block;">
            Loading…
          </iframe>
        </div>
        
      </div>
    </div>
  `,
};

// Ensure aliases are set
views['/ai/info'] = views['/ai/intake'];
views['/legal'] = views['/ai/legal'];
views['/ai/clients/portal'] = views['/portal'];
