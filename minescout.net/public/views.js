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
      <div class="page-content" style="max-width: 720px;">
        <div class="print-header">
          <h1 class="print-name">Thomas Carleton</h1>
          <div class="print-contact">Sammamish, WA &nbsp;|&nbsp; 425-520-8683 &nbsp;|&nbsp; tmcarleton11@gmail.com &nbsp;|&nbsp; minescout.net</div>
        </div>
        <p class="page-label">Resume</p>
        <h1 class="page-title">Experience &amp; Leadership</h1>
        <button onclick="window.downloadResume()" class="pdf-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2-2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          Download PDF / Print
        </button>
        <p class="competencies-header">2026 Strategic Competencies</p>
        <div class="competencies-grid">
          <div class="comp-card"><h4>SaaS Architecture</h4><p>Architecting multi-tenant engines utilizing header-based routing and serverless Edge workers for scalable, zero-infrastructure deployment.</p></div>
          <div class="comp-card"><h4>Hardware Integration</h4><p>Proficient in Fusion 360 CAD modeling, electrical wiring, and mechanical fabrication.</p></div>
          <div class="comp-card"><h4>Project Leadership</h4><p>Eagle Scout experienced in managing volunteer logistics, community projects, and mechanical prototyping.</p></div>
        </div>
        <table class="resume-table">
          <tbody>
            <tr class="year-row"><td colspan="3">2026</td></tr>
            <tr class="entry-row" style="--delay: 100ms;"><td>Mar 2026</td><td>Eagle Scout</td><td><strong>Scouting America, Troop 571</strong> — Achieved the highest rank in Scouting. Directed a comprehensive community literacy initiative, leading a team of volunteers over 60+ hours to construct and install a local Little Free Library.</td></tr>
            <tr class="entry-row" style="--delay: 150ms;"><td>Mar-Apr 2026</td><td>FRC Team 1294</td><td><strong>DCMP Qualifier & District Champion</strong> — Secured 1st place at the FIRST Robotics Glacier Peak District Event and advanced to the Pacific Northwest District Championship (DCMP). Assisted with mechanical assembly and hardware integration for the turret subteam.</td></tr>
            <tr class="entry-row" style="--delay: 200ms;"><td>Feb 2026</td><td>Minescout AI</td><td><strong>Founder & Systems Architect</strong> — Launched a Multi-Tenant SaaS platform offering automated architecture and AI integrations. Engineered proprietary routing using Cloudflare Workers and KV storage.</td></tr>
            <tr class="entry-row" style="--delay: 250ms;"><td>Jan-Apr 2026</td><td>The Chop Lab</td><td><strong>Lead Designer & Developer</strong> — Developed a high-performance digital storefront for an artisanal ceramics firm. Recently architected a full v2 overhaul, migrating the platform to a custom Single Page Application (SPA) to support expanded product lines and a redesigned UI.</td></tr>
          </tbody>
          <tbody>
            <tr class="year-row"><td colspan="3">2025</td></tr>
            <tr class="entry-row" style="--delay: 300ms;"><td>2025</td><td>FRC Team 1294</td><td><strong>Robotics Turret Subteam</strong> — Assisted with the mechanical assembly of turret systems and participated in the 2025 Robotics Showcase.</td></tr>
            <tr class="entry-row" style="--delay: 350ms;"><td>Mar 2025</td><td>National History Day</td><td><strong>Regional Award Winner</strong> — Produced and edited a junior individual documentary titled <em>"A Safe Workplace: A Right, And A Responsibility,"</em> for the East Puget Sound Regional.</td></tr>
            <tr class="entry-row" style="--delay: 400ms;"><td>Jan 2025</td><td>Future City</td><td><strong>Washington Regional Champion</strong> — Awarded Best Overall City Essay, Best Land Surveying Practices (NCEES), and the Student Choice Award at Shoreline Community College for excellence in urban engineering and planning.</td></tr>
            <tr class="entry-row" style="--delay: 450ms;"><td>2025</td><td>Minescout Beta / Life</td><td><strong>Founder</strong> — Established a beta testing environment and technology review platform to validate LLM performance, site architecture, and AI-assisted workflows.</td></tr>
          </tbody>
          <tbody>
            <tr class="year-row"><td colspan="3">Education & Community</td></tr>
            <tr class="entry-row" style="--delay: 500ms;"><td>2025–Present</td><td>Eastlake High School</td><td><strong>9th Grade (GPA: 4.0)</strong> — Focusing on Computer Science, Engineering Design, and Fusion 360 modeling.</td></tr>
            <tr class="entry-row" style="--delay: 550ms;"><td>2024–Present</td><td>Sammamish Botanical</td><td><strong>Community Volunteer</strong> — Dedicating hours to general site maintenance and supporting local horticulture and community garden operations.</td></tr>
            <tr class="entry-row" style="--delay: 600ms;"><td>2023–2025</td><td>Pack 551</td><td><strong>Den Chief</strong> — Mentored younger Cub Scouts and led den activities, earning the Den Chief Service Award for consistent leadership and role modeling.</td></tr>
            <tr class="entry-row" style="--delay: 650ms;"><td>2023–2025</td><td>Stella Schola / RHMS</td><td><strong>7th & 8th Grade (GPA: 4.0)</strong> — Inducted into the National Junior Honor Society. Recognized for English Achievement and School Spirit.</td></tr>
          </tbody>
        </table>
        <div class="resume-skills">
          <div class="skills-block"><span class="skills-label">Tech Stack</span><span class="skills-value">React, JavaScript (ES6+), Cloudflare Workers, Python, HTML5/CSS3, Git/GitHub, VS Code</span></div>
          <div class="skills-block"><span class="skills-label">Engineering</span><span class="skills-value">Fusion 360 (CAD Modeling), Electrical Wiring, Mechanical Fabrication, Robotics Assembly</span></div>
          <div class="skills-block"><span class="skills-label">Activities</span><span class="skills-value">City of Sammamish Park Restoration, Scouting America</span></div>
          <div class="skills-block"><span class="skills-label">Athletics</span><span class="skills-value">Distance running — 5K PR: 26:00</span></div>
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
        <p class="ai-eyebrow">Minescout AI &middot; Architecture Node</p>
        <h1 class="ai-title">The <em>Managed Intelligence</em><br>Platform for Sammamish.</h1>
        <p class="ai-lead">I engineer multi-tenant digital systems and persistent AI assistants for organizations that value efficiency over overhead. Every project is built on serverless edge architecture, providing sub-second speed and a private "Backstage" dashboard for real-time management.</p>
        <div class="ai-stats">
          <div class="ai-stat"><span class="ai-stat-val">3</span><span class="ai-stat-label">Charter Spots Open</span></div>
          <div class="ai-stat"><span class="ai-stat-val">100<em>%</em></span><span class="ai-stat-label">Edge Serverless</span></div>
          <div class="ai-stat"><span class="ai-stat-val">$<em>0</em></span><span class="ai-stat-label">Financial Risk</span></div>
        </div>
        <div class="ai-section-label">Production Components</div>
        <div class="ai-features">
          <a href="/blog/minescout-genesis" class="ai-feature"><div class="ai-feature-icon">⚙️</div><div><div class="ai-feature-title">Multi-Tenant Routing Engine</div><div class="ai-feature-desc">The core v61.0 logic. Hosting unlimited client nodes from a single codebase via header-based routing and KV data persistence.</div></div><span class="ai-feature-badge badge-live">System Live</span></a>
          <a href="https://ferncarleton.com?studio" target="_blank" class="ai-feature"><div class="ai-feature-icon">🎭</div><div><div class="ai-feature-title">The "Backstage" Dashboard</div><div class="ai-feature-desc">A private, secure admin suite allowing clients to update photography, bios, and skills grids without touching a line of code.</div></div><span class="ai-feature-badge badge-node">Node 02</span></a>
          <a href="/ai/demo/index.html" class="ai-feature"><div class="ai-feature-icon">🤖</div><div><div class="ai-feature-title">River Guide AI (RAG Assistant)</div><div class="ai-feature-desc">A persistent assistant trained on proprietary data. Handles high-frequency inquiries with 24/7 accuracy and instant triage.</div></div><span class="ai-feature-badge badge-ready">Demo Ready</span></a>
        </div>
        <div class="ai-section-label">The Implementation Loop</div>
        <div class="ai-steps">
          <div class="ai-step"><div class="ai-step-num">01</div><div><div class="ai-step-title">The Technical Audit</div><div class="ai-step-desc">I analyze your current digital footprint to find "True Friction"—mobile bottlenecks, slow load times, or manual FAQ overhead.</div></div></div>
          <div class="ai-step"><div class="ai-step-num">02</div><div><div class="ai-step-title">Heritage Modernization</div><div class="ai-step-desc">I architect a high-performance "Front Door" that respects your brand's history while providing modern speed and accessibility.</div></div></div>
          <div class="ai-step"><div class="ai-step-num">03</div><div><div class="ai-step-title">Intelligence Injection</div><div class="ai-step-desc">We deploy a custom-trained assistant to your site and connect your secure Backstage dashboard for real-time monitoring.</div></div></div>
        </div>
        <div class="ai-callout">
          <div class="ai-callout-title">📦 Zero-Cost Infrastructure Promise.</div>
          <div class="ai-callout-desc">By leveraging enterprise-grade "Free Tier" technologies (Cloudflare, Firebase, GitHub), I eliminate traditional hosting costs. You pay for the architecture and intelligence, not for the "digital rent" of slow servers.</div>
        </div>
        <div class="ai-section-label">Managed Service Access</div>
        <div class="ai-pricing">
          <div class="ai-price-tier"><div class="ai-price-name">Digital Remodel</div><div class="ai-price-amount">$<em>499</em></div><div class="ai-price-desc">Complete site modernization and speed optimization.</div></div>
          <div class="ai-price-tier"><div class="ai-price-name">Full AI Upgrade</div><div class="ai-price-amount">$<em>749</em></div><div class="ai-price-desc">Custom AI Assistant, RAG training, & automated feedback loops.</div></div>
          <div class="ai-price-tier"><div class="ai-price-name">Charter Partner</div><div class="ai-price-amount">$<em>0</em></div><div class="ai-price-desc">Full stack waived for 3 local businesses. Invite only.</div></div>
        </div>
        <div class="ai-cta-group">
          <a href="/ai/intake" target="_blank" class="btn-primary">Request a Technical Audit</a>
          <a href="/ai/demo/index.html" target="_blank" class="btn-ghost">Try the Live AI Demo &rarr;</a>
        </div>
        <p class="ai-disclaimer">Minescout AI is built and operated by <a href="/">Thomas Carleton</a>, a systems engineer at Eastlake HS. All operations are strictly capped at 5 hours weekly to maintain a 4.0 GPA standing. For collaboration or inquiries, <a href="/ai/intake">initiate a project request here</a>.</p>
      </div>
    </div>
  `,
  '/ai/clients': `
    <div class="main--page">
      <div class="page-content clients-wrap">
        <p class="page-label">Minescout AI</p>
        <h1 class="page-title">Client Work</h1>
        <p class="clients-intro">Minescout AI deploys high-performance digital infrastructure. Below are our current <strong>Active Network Nodes</strong>. We are currently accepting applications for three inaugural <strong>Q2 Charter Partners</strong>.</p>
        <div class="status-bar">
          <div class="status-dot-alert"></div>
          <div class="status-text"><strong>Commercial Pipeline: 3/3 Charter Slots Open.</strong> We are prioritizing businesses in Sammamish and the Greater Eastside for our Q2 technical architecture upgrades.</div>
        </div>
        <div class="section-divider">Production Nodes</div>
        <div class="client-card" style="--d:0.3s;">
          <div class="client-card-header"><div><div class="client-name">The Chop Lab</div><div class="client-type">Manufacturing & Robotics Automation</div></div><span class="client-status status-live">Live</span></div>
          <div class="client-card-body">
            <div class="client-detail-grid">
              <div><div class="client-detail-label">Vertical</div><div class="client-detail-val">E-Commerce Automation</div></div>
              <div><div class="client-detail-label">Deployment</div><div class="client-detail-val">April 2026</div></div>
              <div><div class="client-detail-label">Architecture</div><div class="client-detail-val">Llama-3 RAG, STL Engine</div></div>
              <div><div class="client-detail-label">Performance</div><div class="client-detail-val">0.4s Edge Latency</div></div>
            </div>
            <p class="client-note">An advanced integration of robotics and automated sales. Features a custom AI technician capable of providing instant quotes from a technical database and managing 3D fabrication requests.<br><a href="https://chop-lab.com" class="view-link" target="_blank">Analyze Live Integration &rarr;</a></p>
          </div>
        </div>
        <div class="section-divider">Edge Infrastructure Nodes</div>
        <div class="client-card" style="--d:0.4s;">
          <div class="client-card-header"><div><div class="client-name">Handmade by Jayme</div><div class="client-type">Artisanal Goods & Lifestyle</div></div><span class="client-status status-live">Live</span></div>
          <div class="client-card-body">
            <div class="client-detail-grid">
              <div><div class="client-detail-label">Deployment</div><div class="client-detail-val">March 2026</div></div>
              <div><div class="client-detail-label">Solution</div><div class="client-detail-val">Organic Modern Architecture</div></div>
            </div>
            <p class="client-note">A complete serverless edge migration. We transformed a legacy site into a high-performance visual experience featuring dynamic gallery rendering and sub-second mobile load times.<br><a href="https://jaymecarleton.com" class="view-link" target="_blank">View Live Site &rarr;</a></p>
          </div>
        </div>
        <div class="client-card" style="--d:0.45s;">
          <div class="client-card-header"><div><div class="client-name">Fern Carleton Studio</div><div class="client-type">Fine Arts & Visual Media</div></div><span class="client-status status-live">Live</span></div>
          <div class="client-card-body">
            <div class="client-detail-grid">
              <div><div class="client-detail-label">Deployment</div><div class="client-detail-val">March 2026</div></div>
              <div><div class="client-detail-label">Solution</div><div class="client-detail-val">Multi-Tenant Serverless Engine</div></div>
            </div>
            <p class="client-note">Designed for high-fidelity visual archiving without sacrificing backend speed. This node utilizes our multi-tenant engine to ensure rapid asset delivery globally.<br><a href="https://ferncarleton.com" class="view-link" target="_blank">View Live Site &rarr;</a></p>
          </div>
        </div>
        <div class="section-divider">Demonstration Nodes</div>
        <div class="client-card" style="--d:0.5s;">
          <div class="client-card-header"><div><div class="client-name">Smith &amp; Cole Law</div><div class="client-type">Professional Services Demo</div></div><span class="client-status status-demo">Internal Node</span></div>
          <div class="client-card-body">
            <div class="client-detail-grid">
              <div><div class="client-detail-label">Objective</div><div class="client-detail-val">Lead Triage & Qualification</div></div>
              <div><div class="client-detail-label">Industry</div><div class="client-detail-val">Legal Consulting</div></div>
            </div>
            <p class="client-note">A demonstration of how Minescout AI can capture and qualify professional service leads 24/7.<br><a href="/ai/demo/index.html" class="view-link">Test AI Agent &rarr;</a></p>
          </div>
        </div>
        <div class="clients-cta" style="margin-top: 3rem;">
          <a href="/ai/intake" target="_blank" class="btn-primary">Apply for Q2 Charter Program</a>
        </div>
      </div>
    </div>
  `,
  '/ai/process': `
    <div class="main--page">
      <div class="page-content process-wrap">
        <p class="page-label">Minescout AI</p>
        <h1 class="page-title">The Process</h1>
        <p class="process-intro">From first conversation to live widget — here's exactly what working with Minescout AI looks like, step by step. No surprises, no jargon.</p>
        <div class="timeline">
          <div class="phase" style="--d:0.3s;">
            <div class="phase-dot active">01</div>
            <div class="phase-content">
              <div class="phase-header"><div class="phase-title">Initial conversation</div><span class="phase-timeline-tag">Day 1 &mdash; 30 min</span></div>
              <p class="phase-desc">We talk (email or call) about your business, what questions customers ask most, and what you want the AI to handle. I'll ask about your hours, services, pricing, and anything that trips up your current process. No tech knowledge required from you.</p>
              <ul class="phase-deliverables"><li>Scope agreed and plan selected</li><li>Content checklist sent to you</li><li>Timeline confirmed</li></ul>
            </div>
          </div>
          <div class="phase" style="--d:0.38s;">
            <div class="phase-dot">02</div>
            <div class="phase-content">
              <div class="phase-header"><div class="phase-title">You send your content</div><span class="phase-timeline-tag">Day 1&ndash;2</span></div>
              <p class="phase-desc">You send me your FAQs, hours, service descriptions, pricing, and anything else the AI should know. A Google Doc, PDF, Word file, or even a bullet-point email works perfectly. I don't need it to be formatted — I'll handle that.</p>
              <ul class="phase-deliverables"><li>FAQ document (any format)</li><li>Business hours &amp; contact info</li><li>Services or menu with pricing</li><li>Anything customers frequently ask about</li></ul>
            </div>
          </div>
          <div class="phase" style="--d:0.46s;">
            <div class="phase-dot">03</div>
            <div class="phase-content">
              <div class="phase-header"><div class="phase-title">AI training &amp; build</div><span class="phase-timeline-tag">Day 2&ndash;5</span></div>
              <p class="phase-desc">I train the AI on your documents, write the system prompt (the instructions that tell it how to behave), set up guardrails to keep it on-topic, and deploy it to Cloudflare's global edge network. I also set up your Google Sheets Training Bridge so every conversation is logged.</p>
              <ul class="phase-deliverables"><li>AI trained on your business content</li><li>System prompt written and tested</li><li>Google Sheets Training Bridge live</li><li>Widget tested across browsers</li></ul>
            </div>
          </div>
          <div class="phase" style="--d:0.54s;">
            <div class="phase-dot">04</div>
            <div class="phase-content">
              <div class="phase-header"><div class="phase-title">Review &amp; launch</div><span class="phase-timeline-tag">Day 5&ndash;7</span></div>
              <p class="phase-desc">You test the AI yourself, ask it your hardest questions, and tell me anything it got wrong. I fix it. Once you're happy, I give you a single line of code to paste into your website — or I add it for you if you share access. The AI goes live within 24 hours of your approval.</p>
              <ul class="phase-deliverables"><li>Test session with you</li><li>Corrections applied within 24hrs</li><li>Embed code delivered</li><li>AI goes live on your site</li></ul>
            </div>
          </div>
          <div class="phase" style="--d:0.58s;">
            <div class="phase-dot">05</div>
            <div class="phase-content">
              <div class="phase-header"><div class="phase-title">Ongoing maintenance</div><span class="phase-timeline-tag">Monthly</span></div>
              <p class="phase-desc">Every month I review your Training Bridge sheet, apply any corrections you've submitted, update the AI with new business info (changed hours, new services, price updates), and send you a short summary of the AI's performance. You can submit corrections anytime — I respond within 48 hours.</p>
              <ul class="phase-deliverables"><li>Monthly performance summary</li><li>Content updates applied</li><li>Correction submissions reviewed</li><li>API &amp; security monitoring</li></ul>
            </div>
          </div>
        </div>
        <div class="you-need">
          <div class="you-need-title">What you need to provide — that's it</div>
          <div class="you-need-list">
            <div class="you-need-item">&#10003;&nbsp; Your FAQs (any format)</div>
            <div class="you-need-item">&#10003;&nbsp; Business hours</div>
            <div class="you-need-item">&#10003;&nbsp; Services / menu / pricing</div>
            <div class="you-need-item">&#10003;&nbsp; Contact info</div>
            <div class="you-need-item">&#10003;&nbsp; 30 minutes of your time</div>
            <div class="you-need-item">&#10003;&nbsp; Feedback during review</div>
          </div>
        </div>
        <div class="process-cta">
          <a href="/contact" class="btn-primary">Start the conversation</a>
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
          <p class="legal-body">The Charter Partner program is an invite-only arrangement in which Minescout AI provides the full AI Upgrade at no cost in exchange for a defined set of commitments from the partner. <strong>3 spots are currently available.</strong> <a href="/contact">Get in touch to apply.</a></p>
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
          <div class="legal-contact-body">Reach out directly &mdash; happy to clarify anything. <a href="/contact">Contact page</a> or <a href="mailto:tmcarleton11&#64;gmail.com">tmcarleton11&#64;gmail.com</a>.</div>
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
          <a href="/ai/intake" target="_blank" class="verdict-cta">Get started</a>
        </div>

        <div class="calc-container">
          <div class="input-section">
            <h3 style="margin-bottom: 1.5rem; font-family: var(--serif);">Efficiency Metrics</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
              <div class="input-group"><label>Weekly Inquiries (Email/Phone)</label><input type="number" id="volume" value="50" oninput="window.calcROI()"></div>
              <div class="input-group"><label>Avg. Time per Response (Minutes)</label><input type="number" id="time" value="8" oninput="window.calcROI()"></div>
            </div>
            <h3 style="margin: 2.5rem 0 1.5rem; font-family: var(--serif);">Growth Metrics</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
              <div class="input-group"><label>Estimated Monthly Website Visitors</label><input type="number" id="traffic" value="800" oninput="window.calcROI()"></div>
              <div class="input-group"><label>Avg. Customer Value ($)</label><input type="number" id="value" value="250" oninput="window.calcROI()"></div>
            </div>
            <h3 style="margin: 2.5rem 0 1.5rem; font-family: var(--serif);">Minescout Plan</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
              <div class="input-group">
                <label>Select Plan Tier</label>
                <select id="plan" onchange="window.calcROI()">
                  <option value="59" data-setup="749">Full AI Upgrade — $749 setup + $59/mo</option>
                  <option value="29" data-setup="499">Digital Remodel — $499 setup + $29/mo</option>
                </select>
              </div>
              <div class="input-group"><label>AI Coverage (Est. % of questions handled)</label><input type="number" id="aiCoverage" value="80" min="10" max="100" oninput="window.calcROI()"></div>
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
              <span style="font-weight: 600; color: var(--fg);">Preview Mode (Click text to edit)</span>
              <button class="btn-submit" onclick="window.submitIntakeToCloudflare()">Approve & Submit Data</button>
            </div>
            <div class="plan-container" id="pdfDocument" contenteditable="true">
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
          <p style="color: var(--muted);">Generating PDF and routing via Minescout Edge Network...</p>
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
          <div class="lf"><label>Email</label><input type="email" id="l-email" placeholder="tmcarleton11@gmail.com" /></div>
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
                          <option value="Full AI Upgrade">Full AI Upgrade ($749 + $59/mo)</option>
                          <option value="Digital Remodel">Digital Remodel ($499)</option>
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
          <a href="https://github.com" target="_blank">GitHub</a>.
        </p>
      </div>
    </div>
  `,
  '/guestbook': `
    <div class="main--page">
      <div class="page-content guestbook-wrap">
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
  '/portal': `
    <div id="portal-root" style="background: var(--bg); min-height: 100vh; padding: 2rem; font-family: var(--sans);">
      
      <div id="portal-login" style="max-width: 400px; margin: 10vh auto; border: 1px solid var(--border); padding: 2rem; border-radius: 8px;">
        <h1 style="font-family: var(--serif); font-size: 1.5rem; color: var(--fg); margin-bottom: 0.5rem;">Client Portal</h1>
        <p style="font-size: 0.8rem; color: var(--muted); margin-bottom: 1.5rem;">Log in to manage your Minescout AI integration.</p>
        <div style="display:flex; flex-direction:column; gap:1rem; margin-bottom:1.5rem;">
          <div><label style="font-size:0.7rem; font-weight:600; text-transform:uppercase;">Email</label><br><input type="email" id="p-email" style="width:100%; padding:0.75rem; border:1px solid var(--border); border-radius:4px; margin-top:0.25rem;"></div>
          <div><label style="font-size:0.7rem; font-weight:600; text-transform:uppercase;">Password</label><br><input type="password" id="p-pass" style="width:100%; padding:0.75rem; border:1px solid var(--border); border-radius:4px; margin-top:0.25rem;"></div>
        </div>
        <button class="btn-primary" id="p-login-btn" style="width:100%;" onclick="window.portalLogin()">Sign In</button>
        <div id="p-err" style="color:var(--accent); font-size:0.75rem; margin-top:1rem; display:none;"></div>
      </div>

      <div id="portal-dash" style="display: none; max-width: 800px; margin: 0 auto;">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 2px solid var(--fg); padding-bottom: 1rem; margin-bottom: 2rem;">
          <div>
            <h1 style="font-family: var(--serif); font-size: 1.8rem; color: var(--fg); margin:0;" id="pd-name">Loading...</h1>
            <p style="font-size: 0.8rem; color: var(--muted); margin:0;" id="pd-plan">...</p>
          </div>
          <button class="btn-ghost" onclick="window.portalSignOut()">Sign Out</button>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
          <div style="border: 1px solid var(--border); border-radius: 6px; padding: 1.5rem; text-align: center;">
            <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); margin-bottom: 0.5rem;">Conversations Handled</div>
            <div style="font-family: var(--serif); font-size: 3rem; font-weight: 700; color: #4caf82; line-height: 1;" id="pd-convos">0</div>
          </div>
          <div style="border: 1px solid var(--border); border-radius: 6px; padding: 1.5rem; text-align: center;">
            <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); margin-bottom: 0.5rem;">System Status</div>
            <div style="font-family: var(--sans); font-size: 1.2rem; font-weight: 600; color: var(--fg); margin-top: 1rem;">● Active & Routing</div>
          </div>
        </div>

        <div style="border: 1px solid var(--border); border-radius: 6px; padding: 1.5rem; margin-bottom: 2rem;">
          <h3 style="font-size: 1rem; color: var(--fg); margin-bottom: 0.5rem;">Submit a Correction</h3>
          <p style="font-size: 0.8rem; color: var(--muted); margin-bottom: 1rem;">Did the AI answer something incorrectly? Tell us what the user asked, and what the correct answer should be. We will update the Training Bridge within 48 hours.</p>
          <div style="display:flex; flex-direction:column; gap:1rem;">
            <input type="text" id="corr-q" placeholder="What did the customer ask?" style="padding: 0.75rem; border: 1px solid var(--border); border-radius: 4px; width: 100%;">
            <textarea id="corr-a" placeholder="What is the correct factual answer?" style="padding: 0.75rem; border: 1px solid var(--border); border-radius: 4px; width: 100%; min-height: 80px; font-family: var(--sans);"></textarea>
            <button class="btn-primary" id="corr-submit" style="align-self: flex-start;" onclick="window.submitCorrection()">Submit to Minescout</button>
            <div id="corr-msg" style="font-size:0.75rem; color:#4caf82; display:none;">Correction submitted securely.</div>
          </div>
        </div>
      </div>
    </div>
  `,
  '/ai/pricing': `
    <div class="main--page">
      <div class="page-content pricing-wrap">
        <p class="page-label">Minescout AI</p>
        <h1 class="page-title">Pricing & Beta Programs</h1>

        <div class="anchor-bar">
          <div class="anchor-bar-icon">&#128161;</div>
          <div class="anchor-bar-text">
            A standard agency website redesign costs <strong>$5,000&ndash;$10,000</strong>.
            Minescout AI starts at <strong>$499</strong>.
          </div>
        </div>

        <div class="tiers" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 1.5rem; margin-top: 2rem;">
          
          <div class="tier" style="flex: 1 1 220px; max-width: 260px;">
            <div class="tier-name">Digital Remodel</div>
            <div class="tier-price">$<em>499</em></div>
            <div class="tier-price-sub">one-time setup</div>
            <div class="tier-price-sub">+ $0 or $29/mo hosting</div>
            <p class="tier-target">A fast, high-end &ldquo;front door&rdquo; for businesses that need a modern site without AI &mdash; yet.</p>
            <hr class="tier-divider" />
            <ul class="tier-features">
              <li class="tier-feature">Playfair Display typography</li>
              <li class="tier-feature">Mobile-first responsive</li>
              <li class="tier-feature">Sub-second load times</li>
              <li class="tier-feature">SEO metadata &amp; schema</li>
            </ul>
            <a href="/contact" class="tier-cta">Get started</a>
          </div>

          <div class="tier" style="flex: 1 1 220px; max-width: 260px;">
            <span class="tier-badge" style="background: #fff4f1; color: var(--accent); border: 1px solid #ffd5c8;">Beta — 50% Off</span>
            <div class="tier-name">Lead-Gen Widget</div>
            <div class="tier-price">$<em>299</em></div>
            <div class="tier-price-sub"><span style="text-decoration: line-through; opacity: 0.6;">$599</span> one-time setup</div>
            <div class="tier-price-sub">+ $15 per month</div>
            <p class="tier-target">Custom calculators or quote engines. 50% off for early adopters who help refine the product.</p>
            <hr class="tier-divider" />
            <ul class="tier-features">
              <li class="tier-feature">Interactive logic/math</li>
              <li class="tier-feature">Instant lead capture</li>
              <li class="tier-feature">Data routed to your email</li>
              <li class="tier-feature">Co-development process</li>
            </ul>
            <a href="/contact" class="tier-cta" style="background: var(--light); color: var(--fg); border: 1px solid var(--border);">Claim Beta Spot</a>
          </div>

          <div class="tier tier--featured" style="flex: 1 1 220px; max-width: 260px;">
            <span class="tier-badge">Most Popular</span>
            <div class="tier-name">Full AI Upgrade</div>
            <div class="tier-price">$<em>749</em></div>
            <div class="tier-price-sub">one-time setup</div>
            <div class="tier-price-sub">+ $59 per month</div>
            <div class="tier-was">Standard agency build: $5,000+</div>
            <p class="tier-target">Complete remodel plus a custom-trained AI assistant. The full package for growth-stage local businesses.</p>
            <hr class="tier-divider" />
            <ul class="tier-features">
              <li class="tier-feature">Everything in Remodel</li>
              <li class="tier-feature">Custom-trained AI assistant</li>
              <li class="tier-feature">Managed Training Bridge</li>
              <li class="tier-feature">After-hours coverage</li>
            </ul>
            <a href="/contact" class="tier-cta">Get started</a>
          </div>

          <div class="tier" style="flex: 1 1 220px; max-width: 260px;">
            <span class="tier-badge" style="background: #fff4f1; color: var(--accent); border: 1px solid #ffd5c8;">Beta — 50% Off</span>
            <div class="tier-name">Internal Ops AI</div>
            <div class="tier-price">$<em>449</em></div>
            <div class="tier-price-sub"><span style="text-decoration: line-through; opacity: 0.6;">$899</span> one-time setup</div>
            <div class="tier-price-sub">+ $39 per month</div>
            <p class="tier-target">A secure "Staff Bot" trained on your private SOPs and handbooks. Discounted as we perfect the system.</p>
            <hr class="tier-divider" />
            <ul class="tier-features">
              <li class="tier-feature">Private &amp; secure access</li>
              <li class="tier-feature">Trained on internal docs</li>
              <li class="tier-feature">Instant HR/SOP answers</li>
              <li class="tier-feature">Co-development process</li>
            </ul>
            <a href="/contact" class="tier-cta" style="background: var(--light); color: var(--fg); border: 1px solid var(--border);">Claim Beta Spot</a>
          </div>

          <div class="tier tier--charter" style="flex: 1 1 220px; max-width: 260px;">
            <span class="tier-badge tier-badge--charter">Invite Only</span>
            <div class="tier-name">Charter Partner</div>
            <div class="tier-price" style="font-size:1.5rem;color:var(--muted);">$<em style="color:var(--muted);">0</em></div>
            <div class="tier-price-sub">setup &amp; hosting waived</div>
            <div class="tier-was">Valued at $749 + $59/mo</div>
            <p class="tier-target">For select beta partners. The full stack free in exchange for a signed testimonial. 3 spots available.</p>
            <hr class="tier-divider" />
            <ul class="tier-features">
              <li class="tier-feature">Full AI Upgrade at no cost</li>
              <li class="tier-feature">Signed testimonial required</li>
              <li class="tier-feature">12 months of feedback</li>
            </ul>
            <a href="/contact" class="tier-cta">Request an invite</a>
          </div>

        </div>

        <div class="pricing-section-label" style="--ad:0.26s;">Not sure what plan?</div>
        <div style="font-size:0.78rem;color:var(--muted);line-height:1.7;margin-bottom:1.25rem;">
          Not sure which plan is right for you?
          <button type="button" class="btn-ghost" id="open-plan-quiz" style="margin-left:0.5rem;">Take a quick quiz</button>
        </div>

        <div class="plan-quiz is-hidden" id="plan-quiz">
          <div class="plan-quiz-header">
            <div class="plan-quiz-title">Find your plan</div>
            <div class="plan-quiz-desc">A few quick questions so we can suggest the best fit. You&rsquo;ll still see all options below.</div>
          </div>
          <div class="plan-quiz-progress"><div class="plan-quiz-progress-fill" id="quiz-progress"></div></div>
          <div class="plan-quiz-body" id="quiz-body">
            <div class="plan-quiz-step active" data-step="1">
              <div class="plan-quiz-q">What best describes your website right now?</div>
              <div class="plan-quiz-options">
                <button type="button" class="plan-quiz-opt" data-remodel="2" data-ai="0">I don&rsquo;t have one yet</button>
                <button type="button" class="plan-quiz-opt" data-remodel="2" data-ai="0">I have one but it&rsquo;s outdated or I&rsquo;m embarrassed by it</button>
                <button type="button" class="plan-quiz-opt" data-remodel="1" data-ai="1">It&rsquo;s okay but I&rsquo;d like it more modern</button>
                <button type="button" class="plan-quiz-opt" data-remodel="0" data-ai="2">I&rsquo;m happy with it &mdash; I&rsquo;m mainly looking to add something (e.g. AI)</button>
              </div>
            </div>
            <div class="plan-quiz-step" data-step="2">
              <div class="plan-quiz-q">Do customers ask you the same questions over and over (hours, pricing, services)?</div>
              <div class="plan-quiz-options">
                <button type="button" class="plan-quiz-opt" data-remodel="1" data-ai="0">Rarely</button>
                <button type="button" class="plan-quiz-opt" data-remodel="0" data-ai="1">Sometimes</button>
                <button type="button" class="plan-quiz-opt" data-remodel="0" data-ai="2">All the time &mdash; it takes real time to answer</button>
              </div>
            </div>
            <div class="plan-quiz-step" data-step="3">
              <div class="plan-quiz-q">Do you miss leads or calls when you&rsquo;re closed or too busy?</div>
              <div class="plan-quiz-options">
                <button type="button" class="plan-quiz-opt" data-remodel="1" data-ai="0">No, we keep up</button>
                <button type="button" class="plan-quiz-opt" data-remodel="0" data-ai="1">Sometimes</button>
                <button type="button" class="plan-quiz-opt" data-remodel="0" data-ai="2">Yes, it&rsquo;s a real problem</button>
              </div>
            </div>
            <div class="plan-quiz-step" data-step="4">
              <div class="plan-quiz-q">What matters most for your budget?</div>
              <div class="plan-quiz-options">
                <button type="button" class="plan-quiz-opt" data-remodel="2" data-ai="0">I&rsquo;d rather pay once and keep ongoing costs minimal</button>
                <button type="button" class="plan-quiz-opt" data-remodel="0" data-ai="1">I&rsquo;m okay with a small monthly fee if the value is there</button>
                <button type="button" class="plan-quiz-opt" data-remodel="0" data-ai="0">I&rsquo;m open &mdash; just want the right fit</button>
              </div>
            </div>
          </div>
          <div class="plan-quiz-nav" style="padding: 0 1.5rem 1.5rem;">
            <button type="button" class="plan-quiz-back" id="quiz-back" style="visibility: hidden;">&larr; Back</button>
            <button type="button" class="plan-quiz-next" id="quiz-next" disabled>Next Step</button>
          </div>
          <div class="plan-quiz-result" id="quiz-result">
            <div class="plan-quiz-result-label">Our recommendation</div>
            <div class="plan-quiz-result-title" id="quiz-result-title"></div>
            <div class="plan-quiz-result-desc" id="quiz-result-desc"></div>
            <a href="/contact" class="plan-quiz-result-cta" id="quiz-result-cta">Get started</a>
            <button type="button" class="plan-quiz-retry" id="quiz-retry">Take the quiz again</button>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1.5rem; text-align: center; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 2.5rem 0; margin: 3rem 0; opacity: 0; animation: fadeUp 0.5s ease 0.35s forwards;">
          <div>
            <div style="font-family: var(--serif); font-size: 2.4rem; font-weight: 700; color: var(--fg); line-height: 1;">40<em style="color: var(--accent); font-style: normal; font-size: 1.4rem; margin-left: 2px;">hrs</em></div>
            <div style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); margin-top: 0.75rem;">Saved per month<br>in manual Q&amp;A</div>
          </div>
          <div>
            <div style="font-family: var(--serif); font-size: 2.4rem; font-weight: 700; color: var(--fg); line-height: 1;">24<em style="color: var(--accent); font-style: normal; font-size: 1.4rem; margin-left: 2px;">/7</em></div>
            <div style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); margin-top: 0.75rem;">After-hours coverage<br>&amp; automated triage</div>
          </div>
          <div>
            <div style="font-family: var(--serif); font-size: 2.4rem; font-weight: 700; color: var(--fg); line-height: 1;">&lt;1<em style="color: var(--accent); font-style: normal; font-size: 1.4rem; margin-left: 2px;">wk</em></div>
            <div style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); margin-top: 0.75rem;">From first call<br>to live widget</div>
          </div>
        </div>

        <div class="pricing-section-label" style="--ad:0.38s;">What the monthly fee covers</div>
        <div class="faq-list" style="margin-bottom:2rem;opacity:0;animation:fadeUp 0.5s ease 0.4s forwards;">
          <div style="padding:1rem 1.25rem;font-size:0.78rem;color:var(--muted);line-height:1.8;border-bottom:1px solid var(--border);">
            <strong style="color:var(--fg);">Standard rate: $59 per month.</strong> The fee is not a subscription for access &mdash; it covers four real costs:
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid var(--border);">
            <div style="padding:1rem 1.25rem;border-right:1px solid var(--border);">
              <div style="font-size:0.7rem;font-weight:600;color:var(--fg);margin-bottom:0.3rem;">API Token Costs</div>
              <div style="font-size:0.72rem;color:var(--muted);line-height:1.6;">Every message the AI processes costs a fraction of a cent. The monthly fee absorbs this entirely &mdash; no surprise bills.</div>
            </div>
            <div style="padding:1rem 1.25rem;">
              <div style="font-size:0.7rem;font-weight:600;color:var(--fg);margin-bottom:0.3rem;">Edge Hosting &amp; SSL</div>
              <div style="font-size:0.72rem;color:var(--muted);line-height:1.6;">Hosted on Cloudflare&rsquo;s global edge network. 99.9% uptime, sub-second latency, and SSL included.</div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;">
            <div style="padding:1rem 1.25rem;border-right:1px solid var(--border);">
              <div style="font-size:0.7rem;font-weight:600;color:var(--fg);margin-bottom:0.3rem;">Training Bridge Updates</div>
              <div style="font-size:0.72rem;color:var(--muted);line-height:1.6;">When your hours, prices, or services change, I update the AI within 48 hours. No stale info ever reaches customers.</div>
            </div>
            <div style="padding:1rem 1.25rem;">
              <div style="font-size:0.7rem;font-weight:600;color:var(--fg);margin-bottom:0.3rem;">Security &amp; Monitoring</div>
              <div style="font-size:0.72rem;color:var(--muted);line-height:1.6;">Guardrails to prevent off-topic responses, monthly performance reviews, and proactive fixes when something breaks.</div>
            </div>
          </div>
        </div>

        <div class="pricing-cta">
          <div class="pricing-cta-text">
            <div class="pricing-cta-title">Not sure which plan?</div>
            <div class="pricing-cta-desc">Send me a quick message and I&rsquo;ll recommend the right fit based on your site and goals. No sales pitch &mdash; just a straight answer.</div>
          </div>
          <div class="pricing-cta-btns">
            <a href="/contact" class="btn-primary">Get in touch</a>
            <a href="/ai/demo/" class="btn-ghost">See demo first</a>
          </div>
        </div>

        <p class="pricing-disclaimer">
          Minescout AI is operated by Thomas Carleton, a student developer in Sammamish, WA.
          Total infrastructure risk is $0 &mdash; all tools run on free developer tiers.
          Charter Partner spots are limited and invite-only.
          <a href="/contact">Questions? Reach out directly.</a>
        </p>

      </div>
    </div>
  `,
};

// Ensure aliases are set
views['/ai/info'] = views['/ai/intake'];
views['/legal'] = views['/ai/legal'];
views['/ai/clients/portal'] = views['/portal'];