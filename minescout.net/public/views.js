// views.js — Stores all HTML templates for the SPA

// ---------------------------------------------------------------------------
// Blog post date-gating helpers
// ---------------------------------------------------------------------------

/**
 * Parse a blog date string like "Nov 8, 2026" into a Date at midnight local time.
 */
function parseBlogDate(dateStr) {
  const d = new Date(dateStr);
  // Force to midnight so we compare dates, not times
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/**
 * Returns true if the blog post's release date is today or in the past.
 */
export function isReleased(dateStr) {
  const releaseDate = parseBlogDate(dateStr);
  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return releaseDate <= todayMidnight;
}

// ---------------------------------------------------------------------------
// All blog posts metadata (used to build the /blog index dynamically)
// ---------------------------------------------------------------------------

export const BLOG_POSTS = [
  {
    date: "Dec 11, 2026", tag: "tag-business", tagLabel: "Business",
    href: "/blog/websites-for-clubs-robotics-nonprofits.html", featured: true,
    title: "How Student Clubs, Robotics Teams, and Local Nonprofits Can Get a Custom Website Under $750",
    excerpt: "Sponsor showcases, schedules, sign-up forms, and a site that loads in a school parking lot — what student clubs and small nonprofits need, and what it costs.",
  },
  {
    date: "Dec 4, 2026", tag: "tag-business", tagLabel: "Business",
    href: "/blog/sammamish-small-business-website-guide.html",
    title: "What Sammamish &amp; Eastside Small Businesses Should Look for in a Website (2026 Guide)",
    excerpt: "What actually matters when a local shop, contractor, tutor, or service business in Sammamish, Issaquah, Redmond, or Bellevue buys a website in 2026.",
  },
  {
    date: "Nov 27, 2026", tag: "tag-business", tagLabel: "Business",
    href: "/blog/custom-website-vs-wix-squarespace.html",
    title: "Custom Website vs. Wix and Squarespace: When Should a Small Business Upgrade?",
    excerpt: "Wix and Squarespace are cheap to start and expensive to leave. The 2026 numbers over three years, what template bloat really costs, and when a custom site you own is the better buy.",
  },
  {
    date: "Nov 19, 2026", tag: "tag-business", tagLabel: "Business",
    href: "/blog/slow-websites-cost-customers.html",
    title: "Why Slow Websites Cost Local Businesses Customers (And How Static Edge Sites Fix It)",
    excerpt: "Every extra second of load time costs local businesses real leads. Where the delay comes from, and how static edge hosting removes it.",
  },
  {
    date: "Nov 12, 2026", tag: "tag-business", tagLabel: "Business",
    href: "/blog/custom-ecommerce-cost-2026.html",
    title: "How Much Does a Custom E-Commerce Website Cost in 2026?",
    excerpt: "What a custom storefront actually costs in 2026 — the real starting prices, what drives the number, and what should never be an add-on.",
  },
  {
    date: "Nov 8, 2026", tag: "tag-building", tagLabel: "Building",
    href: "/blog/chop-lab-storefront.html",
    title: "How I Built a Fast Online Storefront for a Local Ceramics Brand",
    excerpt: "A storefront for The Chop Lab: typed product data, millimetre-accurate specs, and a configurator that ends in a real quote instead of a dead cart.",
  },
  {
    date: "Nov 1, 2026", tag: "tag-building", tagLabel: "Building",
    href: "/blog/performance-benchmarking.html",
    title: "Performance Benchmarking: Achieving Sub-Second Global Edge Latency",
    excerpt: "Global latency testing, asset optimization, and edge caching strategies for high-speed web applications.",
  },
  {
    date: "Oct 18, 2026", tag: "tag-building", tagLabel: "Building",
    href: "/blog/css-architecture.html",
    title: "CSS Architecture: Building Scalable Design Systems",
    excerpt: "Using CSS custom properties and utility classes to build maintainable, scalable design systems.",
  },
  {
    date: "Oct 11, 2026", tag: "tag-ai", tagLabel: "AI Architecture",
    href: "/blog/ai-guardrails.html",
    title: "AI Guardrails 101: Preventing Hallucinations in Client Support Widgets",
    excerpt: "System guardrails that prevent LLMs from going off-topic or hallucinating false business policies.",
  },
  {
    date: "Sep 27, 2026", tag: "tag-building", tagLabel: "Building",
    href: "/blog/vanilla-js-edge.html",
    title: "Vanilla JS &amp; Edge Workers: Why I Avoid Heavy Framework Overkill",
    excerpt: "Why native browser APIs and serverless edge handlers outperform heavy frameworks for lightweight web applications.",
  },
  {
    date: "Sep 20, 2026", tag: "tag-building", tagLabel: "Building",
    href: "/blog/database-schema-design.html",
    title: "Schema Design: Structuring Data for Multi-Tenant SaaS",
    excerpt: "How to organize NoSQL databases for multi-tenant isolation and high-speed queries using Firestore and Cloudflare KV.",
  },
  {
    date: "Sep 13, 2026", tag: "tag-ai", tagLabel: "AI Architecture",
    href: "/blog/unstructured-client-data.html",
    title: "AI Architecture: Training Local AI Assistants on Unstructured Client Data",
    excerpt: "Ingesting unstructured business FAQs and transforming them into precise, structured prompt context for AI agents.",
  },
  {
    date: "Sep 6, 2026", tag: "tag-leadership", tagLabel: "Leadership",
    href: "/blog/eagle-scout-project.html",
    title: "Project Leadership at 14: Directing an Eagle Scout Project",
    excerpt: "Leadership lessons learned while managing 60+ volunteer hours to plan, construct, and install a Little Free Library in Illahee Park.",
  },
  {
    date: "Aug 30, 2026", tag: "tag-building", tagLabel: "Building",
    href: "/blog/sub-second-latency.html",
    title: "Sub-Second Latency: Why Custom SPAs Beat Heavy CMS Platforms",
    excerpt: "Why clean-slate rebuilds achieve sub-second global edge latency compared to traditional CMS platforms.",
  },
  {
    date: "Aug 23, 2026", tag: "tag-philosophy", tagLabel: "Philosophy",
    href: "/blog/zero-dollar-stack.html",
    title: "The $0.00 Stack: Bootstrapping SaaS on Serverless Free Tiers &amp; PAYU",
    excerpt: "How serverless edge layers and Pay-As-You-Use (PAYU) tiers enable zero-cost infrastructure for early-stage projects.",
  },
  {
    date: "Aug 16, 2026", tag: "tag-building", tagLabel: "Building",
    href: "/blog/chop-lab-spa.html",
    title: "Building for the Client: Overhauling The Chop Lab into a Custom SPA",
    excerpt: "How I overhauled an artisanal ceramics platform into a custom Single Page Application with an intuitive client updating workflow.",
  },
  {
    date: "Aug 9, 2026", tag: "tag-building", tagLabel: "Building",
    href: "/blog/state-management.html",
    title: "State Management: Keeping Complex Web Apps Fast Without React",
    excerpt: "Handling complex state logic using Vanilla JavaScript Proxies and native events instead of heavy frameworks.",
  },
  {
    date: "Aug 2, 2026", tag: "tag-ai", tagLabel: "AI Architecture",
    href: "/blog/edge-routing.html",
    title: "Edge Routing Architecture: Blacklists, Whitelists, and AI Worker Compatibility",
    excerpt: "Engineering edge routing with Cloudflare Workers and KV storage, including security filtering and worker compatibility.",
  },
  {
    date: "Mar 9, 2026", tag: "tag-engineering", tagLabel: "Engineering",
    href: "/blog/minescout-genesis.html",
    title: "Minescout Genesis: The 17-Day Multi-Tenant Pivot",
    excerpt: "Moving from static sites to a serverless SaaS engine. Here is how I architected the multi-tenant core of Minescout Studio.",
    footerLabel: "Read case study →",
  },
  {
    date: "Feb 21, 2026", tag: "tag-building", tagLabel: "Building",
    href: "/blog/launching-this-site.html",
    title: "Launching This Site",
    excerpt: "I've been wanting a personal corner of the internet for a while. Not just a GitHub profile — something that actually felt like me.",
  },
];

/**
 * Builds the /blog index HTML, only including posts whose release date
 * is today or earlier.
 */
function buildBlogIndex() {
  const releasedPosts = BLOG_POSTS.filter(p => isReleased(p.date));

  // Determine which released post is newest (for the "featured/Latest" badge)
  const featuredPost = releasedPosts.find(p => p.featured) || releasedPosts[0] || null;

  const cards = releasedPosts.map(post => {
    const isFeatured = post === featuredPost;
    const footer = post.footerLabel || "Read post →";

    if (isFeatured) {
      return `
          <a class="blog-card featured" href="${post.href}">
            <div>
              <div class="blog-card-meta"><span class="blog-card-date">${post.date}</span><span class="blog-card-tag ${post.tag}">${post.tagLabel}</span></div>
              <div class="blog-card-title">${post.title}</div>
              <div class="blog-card-excerpt">${post.excerpt}</div>
              <div class="blog-card-footer">${footer}</div>
            </div>
            <span class="featured-label">Latest</span>
          </a>`;
    }

    return `
          <a class="blog-card" href="${post.href}">
            <div class="blog-card-meta"><span class="blog-card-date">${post.date}</span><span class="blog-card-tag ${post.tag}">${post.tagLabel}</span></div>
            <div class="blog-card-title">${post.title}</div>
            <div class="blog-card-excerpt">${post.excerpt}</div>
            <div class="blog-card-footer">${footer}</div>
          </a>`;
  }).join('\n');

  const emptyState = releasedPosts.length === 0
    ? `<p style="color: var(--muted); font-size: 1rem;">No posts yet — check back soon!</p>`
    : '';

  return `
    <div class="main--page">
      <div class="page-content" style="max-width: 760px;">
        <p class="page-label">Blog</p>
        <h1 class="page-title">Thoughts &amp; Writing</h1>
        <div class="blog-grid">
          ${cards}
          ${emptyState}
        </div>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// Per-route document metadata
// ---------------------------------------------------------------------------

/**
 * Site-wide fallback metadata. app.js uses this for any route without a
 * PAGE_META entry and restores it when navigating back from a service page.
 */
export const SITE_META = {
  title: 'Thomas Carleton',
  description: 'Builder. Student. Eagle Scout. I build things on the internet — from Minecraft tools to web apps.',
};

/**
 * Routes that need a document title and meta description distinct from the
 * portfolio defaults in index.html. app.js applies these on every render and
 * restores the defaults for any route that is not listed here.
 */
export const PAGE_META = {
  '/studio/local-web-design': {
    title: 'Small Business Website Design in Sammamish & Eastside WA | Minescout Studio',
    description: 'Custom, fast websites for small businesses in Sammamish, Issaquah, Redmond, and Bellevue. Mobile-first layouts, edge performance, and SEO setup from $750.',
  },
  '/studio/custom-storefronts': {
    title: 'Custom E-Commerce Storefronts Without Monthly Platform Fees | Minescout Studio',
    description: 'Custom e-commerce storefronts with interactive configurators, live unit toggles, and flexible checkout flows. Live proof at chop-lab.com, projects from $2,500.',
  },
  '/studio/student-nonprofit': {
    title: 'Affordable Custom Websites for Students, Clubs & Nonprofits | Minescout Studio',
    description: 'Discounted custom websites for students, robotics teams, scouts, school clubs, and local nonprofits. Projects from $250 to $750 with fast turnaround.',
  },
  '/blog/custom-website-vs-wix-squarespace.html': {
    title: 'Custom Website vs. Wix & Squarespace (2026) | Minescout Studio',
    description: 'Compare 2026 Wix and Squarespace subscription and transaction costs against a custom-coded site you own, with the real three-year totals and when to switch.',
  },
  '/blog/sammamish-small-business-website-guide.html': {
    title: 'What Sammamish & Eastside Businesses Need in a Website | Minescout',
    description: 'A practical 2026 buyer\'s guide for Sammamish, Issaquah, Redmond, and Bellevue businesses: mobile speed, local SEO, clear pricing, and lead capture.',
  },
  '/blog/websites-for-clubs-robotics-nonprofits.html': {
    title: 'Custom Websites for Clubs, Robotics Teams & Nonprofits | Minescout',
    description: 'What student clubs, FIRST Robotics teams, booster clubs, and local nonprofits need online, and how the discounted Minescout Studio tier keeps it affordable.',
  },
};

// ---------------------------------------------------------------------------
// Views object
// ---------------------------------------------------------------------------

export const views = {
  '/': `
    <div class="hero-layout">
      <div class="hero">
        <p class="hero-greeting">Welcome</p>
        <h1 class="hero-title">Hi, I'm<br><em>Thomas.</em></h1>
        <p class="hero-sub">Builder. Student. Eagle Scout.</p>
        <p class="hero-desc">
          I'm a 10th grader who builds things on the internet —
          from Minecraft tools to web apps. This is where I share what I've made.
        </p>
        <div class="hero-links">
          <a href="/work" class="btn-primary">See My Work</a>
          <a href="/about" class="btn-ghost">About Me →</a>
        </div>
      </div>
      <img src="/assets/photo3.jpg" alt="Thomas Carleton" class="hero-photo" />
    </div>
  `,
  '/about': `
    <div class="main--page">
      <div class="page-content">
        <p class="page-label">About</p>
        <h1 class="page-title">A little about me</h1>
        <div class="about-layout">
          <div class="about-text">
            <p>Hey, I'm Thomas — a 10th grader based in the Pacific Northwest. I've been building things on the internet for a few years now, starting with Minecraft tools and expanding into full web apps.</p>
            <p>Minescout started as a personal project and grew into something I'm genuinely proud of. I like making things that solve real problems, even small ones.</p>
            <p>Outside of building, I earned my Eagle Scout rank and spend a lot of time outdoors — running, hiking, and fly-fishing.</p>
          </div>
          <div class="about-aside">
            <div class="about-detail"><div class="about-detail-label">Grade</div><div class="about-detail-value">10th (2026–27)</div></div>
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
        <p class="now-updated">Last updated <span>October 2026</span> — Sammamish, WA</p>
        <div class="now-section" style="--delay: 0.3s;">
          <p class="now-section-label">Building & Engineering</p>
          <ul>
            <li>New FRC season is ramping up at <a href="https://packofparts.org" target="_blank">Team 1294</a>! We're in the Trial Period right now — training new members and making sure everyone's ready for the upcoming season.</li>
            <li>Actively maintaining <a href="https://chop-lab.com" target="_blank">The Chop Lab</a> — it's a live, actively used platform. Check it out!</li>
            <li>Running <a href="https://minescout.net" target="_blank">Minescout Studio</a> and its growing network of nodes. New client portal and infrastructure improvements shipping regularly.</li>
            <li>Launched a brand new <a href="/studio/creation">AI Site Builder</a> on October 16 — chat with an AI agent to spec out your ideal website, then I build it with a premium model.</li>
          </ul>
        </div>
        <div class="now-section" style="--delay: 0.45s;">
          <p class="now-section-label">School</p>
          <ul>
            <li>10th grade at Eastlake High School, focusing on CS and Engineering Design</li>
            <li>Keeping a 4.0 GPA</li>
            <li>Started UW Precalc this year</li>
          </ul>
        </div>
        <div class="now-section" style="--delay: 0.55s;">
          <p class="now-section-label">Scouting & Leadership</p>
          <ul>
            <li>Still serving as Den Chief for Cub Scout Pack 551</li>
            <li>Earned my Eagle Scout rank — constructed a Little Free Library in Illahee Park.</li>
          </ul>
        </div>
        <div class="now-section" style="--delay: 0.65s;">
          <p class="now-section-label">Outdoors</p>
          <ul>
            <li>Fly-fishing and hiking in the Pacific Northwest when the weather cooperates.</li>
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
              <td class="resume-title">Minescout Studio</td>
              <td><strong>Founder &amp; Systems Architect</strong> — Designed and launched a multi-tenant SaaS platform utilizing AI integrations and cloud-based infrastructure. Engineered application routing systems using Cloudflare Workers and KV storage to achieve sub-second global edge latency. Developed scalable web architecture supporting multiple users and services from a single codebase.</td>
            </tr>
            <tr class="entry-row" style="--delay: 150ms;">
              <td class="resume-date">Jan 2026 – Pres.</td>
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
              <td><strong>Mechanical Assembly &amp; Hardware Integration</strong> — Contributed to robot assembly and hardware integration on the mechanical and electrical subteams. Assisted with turret assembly, electrical wiring, and fabrication during the pre-season. Contributed to a team that earned First Place at the Glacier Peak District Event and advanced to the Pacific Northwest District Championship.</td>            </tr>
            <tr class="entry-row" style="--delay: 300ms;">
              <td class="resume-date">Mar 2025 – Pres.</td>
              <td class="resume-title">Minescout Beta</td>
              <td><strong>Founder</strong> — Created a technology review and beta testing platform focused on AI tools and large language model workflows. Evaluated emerging technologies and documented performance findings to validate AI-assisted workflows. Organized testing processes and structured user feedback collection.</td>
            </tr>
          </tbody>

          <tbody>
            <tr class="year-row"><td colspan="3">Education &amp; Community</td></tr>
            <tr class="entry-row" style="--delay: 350ms;">
              <td class="resume-date">2025 – Present</td>
              <td class="resume-title">Eastlake High School</td>
              <td><strong>10th grade (GPA: 4.0)</strong> — Expected Graduation: June 2029. Areas of focus include Engineering, Computer Science, and CAD Design (Fusion 360). Honors include National Junior Honor Society, English Achievement, and School Spirit Awards.</td>
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
              <td class="resume-date">Jan 2023 – Pres.</td>
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
          <a class="project-card" href="/studio" style="--delay: 100ms;">
            <div class="project-date">Feb<br>2026</div>
            <div><div class="project-title">Minescout Studio</div><div class="project-url">minescout.net/studio</div></div>
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
  // Add these inside your views object in views.js
'/photography': `
    <div class="main--page">
      <div class="page-content" style="max-width: 800px;">
        <p class="page-label">Portfolio</p>
        <h1 class="page-title">Photography Archive</h1>
        <p class="hero-desc" style="margin-bottom: 2rem;">
          A collection of my best captures ranging from wildlife action at Grouse Mountain to architectural details in Europe, shot using my Nikon D7200 or Pixel device. 
        </p>

        <div class="photography-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 3rem;">
          
          <!-- Wildlife Highlights -->
          <div class="photo-card" style="grid-column: 1 / -1;">
            <img src="/assets/owl-flight.jpg" alt="Great Horned Owl in Flight" style="width: 100%; border-radius: 8px; border: 1px solid var(--border);" />
            <p style="font-size: 0.8rem; color: var(--muted); margin-top: 0.5rem;"><strong>Great Horned Owl in Flight</strong> — Grouse Mountain, BC | Nikon D7200, ƒ/4.8, 1/8000, 125mm, ISO 1000</p>
          </div>
          <div class="photo-card">
            <img src="/assets/owl-portrait.jpg" alt="Great Horned Owl Portrait" style="width: 100%; border-radius: 8px; border: 1px solid var(--border);" />
            <p style="font-size: 0.8rem; color: var(--muted); margin-top: 0.5rem;"><strong>Owl Portrait</strong> — Grouse Mountain, BC | High-Key Background</p>
          </div>
          <div class="photo-card">
            <img src="/assets/vulture.jpg" alt="Vulture Portrait" style="width: 100%; border-radius: 8px; border: 1px solid var(--border);" />
            <p style="font-size: 0.8rem; color: var(--muted); margin-top: 0.5rem;"><strong>Turkey Vulture Close-Up</strong> — Grouse Mountain, BC | Sharp Eye Focus</p>
          </div>

          <!-- Architecture Additions -->
          <div class="photo-card">
            <img src="/assets/sagrada-familia-door.jpg" alt="Sagrada Família Door" style="width: 100%; border-radius: 8px; border: 1px solid var(--border);" />
            <p style="font-size: 0.8rem; color: var(--muted); margin-top: 0.5rem;"><strong>Sagrada Família Facade Door</strong> — Barcelona, Spain | Nikon D7200, ƒ/5.6, 1/30s, 18mm, ISO 560</p>
          </div>
          <div class="photo-card">
            <img src="/assets/pisa.jpg" alt="Leaning Tower of Pisa" style="width: 100%; border-radius: 8px; border: 1px solid var(--border);" />
            <p style="font-size: 0.8rem; color: var(--muted); margin-top: 0.5rem;"><strong>Leaning Tower of Pisa</strong> — Pisa, Italy | Nikon D7200, ƒ/11, 1/500s, 28mm, ISO 200</p>
          </div>

        </div>

      </div>
    </div>
  `,
  '/blog': buildBlogIndex(),
  '/studio': `
    <div class="main--page">
      <div class="page-content ai-wrap">
        <p class="ai-eyebrow">Minescout Studio</p>
        <h1 class="ai-title">Custom Websites.<br><em>Practical AI.</em><br>Built for Local Businesses in Sammamish & the Eastside.</h1>
        
        <p class="ai-lead" style="font-weight: 600; color: var(--fg); font-size: 1.1rem; margin-bottom: 0.5rem;">Still dealing with a slow, outdated WordPress site?</p>
        <p class="ai-lead">Minescout specializes in <strong>Clean Slate Rebuilds</strong>. Send me a link to your old website (or one you take inspiration from), and I will throw out the clunky code and build you a lightning-fast, 100% custom platform from the ground up.</p>
        
        <div class="ai-stats">
          <div class="ai-stat"><span class="ai-stat-val">&lt;7<em>days</em></span><span class="ai-stat-label">To Launch</span></div>
          <div class="ai-stat"><span class="ai-stat-val">100<em>%</em></span><span class="ai-stat-label">Custom Built</span></div>
          <div class="ai-stat"><span class="ai-stat-val">0<em>%</em></span><span class="ai-stat-label">Tech Debt</span></div>
        </div>
        
        <div class="ai-section-label">What We Build</div>
        <div class="ai-features">
          <a href="/studio/pricing" class="ai-feature"><div class="ai-feature-icon">⚡</div><div><div class="ai-feature-title">Clean Slate Rebuilds</div><div class="ai-feature-desc">A brand new, custom-coded website that grows with your business. No plugins, no bloat, no servers for you to manage.</div></div><span class="ai-feature-badge badge-live">Core</span></a>
          <a href="/studio/creation" class="ai-feature"><div class="ai-feature-icon">✨</div><div><div class="ai-feature-title">AI Site Builder</div><div class="ai-feature-desc">Chat with an AI to build a preview of your new site from a template. Like the result? Drop your email and I'll finish it.</div></div><span class="ai-feature-badge badge-live">New</span></a>
          <a href="/portal" target="_blank" class="ai-feature"><div class="ai-feature-icon">🎭</div><div><div class="ai-feature-title">The "Backstage" Dashboard</div><div class="ai-feature-desc">Your private dashboard where you can edit AI knowledge, see conversations, and manage your site without touching code.</div></div><span class="ai-feature-badge badge-node">Included</span></a>
        </div>

        <div class="ai-section-label">Specialist Services</div>
        <div class="ai-features">
          <a href="/studio/local-web-design" class="ai-feature"><div class="ai-feature-icon">📍</div><div><div class="ai-feature-title">Local Web Design</div><div class="ai-feature-desc">Fast, custom websites for small businesses in Sammamish, Issaquah, Redmond, and Bellevue, with pricing from $750.</div></div><span class="ai-feature-badge badge-live">Service</span></a>
          <a href="/studio/custom-storefronts" class="ai-feature"><div class="ai-feature-icon">🛒</div><div><div class="ai-feature-title">Custom E-Commerce Storefronts</div><div class="ai-feature-desc">Configurators, live unit toggles, and checkout or invoicing flows without monthly platform fees.</div></div><span class="ai-feature-badge badge-live">Service</span></a>
          <a href="/studio/student-nonprofit" class="ai-feature"><div class="ai-feature-icon">🎓</div><div><div class="ai-feature-title">Students, Clubs &amp; Nonprofits</div><div class="ai-feature-desc">Discounted custom websites from $250 for student organizations, robotics teams, scouts, and community nonprofits.</div></div><span class="ai-feature-badge badge-live">Service</span></a>
        </div>
        
        <div class="ai-callout" style="border-left-color: var(--fg); background: var(--bg);">
          <div class="ai-callout-title">🤝 Agency Quality, Direct Access.</div>
          <div class="ai-callout-desc">Traditional agencies have project managers, sales teams, designers, and heavy overhead. Minescout is different. You work directly with the founder building your project, allowing me to deliver custom work at a fraction of typical agency pricing.</div>
        </div>

        <div class="ai-callout">
          <div class="ai-callout-title">🛡️ Clear Ownership.</div>
          <div class="ai-callout-desc">You own your domain, branding, and content. Minescout licenses the software that powers your site, allowing continuous improvements and lightning-fast support. It feels intentional, never restrictive.</div>
        </div>
        
        <div class="ai-cta-group" style="margin-bottom: 3rem;">
          <a href="/contact" class="btn-primary">Book a Call</a>
          <a href="/studio/pricing" class="btn-ghost">See Pricing &rarr;</a>
        </div>
        
        <p class="ai-disclaimer">Every project is built directly by the founder from start to finish. Minescout Studio is operated by <a href="/">Thomas Carleton</a>. Whether you're a student building your first portfolio or a business looking to automate customer support, the goal is the same: build something that lasts.</p>
      </div>
    </div>
  `,
  '/studio/local-web-design': `
    <div class="main--page">
      <div class="page-content ai-wrap">
        <p class="ai-eyebrow">Minescout Studio &middot; Sammamish, WA</p>
        <h1 class="ai-title">Fast, custom websites for Sammamish and Eastside small businesses.</h1>

        <p class="ai-lead">If your site still runs on a slow template, every extra second is a customer who taps back to the map and calls the next business. I build custom, mobile-first sites for small businesses in <strong>Sammamish, Issaquah, Redmond, and Bellevue</strong> &mdash; static pages served from the edge, so the first screen is readable in well under a second.</p>

        <div class="ai-stats">
          <div class="ai-stat"><span class="ai-stat-val">&lt;1<em>s</em></span><span class="ai-stat-label">Edge first paint</span></div>
          <div class="ai-stat"><span class="ai-stat-val">100<em>%</em></span><span class="ai-stat-label">Custom built</span></div>
          <div class="ai-stat"><span class="ai-stat-val">0<em>%</em></span><span class="ai-stat-label">Plugin bloat</span></div>
        </div>

        <div class="ai-section-label">What your site gets</div>
        <div class="ai-features">
          <div class="ai-feature"><div class="ai-feature-icon">⚡</div><div><div class="ai-feature-title">Sub-second edge performance</div><div class="ai-feature-desc">Pre-built HTML served from a network near Sammamish instead of a database waking up on every visit. No plugin can slow it down after launch.</div></div><span class="ai-feature-badge badge-live">Core</span></div>
          <div class="ai-feature"><div class="ai-feature-icon">📱</div><div><div class="ai-feature-title">Mobile-first layouts</div><div class="ai-feature-desc">Most local searches happen on a phone. Every page is designed at phone width first, with readable hours, services, and a tap-to-call path above the fold.</div></div><span class="ai-feature-badge badge-live">Core</span></div>
          <div class="ai-feature"><div class="ai-feature-icon">🔍</div><div><div class="ai-feature-title">SEO setup that ships</div><div class="ai-feature-desc">Clean titles and descriptions, a sitemap, structured data, and fast pages &mdash; the groundwork Google needs before local listings can rank.</div></div><span class="ai-feature-badge badge-live">Core</span></div>
        </div>

        <div class="ai-section-label">Transparent starting tiers</div>
        <div class="dash-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem;margin-bottom:1.5rem;">
          <div class="dash-stat" style="text-align:left;">
            <div style="font-size:1rem;font-family:var(--serif);font-weight:700;color:var(--fg);margin-bottom:0.3rem;">Portfolio</div>
            <div style="color:var(--accent);font-weight:600;margin-bottom:0.5rem;font-size:0.95rem;">From $750</div>
            <div style="font-size:0.8rem;color:var(--muted);line-height:1.6;">Custom design, responsive layout, contact form, SEO basics, and fast hosting setup.</div>
          </div>
          <div class="dash-stat" style="text-align:left;">
            <div style="font-size:1rem;font-family:var(--serif);font-weight:700;color:var(--fg);margin-bottom:0.3rem;">Professional</div>
            <div style="color:var(--accent);font-weight:600;margin-bottom:0.5rem;font-size:0.95rem;">From $1,500</div>
            <div style="font-size:0.8rem;color:var(--muted);line-height:1.6;">Multiple pages, booking and contact integrations, analytics, and performance work.</div>
          </div>
          <div class="dash-stat" style="text-align:left;">
            <div style="font-size:1rem;font-family:var(--serif);font-weight:700;color:var(--fg);margin-bottom:0.3rem;">Business</div>
            <div style="color:var(--accent);font-weight:600;margin-bottom:0.5rem;font-size:0.95rem;">From $2,500</div>
            <div style="font-size:0.8rem;color:var(--muted);line-height:1.6;">Discovery meeting, fully custom design, advanced SEO, custom forms, and an AI-ready foundation.</div>
          </div>
        </div>
        <p style="font-size:0.85rem;color:var(--muted);line-height:1.8;margin-bottom:2.5rem;">Those are starting prices, not a range pulled from an industry survey. Optional care plans run <strong style="color:var(--fg);">$10&ndash;$75 / month</strong> for priority support, edge hosting and SSL, updates, backups, and AI maintenance. None of them is required. <a href="/studio/pricing" style="color:var(--accent);">See the full pricing page &rarr;</a></p>

        <div class="ai-callout">
          <div class="ai-callout-title">🦅 Built locally by an Eagle Scout.</div>
          <div class="ai-callout-desc">Minescout Studio is run by Thomas Carleton, a Sammamish-based student developer and Eagle Scout. You work directly with the person building the site &mdash; no account manager, no offshore handoff, and no agency overhead baked into the quote. The same follow-through that earned the Eagle rank is what keeps your site fast after launch. <a href="/blog/eagle-scout-project.html" style="color:var(--accent);">Read the Eagle Scout project story &rarr;</a></div>
        </div>

        <div class="ai-section-label">Ready when you are</div>
        <p class="ai-lead" style="margin-bottom:1.5rem;">Tell me what your business does and what your current site gets wrong. You will get a straight answer on scope and price, usually within a day.</p>
        <div class="ai-cta-group" style="margin-bottom:3rem;">
          <a href="/studio/intake" class="btn-primary">Start a project</a>
          <a href="/studio/pricing" class="btn-ghost">See pricing &rarr;</a>
        </div>

        <div class="ai-section-label">Other services</div>
        <div class="ai-features">
          <a href="/studio/custom-storefronts" class="ai-feature"><div class="ai-feature-icon">🛒</div><div><div class="ai-feature-title">Custom e-commerce storefronts</div><div class="ai-feature-desc">Configurators, live unit toggles, and checkout flows without monthly platform fees.</div></div><span class="ai-feature-badge badge-node">Service</span></a>
          <a href="/studio/student-nonprofit" class="ai-feature"><div class="ai-feature-icon">🎓</div><div><div class="ai-feature-title">Students, clubs &amp; nonprofits</div><div class="ai-feature-desc">Discounted custom websites from $250 for student organizations and community groups.</div></div><span class="ai-feature-badge badge-node">Service</span></a>
        </div>

        <p class="ai-disclaimer">Minescout Studio is operated by <a href="/">Thomas Carleton</a> in Sammamish, Washington. Serving Sammamish, Issaquah, Redmond, Bellevue, and the wider Eastside.</p>
      </div>
    </div>
  `,
  '/studio/custom-storefronts': `
    <div class="main--page">
      <div class="page-content ai-wrap">
        <p class="ai-eyebrow">Minescout Studio &middot; Storefronts</p>
        <h1 class="ai-title">Custom e-commerce storefronts built for speed and zero platform bloat.</h1>

        <p class="ai-lead">Platform subscriptions are easy to start and expensive to leave. I build storefronts as custom code instead: fast pages, a product model that matches how you actually sell, and checkout or invoicing that fits the business &mdash; without a monthly platform fee stacked on top of every transaction.</p>

        <div class="ai-stats">
          <div class="ai-stat"><span class="ai-stat-val">0<em>%</em></span><span class="ai-stat-label">Platform cut</span></div>
          <div class="ai-stat"><span class="ai-stat-val">1<em> model</em></span><span class="ai-stat-label">Products &amp; quotes</span></div>
          <div class="ai-stat"><span class="ai-stat-val">&lt;1<em>s</em></span><span class="ai-stat-label">First response</span></div>
        </div>

        <div class="ai-section-label">Live proof: The Chop Lab</div>
        <div class="ai-callout" style="border-left-color:var(--fg);background:var(--bg);">
          <div class="ai-callout-title">🛠️ <a href="https://chop-lab.com" target="_blank" rel="noopener" style="color:var(--accent);">chop-lab.com</a></div>
          <div class="ai-callout-desc">The Chop Lab sells ceramics tooling where almost nothing is a fixed SKU: custom chops cut from a maker&rsquo;s logo, texture rollers with repeating geometry, slab rails in a customer&rsquo;s exact width. The storefront handles that with <strong style="color:var(--fg);">interactive configurators</strong>, <strong style="color:var(--fg);">live unit toggles</strong> that switch every measurement between millimetres and inches, and a submission flow that turns a drawing or dimension into a real quote instead of a dead cart.</div>
          <div style="margin-top:1.25rem;"><a href="/blog/chop-lab-storefront.html" class="btn-ghost" style="border-color:var(--border);color:var(--fg);">Read the case study &rarr;</a></div>
        </div>

        <div class="ai-section-label">What a custom storefront handles</div>
        <div class="ai-features">
          <div class="ai-feature"><div class="ai-feature-icon">🎛️</div><div><div class="ai-feature-title">Interactive configurators</div><div class="ai-feature-desc">Customers pick a product, choose a texture or option, and enter their own dimensions. The form validates the specification instead of guessing at a variant.</div></div><span class="ai-feature-badge badge-live">Core</span></div>
          <div class="ai-feature"><div class="ai-feature-icon">📐</div><div><div class="ai-feature-title">Live unit toggles</div><div class="ai-feature-desc">Lengths are stored canonically in millimetres and converted at render time, so switching between mm and inches re-renders every measurement at once without losing precision.</div></div><span class="ai-feature-badge badge-live">Core</span></div>
          <div class="ai-feature"><div class="ai-feature-icon">🧾</div><div><div class="ai-feature-title">Checkout and invoicing that fit</div><div class="ai-feature-desc">Card checkout through Stripe, or a quote-and-invoice flow for made-to-order work. You pay processor fees, not a platform tax on every sale.</div></div><span class="ai-feature-badge badge-live">Core</span></div>
          <div class="ai-feature"><div class="ai-feature-icon">🗂️</div><div><div class="ai-feature-title">A catalog you own</div><div class="ai-feature-desc">Product data lives with the site, versioned and typed. Adding an item is a simple form, not a plugin update that breaks the theme.</div></div><span class="ai-feature-badge badge-live">Core</span></div>
        </div>

        <div class="ai-section-label">What it costs</div>
        <div class="dash-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;margin-bottom:1.5rem;">
          <div class="dash-stat" style="text-align:left;">
            <div style="font-size:1rem;font-family:var(--serif);font-weight:700;color:var(--fg);margin-bottom:0.3rem;">Business</div>
            <div style="color:var(--accent);font-weight:600;margin-bottom:0.5rem;font-size:0.95rem;">From $2,500</div>
            <div style="font-size:0.8rem;color:var(--muted);line-height:1.6;">Fully custom storefront design, advanced SEO, custom forms, and an AI-ready foundation. Where a real storefront starts.</div>
          </div>
          <div class="dash-stat" style="text-align:left;">
            <div style="font-size:1rem;font-family:var(--serif);font-weight:700;color:var(--fg);margin-bottom:0.3rem;">Business + AI</div>
            <div style="color:var(--accent);font-weight:600;margin-bottom:0.5rem;font-size:0.95rem;">From $3,500</div>
            <div style="font-size:0.8rem;color:var(--muted);line-height:1.6;">Everything in Business plus a custom AI assistant, knowledge base, automation, and a dashboard.</div>
          </div>
        </div>
        <p style="font-size:0.85rem;color:var(--muted);line-height:1.8;margin-bottom:2.5rem;">Optional hosting and support run <strong style="color:var(--fg);">$15&ndash;$75 / month</strong>, and none of it is required &mdash; you can host the store yourself. A configurator or quote flow is what moves the estimate above the tier floor, not the number of pages. <a href="/studio/pricing" style="color:var(--accent);">See the full pricing page &rarr;</a></p>

        <div class="ai-section-label">Ready when you are</div>
        <p class="ai-lead" style="margin-bottom:1.5rem;">Tell me what you sell, which products need configuration, and who will add new products after launch. Those three answers move the quote more than anything else.</p>
        <div class="ai-cta-group" style="margin-bottom:3rem;">
          <a href="/studio/intake" class="btn-primary">Scope a storefront</a>
          <a href="/blog/chop-lab-storefront.html" class="btn-ghost">Read the case study &rarr;</a>
        </div>

        <div class="ai-section-label">Other services</div>
        <div class="ai-features">
          <a href="/studio/local-web-design" class="ai-feature"><div class="ai-feature-icon">📍</div><div><div class="ai-feature-title">Local web design</div><div class="ai-feature-desc">Fast, custom websites for Sammamish and Eastside small businesses, from $750.</div></div><span class="ai-feature-badge badge-node">Service</span></a>
          <a href="/studio/student-nonprofit" class="ai-feature"><div class="ai-feature-icon">🎓</div><div><div class="ai-feature-title">Students, clubs &amp; nonprofits</div><div class="ai-feature-desc">Discounted custom websites from $250 for student organizations and community groups.</div></div><span class="ai-feature-badge badge-node">Service</span></a>
        </div>

        <p class="ai-disclaimer">Minescout Studio is operated by <a href="/">Thomas Carleton</a>. The Chop Lab storefront at <a href="https://chop-lab.com" target="_blank" rel="noopener">chop-lab.com</a> is live, and the build is documented in the <a href="/blog/chop-lab-storefront.html">case study</a>.</p>
      </div>
    </div>
  `,
  '/studio/student-nonprofit': `
    <div class="main--page">
      <div class="page-content ai-wrap">
        <p class="ai-eyebrow">Minescout Studio &middot; Student &amp; Nonprofit Program</p>
        <h1 class="ai-title">Custom websites for student organizations, clubs, and local nonprofits.</h1>

        <p class="ai-lead">A student club should not need a $2,500 budget to look credible online. Each semester I reserve a limited number of discounted projects for <strong>students, robotics teams, scouts, school clubs, and community nonprofits</strong>. Typical projects land between <strong>$250 and $750</strong> depending on scope &mdash; and they are built on the same fast, custom stack as my commercial work.</p>

        <div class="ai-stats">
          <div class="ai-stat"><span class="ai-stat-val">$250<em>+</em></span><span class="ai-stat-label">Discounted start</span></div>
          <div class="ai-stat"><span class="ai-stat-val">~5<em> days</em></span><span class="ai-stat-label">To launch</span></div>
          <div class="ai-stat"><span class="ai-stat-val">$10<em>/mo</em></span><span class="ai-stat-label">Optional care</span></div>
        </div>

        <div class="ai-section-label">What is included</div>
        <div class="ai-features">
          <div class="ai-feature"><div class="ai-feature-icon">🎨</div><div><div class="ai-feature-title">A custom design, not a template</div><div class="ai-feature-desc">Your club&rsquo;s colors, logo, and photos in a layout built for its actual content &mdash; not a generic theme with the name swapped in.</div></div><span class="ai-feature-badge badge-live">Included</span></div>
          <div class="ai-feature"><div class="ai-feature-icon">📱</div><div><div class="ai-feature-title">Mobile-first pages</div><div class="ai-feature-desc">Members and parents will open the site on a phone. Everything is readable and tappable without pinch-zooming.</div></div><span class="ai-feature-badge badge-live">Included</span></div>
          <div class="ai-feature"><div class="ai-feature-icon">✉️</div><div><div class="ai-feature-title">Join, contact, and sign-up forms</div><div class="ai-feature-desc">A working form for new members, volunteers, or donations that sends to an inbox you actually check.</div></div><span class="ai-feature-badge badge-live">Included</span></div>
          <div class="ai-feature"><div class="ai-feature-icon">🔍</div><div><div class="ai-feature-title">SEO basics and fast hosting</div><div class="ai-feature-desc">Clean titles, a sitemap, and edge hosting so the site shows up in search and opens instantly on event day.</div></div><span class="ai-feature-badge badge-live">Included</span></div>
        </div>

        <div class="ai-section-label">Who the program is for</div>
        <ul style="margin-bottom:2.5rem;padding-left:1.5rem;color:var(--muted);line-height:1.9;">
          <li><strong style="color:var(--fg);">Students</strong> building a first portfolio, project page, or application site.</li>
          <li><strong style="color:var(--fg);">Robotics teams, scout troops, and school clubs</strong> that need a home for schedules, sponsors, and sign-ups.</li>
          <li><strong style="color:var(--fg);">Community nonprofits</strong> that need a credible web presence without an agency budget.</li>
        </ul>

        <div class="ai-callout">
          <div class="ai-callout-title">🤝 Real work, already shipped.</div>
          <div class="ai-callout-desc">The same stack runs live client sites for an artist, an accessibility startup, and a ceramics tooling studio. You can read the details on the <a href="/studio/clients" style="color:var(--accent);">client work page</a> before you apply &mdash; the standard does not drop because the budget is smaller.</div>
        </div>

        <div class="ai-section-label">Pricing that fits a club budget</div>
        <p style="font-size:0.9rem;color:var(--muted);line-height:1.9;margin-bottom:1.5rem;">Discounted projects run <strong style="color:var(--fg);">$250&ndash;$750</strong> depending on scope, against a regular Portfolio tier that starts at $750. If you want someone else to keep it running, the optional priority care plan is <strong style="color:var(--fg);">$10 / month</strong>, and hosting plans start at $15 / month. Neither is required &mdash; the site is yours to host and edit. <a href="/studio/pricing" style="color:var(--accent);">See the full pricing page &rarr;</a></p>

        <div class="ai-section-label">Ready when you are</div>
        <p class="ai-lead" style="margin-bottom:1.5rem;">Tell me what your group does, who it serves, and what you need the site to handle. Availability is limited each semester, so apply early.</p>
        <div class="ai-cta-group" style="margin-bottom:3rem;">
          <a href="/studio/intake" class="btn-primary">Apply for the program</a>
          <a href="/studio/clients" class="btn-ghost">See client work &rarr;</a>
        </div>

        <div class="ai-section-label">Other services</div>
        <div class="ai-features">
          <a href="/studio/local-web-design" class="ai-feature"><div class="ai-feature-icon">📍</div><div><div class="ai-feature-title">Local web design</div><div class="ai-feature-desc">Fast, custom websites for Sammamish and Eastside small businesses, from $750.</div></div><span class="ai-feature-badge badge-node">Service</span></a>
          <a href="/studio/custom-storefronts" class="ai-feature"><div class="ai-feature-icon">🛒</div><div><div class="ai-feature-title">Custom e-commerce storefronts</div><div class="ai-feature-desc">Configurators, live unit toggles, and checkout flows without monthly platform fees.</div></div><span class="ai-feature-badge badge-node">Service</span></a>
        </div>

        <p class="ai-disclaimer">Minescout Studio is operated by <a href="/">Thomas Carleton</a>, a student developer in Sammamish, Washington. The student and nonprofit program is limited to a few projects each semester.</p>
      </div>
    </div>
  `,
  '/studio/clients': `
    <div class="main--page">
      <div class="page-content clients-wrap">
        <p class="page-label">Portfolio</p>
        <h1 class="page-title">Client Work</h1>
        <p class="clients-intro">Minescout builds custom websites and AI systems for people who want agency-quality results without agency complexity. Below are our active deployments.</p>
        
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
        <div class="client-card" style="--d:0.4s;">
          <div class="client-card-header"><div><div class="client-name">Tactile Menus</div><div class="client-type">Accessibility &amp; Restaurant Services</div></div><span class="client-status status-live">Live</span></div>
          <div class="client-card-body">
            <div class="client-detail-grid">
              <div><div class="client-detail-label">Deployment</div><div class="client-detail-val">November 2026</div></div>
              <div><div class="client-detail-label">Solution</div><div class="client-detail-val">Search Indexing &amp; Analytics Telemetry</div></div>
              <div><div class="client-detail-label">Program</div><div class="client-detail-val">Charter Partner</div></div>
            </div>
            <p class="client-note">Establishing search visibility and real-time traffic telemetry for Eastside accessibility startup Tactile Menus. We configured Google Search Console domain verification and deployed a Google Tag Manager container directly into their CI/CD pipeline to track search keyword performance and user engagement.<br><a href="https://tactilemenus.netlify.app" class="view-link" target="_blank">View Live Site &rarr;</a></p>
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
            <p class="client-note">A complete Clean Slate Rebuild. We threw out the legacy code and rebuilt the site from the ground up as a high-performance visual experience featuring dynamic gallery rendering and fast mobile load times.</p>            
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
        
        <div class="clients-cta" style="margin-top: 3rem;">
          <a href="/contact" class="btn-primary">Book a Call</a>
        </div>
      </div>
    </div>
  `,'/studio/process': `
    <div class="main--page">
      <div class="page-content process-wrap">
        <p class="page-label">Minescout Studio</p>
        <h1 class="page-title">The Process</h1>
        <div style="display: inline-block; background: var(--fg); color: var(--bg); padding: 0.4rem 0.8rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1.5rem;">Total time: ~5–7 days</div>
        <p class="process-intro">From first conversation to live website — here's exactly what working with Minescout looks like, step by step. No surprises, no jargon.</p>
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
              <div class="phase-header"><div class="phase-title">Extract & Organize</div><span class="phase-timeline-tag">Day 1&ndash;2</span></div>
              <p class="phase-desc">You send me a link to your current website, or a few sites you love the look of. I extract your core content, FAQs, and brand assets. We throw out all the old, clunky tech debt and start with a blank canvas.</p>
              <ul class="phase-deliverables"><li>Link to old site provided</li><li>Inspiration designs locked in</li><li>Content mapped out</li></ul>
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
          <a href="/studio/pricing" class="btn-ghost" style="border-color: var(--border); color: var(--fg);">View pricing &rarr;</a>
        </div>
      </div>
    </div>
  `,
  '/studio/legal': `
    <div class="main--page">
      <div class="page-content legal-wrap">
        <p class="page-label">Minescout Studio</p>
        <h1 class="page-title">How Studio Works</h1>
        <p class="legal-updated">Transparency &amp; service information · Last reviewed November 18, 2026</p>

        <div class="legal-section" style="--d:0.28s;">
          <div class="legal-section-title">A note about this page</div>
          <p class="legal-body">This page is here to help you understand who is behind Minescout Studio, how projects generally work, what technology may be involved, and what to expect when you reach out. It is an informational overview—not a required click-through contract, a project quote, or a substitute for a separate written agreement.</p>
          <p class="legal-body">You do not have to sign up to a project by reading this page or sending an enquiry. If you and I decide to work together, we can choose to put the details for that particular build into a separate written agreement. Whether to do that is up to both of us. If we do not create one, we should still discuss and confirm the practical details clearly before work begins.</p>
          <p class="legal-body">Nothing on this page is intended to take away rights that cannot legally be waived or to promise that every situation will be handled in a particular way.</p>
        </div>

        <div class="legal-section" style="--d:0.34s;">
          <div class="legal-section-title">Who is behind Minescout Studio?</div>
          <p class="legal-body">Minescout Studio is the name I use for my independent web-development and technology work. It is operated by me, Thomas Carleton, as an individual—not by a corporation or LLC. I work directly with clients on project planning, development, and communication.</p>
          <p class="legal-body">Minescout Studio is a project and working name; it should not be mistaken for a separate registered company.</p>
        </div>

        <div class="legal-section" style="--d:0.4s;">
          <div class="legal-section-title">Services, scope &amp; expectations</div>
          <p class="legal-body">Projects may include website design and development, site rebuilds, hosting or deployment setup, AI-assisted features, integrations, and related technical work. The exact work depends on the project.</p>
          <p class="legal-body">Before starting a build, we should discuss what is included, what is not included, the expected timeline, pricing (if any), who supplies content and accounts, and how changes or ongoing support will be handled. A quote or conversation is an estimate of the proposed work, not a promise of results.</p>
          <p class="legal-body">Websites depend on hosting providers, networks, browsers, APIs, and other services outside my direct control. I aim to build and maintain projects carefully, but uninterrupted availability, specific search rankings, traffic, sales, lead volume, or business outcomes cannot be guaranteed.</p>
        </div>

        <div class="legal-section" style="--d:0.46s;">
          <div class="legal-section-title">AI tools &amp; generated content</div>
          <p class="legal-body">Some Studio tools use AI to help discuss project requirements, organize information, or support website and assistant workflows. AI output can be incomplete, inaccurate, or out of date. It should be reviewed by a person before being published or relied on—especially for pricing, policies, health, legal, financial, safety, or other important information.</p>
          <p class="legal-body">The AI Site Builder is a project-discovery and specification conversation. It helps collect information about a possible website; it does not itself create a finished, approved, or production-ready website. If you choose to send your specification to me, the conversation and the details you submit may be forwarded so I can review the request and respond.</p>
          <p class="legal-body">Please do not enter passwords, payment-card details, government identification numbers, private customer records, confidential business secrets, or sensitive personal or health information into an AI tool or enquiry form. If a project genuinely requires handling sensitive information, that needs to be discussed separately before any data is submitted or processed.</p>
        </div>

        <div class="legal-section" style="--d:0.52s;">
          <div class="legal-section-title">Information &amp; privacy</div>
          <p class="legal-body">Depending on how you use the site or a Studio project, information you choose to provide may include your name, email address, business or project details, messages, AI Site Builder conversation, and feedback. Please only submit information you are comfortable sharing for the purpose of your enquiry or project.</p>
          <p class="legal-body">The AI Site Builder sends conversation messages to a server-side service for processing. The AI Worker does not save the conversation as persistent project data; the conversation exists during the active session and is cleared when you refresh the page. If you choose to send your specification to me, the submitted conversation and contact details are forwarded by email for follow-up. That email is stored in my Gmail account and remains there until I delete it.</p>
          <p class="legal-body">The Studio pages load Google Tag Manager. Depending on the tags configured in that container, analytics or other third-party technologies may collect technical or usage information. The exact tags and their behavior should be reviewed in the relevant provider settings; this page does not claim that no third party ever receives information.</p>
          <p class="legal-body">The relevant infrastructure and email services are operated by their respective providers and are subject to their own terms and privacy practices. Relevant information is available from <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener">Cloudflare</a> and <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Google</a>.</p>
          <p class="legal-body">I use submitted information to respond to enquiries, plan and deliver requested work, operate project features, troubleshoot issues, and maintain the services. I do not intend to sell personal information. No online service can be described as perfectly secure, and I cannot promise that every provider or network is free from risk.</p>
          <p class="legal-body">If you have a question about information you submitted through a Studio tool or project, contact me at <a href="mailto:thomas@minescout.net">thomas@minescout.net</a>. I will review reasonable requests about access, correction, or deletion, subject to applicable requirements and any records that need to be retained.</p>
        </div>

        <div class="legal-section" style="--d:0.58s;">
          <div class="legal-section-title">Client content, code &amp; project ownership</div>
          <p class="legal-body">You remain responsible for having the rights and permissions needed to provide logos, photos, text, customer information, and other materials for a project. Please do not send material you are not authorized to share.</p>
          <p class="legal-body">A website build can include client-provided material, custom work created for that project, reusable tools or components, open-source software, fonts, libraries, APIs, and third-party services. Those categories can have different ownership and license terms. This overview does not automatically transfer ownership of every part of a project to either side.</p>
          <p class="legal-body">If ownership, source-code access, licenses, portfolio examples, confidentiality, or handoff requirements matter to your project, we should spell them out in the project discussion or a separate written agreement before work begins. I will ask before using non-public project details as a public case study or testimonial.</p>
        </div>

        <div class="legal-section" style="--d:0.64s;">
          <div class="legal-section-title">Pricing, payments &amp; ongoing support</div>
          <p class="legal-body">Pricing depends on the requested work and any ongoing services. A specific quote should explain the proposed price and what it covers. Do not assume that a price shown for one package or project automatically applies to another.</p>
          <p class="legal-body">Payment timing, deposits, subscriptions, refunds, cancellation, hosting, maintenance, and support arrangements should be discussed for the particular project before anyone commits. Unless we separately agree otherwise, this page does not create a payment obligation or a subscription.</p>
        </div>

        <div class="legal-section" style="--d:0.7s;">
          <div class="legal-section-title">Charter Partners, free work &amp; testimonials</div>
          <p class="legal-body">From time to time, I may offer a project or service at no cost or at a reduced rate in exchange for feedback or the opportunity to document the work. Any expectations for a particular partner should be discussed directly and voluntarily before the project starts.</p>
          <p class="legal-body">If someone receives free or discounted work and later provides a testimonial, review, or endorsement, that relationship should be clearly disclosed wherever the endorsement is published. A testimonial should reflect the person's honest experience; positive feedback is never required as the price of receiving a service.</p>
          <p class="legal-body">A case study, business name, logo, quote, or other identifiable client material will only be used publicly with the appropriate permission.</p>
        </div>

        <div class="legal-section" style="--d:0.76s;">
          <div class="legal-section-title">Third-party services &amp; practical limitations</div>
          <p class="legal-body">A project may rely on services such as Cloudflare, Google, domain registrars, AI model providers, or other vendors. Their availability, pricing, features, policies, and technical behavior can change. A provider outage, account restriction, API change, or service discontinuation may affect a project even when its code has not changed.</p>
          <p class="legal-body">Clients should keep control of their own domain registrations and important business accounts where practical, use strong unique passwords and multi-factor authentication, and maintain copies of important business content. The exact backup, security, monitoring, and maintenance responsibilities should be clarified for each project.</p>
        </div>

        <div class="legal-section" style="--d:0.82s;">
          <div class="legal-section-title">Affiliate links</div>
          <p class="legal-body">Some recommendations on the <a href="/studio/tools">Tools I Use</a> page may contain affiliate links. Where a link is an affiliate link, I may receive a commission if you sign up or make a purchase through it. That does not add a cost to you unless the provider says otherwise, and it should not be treated as an independent endorsement of every product or service.</p>
        </div>

        <div class="legal-contact">
          <div class="legal-contact-title">Questions or want to discuss a project?</div>
          <div class="legal-contact-body">If anything here is unclear, or you want to discuss a separate written agreement for a particular build, reach out directly. <a href="/contact">Contact page</a> or <a href="mailto:thomas@minescout.net">thomas@minescout.net</a>.</div>
        </div>
      </div>
    </div>
  `,

'/studio/tools': `
    <div class="main--page">
      <div class="page-content tools-wrap">
        <p class="page-label">Minescout Studio</p>
        <h1 class="page-title" style="opacity:0;animation:fadeUp 0.5s ease 0.1s forwards;">Tools I Use</h1>
        <div class="tools-disclaimer"><strong>Honest reviews only.</strong> No sponsored picks. I'm no master programmer—rather, I'm a builder and systems architect who understands what you want and knows how to orchestrate the right tools to make it happen. These are the tools I actually use daily for building Minescout Studio, client projects, schoolwork, and FRC robotics. I list where things fall short too.</div>
        
        <div class="tools-category" style="--cd:0.2s;">AI &amp; Language Models</div>
        <div class="tool-card" style="--td:0.25s;">
          <div class="tool-logo">&#10024;</div>
          <div class="tool-body">
            <div class="tool-name-row"><span class="tool-name">Gemini 3.1 Pro &amp; 4 Argon</span><span class="tool-badge badge-core">Core</span></div>
            <div class="tool-rating"><span class="star">&#9733;</span><span class="star">&#9733;</span><span class="star">&#9733;</span><span class="star">&#9733;</span><span class="star">&#9733;</span></div>
            <p class="tool-desc">My primary reasoning engines. I rely heavily on Gemini 3.1 Pro and 4 Argon for deep integration, parsing massive amounts of context, and solving complex architectural problems for Minescout Studio.</p>
            <div class="tool-verdict-grid">
              <div class="verdict-box pro"><div class="verdict-label">Works well for</div><div class="verdict-text">Deep reasoning, contextual understanding across huge workspaces, and heavy architectural lifting.</div></div>
              <div class="verdict-box con"><div class="verdict-label">Watch out for</div><div class="verdict-text">4 Argon can eat into usage limits much faster, and strict guardrails sometimes block creative coding requests.</div></div>
            </div>
          </div>
          <a href="https://gemini.google.com" target="_blank" rel="noopener" class="tool-link tool-link-ghost">Visit</a>
        </div>

        <div class="tool-card" style="--td:0.3s;">
          <div class="tool-logo">&#x1F500;</div>
          <div class="tool-body">
            <div class="tool-name-row"><span class="tool-name">LibreChat &amp; OpenHands (via OpenRouter)</span><span class="tool-badge badge-free">Free tier</span><span class="tool-badge badge-core">Core</span></div>
            <div class="tool-rating"><span class="star">&#9733;</span><span class="star">&#9733;</span><span class="star">&#9733;</span><span class="star">&#9733;</span><span class="star">&#9733;</span></div>
            <p class="tool-desc">A massive upgrade to my daily workflow. Pairing LibreChat's unified interface and OpenHands' autonomous coding agents with free OpenRouter models lets me prototype, test, and iterate without burning through paid API budgets.</p>
            <div class="tool-verdict-grid">
              <div class="verdict-box pro"><div class="verdict-label">Works well for</div><div class="verdict-text">Zero-cost model routing, autonomous agentic coding tasks, and testing multiple open-weight models side-by-side.</div></div>
              <div class="verdict-box con"><div class="verdict-label">Watch out for</div><div class="verdict-text">Initial configuration takes some tinkering, and free OpenRouter endpoints can occasionally hit rate limits during peak hours.</div></div>
            </div>
          </div>
          <a href="https://openrouter.ai" target="_blank" rel="noopener" class="tool-link tool-link-ghost">Visit</a>
        </div>

        <div class="tool-card" style="--td:0.35s;">
          <div class="tool-logo">&#128171;</div>
          <div class="tool-body">
            <div class="tool-name-row"><span class="tool-name">ChatGPT 5.1</span></div>
            <div class="tool-rating"><span class="star">&#9733;</span><span class="star">&#9733;</span><span class="star">&#9733;</span><span class="star-empty">&#9733;</span><span class="star-empty">&#9733;</span></div>
            <p class="tool-desc">A fast starting point for initial brainstorming and quick one-off prototypes. It shines on the first few prompts, though I rely on it less for sustained, multi-step architecture sessions.</p>
            <div class="tool-verdict-grid">
              <div class="verdict-box pro"><div class="verdict-label">Works well for</div><div class="verdict-text">Initial project kickoffs, rapid first-draft code generation, and quick syntax checks.</div></div>
              <div class="verdict-box con"><div class="verdict-label">Watch out for</div><div class="verdict-text">After a few follow-up questions, it tends to hyperfocus on the wrong details, leading to cascading small errors.</div></div>
            </div>
          </div>
          <a href="https://chatgpt.com" target="_blank" rel="noopener" class="tool-link tool-link-ghost">Visit</a>
        </div>

        <div class="tools-category" style="--cd:0.42s;">Hosting &amp; Infrastructure</div>
        <div class="tool-card" style="--td:0.45s;">
          <div class="tool-logo">&#x26A1;</div>
          <div class="tool-body">
            <div class="tool-name-row"><span class="tool-name">Cloudflare</span><span class="tool-badge badge-free">Free tier</span><span class="tool-badge badge-core">Core</span></div>
            <div class="tool-rating"><span class="star">&#9733;</span><span class="star">&#9733;</span><span class="star">&#9733;</span><span class="star">&#9733;</span><span class="star">&#9733;</span></div>
            <p class="tool-desc">The absolute backbone of the Minescout Studio platform. DNS, CDN, Edge Workers, and KV Storage—all in one place. It provides sub-second latency, handles my multi-tenant routing perfectly, and works seamlessly with all my existing work.</p>
            <div class="tool-verdict-grid">
              <div class="verdict-box pro"><div class="verdict-label">Works well for</div><div class="verdict-text">Serverless architecture, instant global deployments, and maintaining a strict $0.00 risk profile.</div></div>
              <div class="verdict-box con"><div class="verdict-label">Watch out for</div><div class="verdict-text">Serverless environments require a different mental model than traditional server hosting.</div></div>
            </div>
          </div>
          <a href="https://cloudflare.com" target="_blank" rel="noopener" class="tool-link tool-link-ghost">Visit</a>
        </div>

        <div class="tool-card" style="--td:0.5s;">
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

        <div class="tools-category" style="--cd:0.54s;">Development</div>
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
            <div class="not-icon">&#x1F9E0;</div>
            <div><div class="not-name">Claude</div><div class="not-reason">Great model for writing and documentation, but strict age restrictions make it unnecessarily difficult for me to access and rely on for daily studio work.</div></div>
          </div>
          <div class="not-item">
            <div class="not-icon">&#x1F5B1;&#xFE0F;</div>
            <div><div class="not-name">Cursor</div><div class="not-reason">Comes with a very limited token budget on the free side, and the agent tends to burn through tokens focusing on files and context you don't actually need it touching.</div></div>
          </div>
          <div class="not-item">
            <div class="not-icon">&#x1F5C4;&#xFE0F;</div>
            <div><div class="not-name">Supabase</div><div class="not-reason">It's a genuinely great backend platform, but it introduces unnecessary setup friction and complexity when compared to my existing Cloudflare and Firebase workflow.</div></div>
          </div>
          <div class="not-item">
            <div class="not-icon">&#128187;</div>
            <div><div class="not-name">Wix</div><div class="not-reason">I initially looked at this for visual building, but it lacked the deep flexibility I needed. Writing raw HTML and custom CSS from scratch gave me vastly more control and resulted in a much better product for me.</div></div>
          </div>
          <div class="not-item">
            <div class="not-icon">&#129302;</div>
            <div><div class="not-name">GitHub Copilot</div><div class="not-reason">I wanted to like it, but I found it just isn't as good as using a chat interface directly. I prefer having a dedicated conversational workspace to think through problems rather than relying on inline code autocomplete.</div></div>
          </div>
          <div class="not-item">
            <div class="not-icon">&#128176;</div>
            <div><div class="not-name">WordPress</div><div class="not-reason">Simply too expensive for what I needed. Between hosting costs and the premium plugins required to get true design freedom, it completely violated my strict $0.00 infrastructure mandate.</div></div>
          </div>
        </div>
      </div>
    </div>
  `,
  '/studio/roi': `
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
          <a href="/studio/intake" class="verdict-cta">Get started</a>
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
  '/studio/intake': `
    <div class="main--page" style="padding: 0; width: 100%;">
      <div class="intake-root">
        <div class="form-wrapper">
          <div class="form-header">
            <h1>Custom Intelligence Intake</h1>
            <p>Provide the operational data for your Minescout Studio integration.</p>
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
                <div class="brand"><h1>Minescout Studio</h1><p>Custom Intelligence File</p></div>
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
                <div>Generated by Minescout Studio System</div><div>minescout.net/studio</div>
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
  '/studio/admin': `
    <div id="admin-root">
      <div id="admin-loading-screen">
        <div class="ls-logo">Minescout Studio</div><div class="ls-sub">Admin</div>
        <div class="ls-bar"><div class="ls-fill"></div></div>
      </div>
      <div id="login-screen">
        <div class="login-box">
          <div class="login-box-title">Admin Sign In</div><div class="login-box-sub">minescout.net/studio/admin</div>
          <div class="lf"><label>Email</label><input type="email" id="l-email" placeholder="thomas@minescout.net" /></div>
          <div class="lf"><label>Password</label><input type="password" id="l-pass" placeholder="••••••••" /></div>
          <button class="login-btn" id="l-btn" onclick="doLogin()">Sign In</button>
          <div class="login-err" id="l-err"></div>
        </div>
      </div>
      <div id="admin">
        <div class="topbar">
          <div><span class="topbar-logo">Minescout Studio</span><span class="topbar-badge">Admin</span></div>
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
            <a href="/studio" target="_blank"><span class="sidenav-icon">&#127760;</span>Public Site ↗</a>
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
  '/studio/creation': `
    <div class="main--page">
      <div class="page-content" style="max-width: 720px;">
        <p class="page-label">Minescout Studio</p>
        <h1 class="page-title">AI Site Builder</h1>
        <p style="color: var(--muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;">
          Describe your ideal website and I'll ask detailed questions to build a complete project spec.
          The transcript of our conversation gets sent to Thomas so he can build your site with a premium model.
          No live preview — just a thorough consultation.
        </p>

        <div id="creation-templates" style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
          <button class="btn-ghost template-pill" data-template="portfolio" onclick="window.selectTemplate('portfolio')">Portfolio</button>
          <button class="btn-ghost template-pill" data-template="business" onclick="window.selectTemplate('business')">Local Business</button>
          <button class="btn-ghost template-pill" data-template="photography" onclick="window.selectTemplate('photography')">Photography</button>
          <button class="btn-ghost template-pill" data-template="landing" onclick="window.selectTemplate('landing')">Landing Page</button>
          <button class="btn-ghost template-pill" data-template="custom" onclick="window.selectTemplate('custom')">Custom</button>
        </div>

        <div id="creation-chat" class="chat-window" style="height: 300px; border: 1px solid var(--border); border-radius: 8px; background: var(--bg); display: flex; flex-direction: column; margin-bottom: 1rem;">
          <div id="creation-messages" style="flex: 1; overflow-y: auto; padding: 1rem; font-size: 0.85rem; color: var(--muted);">
            <p style="color: var(--muted); text-align: center; padding: 2rem 1rem; line-height: 1.6;">
              Pick a template type above or describe your ideal site below.<br>
              Example: <em>"I'm a wedding photographer needing a clean gallery site with a contact form."</em>
            </p>
          </div>
        </div>

        <div class="chat-input-row" style="display: flex; gap: 0.5rem;">
          <input type="text" id="creation-input" placeholder="Describe your site..." autocomplete="off" style="flex: 1; padding: 0.75rem 1rem; border: 1px solid var(--border); border-radius: 8px; font-size: 0.9rem; outline: none;" />
          <button class="btn-primary" id="creation-send" onclick="window.sendCreationMessage()" style="padding: 0.75rem 1.25rem;">Send</button>
        </div>

        <!-- Preview section removed — no AI code gen. Chat builds a spec, sent to Thomas. -->

        <div id="creation-claim-trigger" style="display: none; margin-top: 1.5rem;">
          <button class="btn-primary" id="creation-claim-btn" onclick="window.showClaimForm()" style="width: 100%; padding: 0.9rem; font-size: 1rem;">Send Spec To Thomas &rarr;</button>
        </div>

        <div id="creation-claim-form" style="display: none; margin-top: 2rem; border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem; background: var(--bg);">
          <h2 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 0.5rem;">Send your spec to Thomas</h2>
          <p style="color: var(--muted); font-size: 0.85rem; margin-bottom: 1.25rem;">Our full conversation transcript will be included so Thomas can build your site with a premium AI model.</p>
          <div class="form-group"><label>Your Name</label><input type="text" id="claim-name" placeholder="Your full name" /></div>
          <div class="form-group"><label>Your Email</label><input type="email" id="claim-email" placeholder="your@email.com" /></div>
          <div id="claim-extra" style="display: none;">
            <div class="form-group"><label>Notes (optional)</label><textarea id="claim-notes" placeholder="Any additional details..." style="min-height: 80px;"></textarea></div>
          </div>
          <button class="btn-primary" id="claim-submit" onclick="window.submitClaim()" style="width: 100%;">Send Spec</button>
          <div id="claim-success" style="display: none; margin-top: 1rem; padding: 1rem; background: #f0faf4; border: 1px solid #c3e8d0; border-radius: 6px; color: #3b8a62; text-align: center;">✓ Spec sent! Thomas will reach out.</div>
        </div>
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
            <p>I am connected directly to Thomas's live resume and Minescout Studio infrastructure. What would you like to know?</p>
          </div>
        </div>

        <div class="chat-input-row">
          <input type="text" class="chat-input" id="chat-input" placeholder="Loading Thomas's data..." autocomplete="off" disabled />
          <button class="chat-send" id="chat-send" onclick="window.sendMessage()" disabled>Send</button>
        </div>
      </div>
    </div>
  `,
  '/studio/pricing': `
    <div class="main--page">
      <div class="page-content">
        <p class="page-label">Minescout Studio</p>
        <h1 class="page-title">Pricing</h1>

        <div class="anchor-bar" style="opacity:0;animation:fadeUp 0.5s ease 0.15s forwards;">
          <div class="anchor-bar-icon">💡</div>
          <div class="anchor-bar-text">
            This isn't the cheapest option—but it's one of the best values. Minescout competes on <strong>speed, quality, and personal service</strong>, delivering agency-quality results without agency complexity.
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
                <button type="button" class="plan-quiz-opt" data-remodel="2">I have an old site and want a Clean Slate Rebuild</button>
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
  '/studio/review': `
    <div class="main--page">
      <div class="page-content">
        <p class="page-label">Client Feedback</p>
        <h1 class="page-title">Project Review</h1>
        
        <p style="color: var(--muted); margin-bottom: 2.5rem; max-width: 650px; line-height: 1.6; font-size: 1.05rem;">
          Thank you for trusting Minescout Studio with your digital infrastructure. Your honest feedback helps me improve the platform and shows future clients what to expect when working together.
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
views['/studio/info'] = views['/studio/intake'];
views['/legal'] = views['/studio/legal'];
views['/studio/clients/portal'] = views['/portal'];

// ---------------------------------------------------------------------------
// Blog post renderer & individual post routes
// ---------------------------------------------------------------------------

/**
 * Renders a full blog post page.
 * Individual post views are only registered if their release date has passed —
 * navigating directly to an unreleased URL will fall through to your 404 handler.
 */
const renderBlogPost = (date, category, title, q, a, htmlContent) => `
<div class="main--page">
  <div class="page-content" style="max-width: 740px;">
    <a href="/blog" class="btn-ghost" style="margin-bottom: 2.5rem; display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; padding: 0.4rem 0.8rem; border-color: var(--border); color: var(--fg);">&larr; Back to Blog</a>
    <p class="page-label">${category} &bull; ${date}</p>
    <h1 class="page-title" style="margin-bottom: 2rem;">${title}</h1>
    
    <div style="background: var(--light); padding: 1.5rem; border-left: 3px solid var(--accent); border-radius: 6px; margin-bottom: 3rem;">
      <div style="font-weight: 600; color: var(--fg); font-size: 0.95rem; margin-bottom: 0.5rem;">Q: ${q}</div>
      <div style="color: var(--muted); font-size: 0.9rem; line-height: 1.6;">A: ${a}</div>
    </div>

    <div class="blog-content" style="line-height: 1.7; font-size: 1.05rem; color: var(--fg);">
      ${htmlContent}
    </div>
  </div>
</div>`;

/**
 * Helper: only register a post view if its release date has passed.
 * Keeps direct-URL access to unreleased posts from working.
 */
function registerPost(route, date, ...args) {
  if (isReleased(date)) {
    views[route] = renderBlogPost(date, ...args);
  }
}

// 1. Minescout Genesis — Mar 9, 2026

// 2. Launching This Site — Feb 21, 2026

registerPost('/blog/edge-routing.html', "Aug 2, 2026", "AI Architecture",
  "Edge Routing Architecture: Blacklists, Whitelists, and AI Worker Compatibility",
  "What are the main architectural considerations for domain security and worker compatibility when routing traffic through edge networks?",
  "Building multi-tenant routing at the edge requires absolute control over domain validation. Cloudflare Workers and KV storage can implement strict domain whitelists and IP blacklists before any AI execution begins. Compatibility between main router workers and specialized sub-workers must be handled cleanly to avoid latency penalties.",
  `
  <p style="margin-bottom: 1.25rem;">When building a multi-tenant platform on edge infrastructure, the first priority is ensuring the edge router validates every incoming request before any AI processing begins. This means confirming where each request comes from, whether it is authorized, and routing it to the correct worker without adding latency.</p>
  <p style="margin-bottom: 1.25rem;">Cloudflare Workers and KV storage run code at edge locations worldwide, making them ideal for multi-tenant routing. Two main problems must be solved: authorizing requests, and ensuring smooth communication between different workers in the pipeline.</p>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">1. Security at the Edge: Blacklists and Whitelists</h3>
  <p style="margin-bottom: 1.25rem;">Before an AI worker parses a user prompt, the edge worker inspects the request origin. To protect client endpoints from unauthorized domain embeds or malicious traffic, a two-tier lookup in Cloudflare KV is effective:</p>
  <ul style="margin-bottom: 1.5rem; padding-left: 1.5rem; color: var(--muted);">
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Whitelisting:</strong> Ensuring incoming requests originate only from verified client domains.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Blacklisting:</strong> Instantly dropping bad actors or known spam IPs at the edge layer before triggering downstream KV reads or AI inferences.</li>
  </ul>
  <p style="margin-bottom: 1.25rem;">KV reads complete in a few milliseconds. Any request from an unauthorized domain is blocked at the edge before consuming downstream resources.</p>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">2. AI Worker Compatibility and Pipeline Orchestration</h3>
  <p style="margin-bottom: 1.25rem;">A clean pipeline separates concerns: a lightweight router worker handles incoming HTTP traffic and domain validation, while a secondary AI worker executes model calls and retrieves client-specific system prompts.</p>
  <p style="margin-bottom: 1.25rem;">Smooth communication between these workers requires structured JSON payloads and Cloudflare's Service Bindings, which avoid unnecessary HTTP roundtrips between internal workers. This keeps the entire lifecycle - from request ingress to response stream - well under sub-second latency targets.</p>
  <p style="margin-bottom: 1.25rem;">Putting security and compatibility checks directly into the routing layer keeps client data safe and separated while maintaining a lightweight serverless footprint.</p>
  `
);

registerPost('/blog/state-management.html', "Aug 9, 2026", "Building",
  "State Management: Keeping Complex Web Apps Fast Without React",
  "How do you handle complex UI state without a heavy framework like React?",
  "Native JavaScript features like Proxies and custom event listeners can create reactive data stores. This keeps the bundle size at zero while providing the same reactive UI benefits as a framework.",
  `
  <p style="margin-bottom: 1.25rem;">When building interactive applications, managing data that changes over time (state) is often the hardest part. Many developers reach for React or Vue to solve this, but importing a framework solely for managing UI toggles and form inputs is often unnecessary overhead.</p>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">Native Reactivity with JavaScript Proxies</h3>
  <p style="margin-bottom: 1.25rem;">Instead of a Virtual DOM, JavaScript <code>Proxy</code> objects can intercept operations on an object — such as reading or updating a property. By wrapping application state in a Proxy, UI updates can be triggered automatically whenever a specific variable changes. If a user adds an item to their cart, the Proxy detects the change to the state object and fires an event to update the cart counter in the navigation bar.</p>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">Event-Driven Architecture</h3>
  <p style="margin-bottom: 1.25rem;">To keep different parts of the UI decoupled, custom event listeners work well. When the state updates, it dispatches a <code>CustomEvent</code> to the browser's <code>window</code> object. Any component that cares about that data listens for that specific event and updates its own HTML.</p>
  <p style="margin-bottom: 1.25rem;">This approach provides all the reactivity of a modern framework with zero external dependencies to download, parse, or maintain.</p>
  `
);


registerPost('/blog/zero-dollar-stack.html', "Aug 23, 2026", "Infrastructure",
  "The $0.00 Stack: Launching SaaS on Serverless Free Tiers & PAYU",
  "How can developers launch serverless applications with zero fixed monthly costs?",
  "Serverless free tiers (Cloudflare Workers, Firebase) and Pay-As-You-Use (PAYU) models allow projects to launch with zero financial risk and scale affordably as demand grows. Keeping fixed monthly costs at $0.00 is achievable using modern cloud providers.",
  `
  <p style="margin-bottom: 1.25rem;">One of the biggest misconceptions in software development is that monthly subscription budgets for servers, databases, and deployment pipelines are required just to launch a project.</p>
  <p style="margin-bottom: 1.25rem;">Modern cloud providers offer generous free usage tiers for developers building micro-services and serverless architectures. By selecting tools that operate on serverless execution models, infrastructure costs only accrue when code actually runs.</p>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">How the $0.00 Stack Works</h3>
  <p style="margin-bottom: 1.25rem;">A zero-cost infrastructure stack can include:</p>
  <ul style="margin-bottom: 1.5rem; padding-left: 1.5rem; color: var(--muted);">
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Edge Routing & Compute:</strong> Cloudflare Workers (Free tier handles up to 100,000 requests per day at zero cost).</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Global Key-Value Storage:</strong> Cloudflare KV (Free tier offers 100,000 read operations daily).</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Database & Authentication:</strong> Google Firebase / Firestore (Free tier covers initial data storage and auth instances).</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Version Control & CI/CD:</strong> GitHub Actions and GitHub Pages for repository tracking and automated deployments.</li>
  </ul>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">Why Pay-As-You-Use (PAYU) is the Right Scalability Model</h3>
  <p style="margin-bottom: 1.25rem;">When a platform grows beyond free tier limits, the transition away from free tiers should be proportional. Under a PAYU model, billing scales proportionally with actual usage rather than requiring jumps to expensive dedicated tiers.</p>
  <p style="margin-bottom: 1.25rem;">This architecture has two advantages:</p>
  <ol style="margin-bottom: 1.5rem; padding-left: 1.5rem; color: var(--muted);">
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Zero Financial Risk:</strong> Experimentation, prototyping, and production launches can happen without taking on monthly recurring costs.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Built-In Scaling Efficiency:</strong> Serverless functions scale down to zero when idle, eliminating payment for unused capacity.</li>
  </ol>
  `
);

registerPost('/blog/sub-second-latency.html', "Aug 30, 2026", "Building",
  "Sub-Second Latency: Why Custom SPAs Beat Heavy CMS Platforms",
  "Why do clean-slate Single Page Applications outperform traditional CMS platforms like WordPress?",
  "Traditional platforms bundle excessive plugins, heavy database queries, and redundant CSS/JS scripts that slow down render times. Clean-slate SPAs load only essential markup and assets, fetching dynamic content asynchronously to deliver sub-second global edge performance.",
  `
  <p style="margin-bottom: 1.25rem;">A typical small-business WordPress site often loads dozens of third-party CSS files, JavaScript bundles, tracking scripts, and unoptimized image payloads simultaneously. The result is a sluggish initial page render that frustrates users on mobile connections.</p>
  <p style="margin-bottom: 1.25rem;">Lightweight Single Page Applications (SPAs) consistently outperform heavy legacy platforms for several concrete reasons.</p>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">1. Eliminating Database Bottlenecks on Initial Render</h3>
  <p style="margin-bottom: 1.25rem;">When a browser requests a page from a legacy CMS, the server must query a database, assemble HTML templates via PHP, process active plugins, and return the combined output. This adds hundreds of milliseconds of Server Response Time.</p>
  <p style="margin-bottom: 1.25rem;">In a custom SPA architecture:</p>
  <ul style="margin-bottom: 1.5rem; padding-left: 1.5rem; color: var(--muted);">
    <li style="margin-bottom: 0.5rem;">Static markup, CSS, and core logic are served directly from global Edge CDNs.</li>
    <li style="margin-bottom: 0.5rem;">The page renders almost instantly.</li>
    <li style="margin-bottom: 0.5rem;">Data fetches happen asynchronously via lightweight API calls only when needed.</li>
  </ul>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">2. Zero Unnecessary JavaScript Dependencies</h3>
  <p style="margin-bottom: 1.25rem;">Many visual site builders inject megabytes of JavaScript libraries to render basic layout grids or drop-down menus. Modular vanilla JavaScript (ES6+) with targeted CSS keeps bundle sizes minimal.</p>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">3. Measurable Performance Gains</h3>
  <p style="margin-bottom: 1.25rem;">Eliminating CMS bloat achieves measurable improvements:</p>
  <ul style="margin-bottom: 1.5rem; padding-left: 1.5rem; color: var(--muted);">
    <li style="margin-bottom: 0.5rem;">Sub-second first contentful paint (FCP).</li>
    <li style="margin-bottom: 0.5rem;">Perfect 100% scores on Google Lighthouse performance audits.</li>
    <li style="margin-bottom: 0.5rem;">Smooth transitions between views without white-screen flicker between pages.</li>
  </ul>
  <p style="margin-bottom: 1.25rem;">Sub-second load times directly improve user retention and conversion rates.</p>
  `
);


registerPost('/blog/unstructured-client-data.html', "Sep 13, 2026", "AI Architecture",
  "AI Architecture: Training AI Assistants on Unstructured Business Data",
  "How can unstructured business information be turned into reliable context for customer-facing AI agents?",
  "Small businesses rarely have neat documentation. Effective intake pipelines take raw client notes, hours, and policies, convert them into structured JSON schemas, and feed them to LLMs with strict system instructions to guarantee accurate answers.",
  `
  <p style="margin-bottom: 1.25rem;">Business owners rarely hand over clean API documentation or structured markdown files. Their business knowledge lives in informal email threads, napkin notes, or inconsistent website footers.</p>
  <p style="margin-bottom: 1.25rem;">To make an AI assistant reliable enough to answer real customer questions around the clock, the gap between unstructured human knowledge and structured LLM context must be bridged.</p>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">1. Structured Intake Workflow</h3>
  <p style="margin-bottom: 1.25rem;">A structured intake process collects specific operational modules:</p>
  <ul style="margin-bottom: 1.5rem; padding-left: 1.5rem; color: var(--muted);">
    <li style="margin-bottom: 0.5rem;">Primary services and exact pricing minimums.</li>
    <li style="margin-bottom: 0.5rem;">Operating hours, holiday schedules, and physical location logistics.</li>
    <li style="margin-bottom: 0.5rem;">The most common questions the team answers daily over phone and email.</li>
  </ul>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">2. Cleaning and Structuring Data into JSON Schemas</h3>
  <p style="margin-bottom: 1.25rem;">Raw text inputs are transformed into deterministic JSON knowledge bases. By structuring data into clean key-value pairs (services, pricing_tiers, return_policy), the language model can reference facts deterministically during inference.</p>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">3. System Prompt Formatting</h3>
  <p style="margin-bottom: 1.25rem;">Rather than dumping raw text into the model's system prompt, context is formatted using clear boundary delimiters and explicit guardrails:</p>
  <pre style="background: #1e1e1e; color: #d4d4d4; padding: 1.25rem; border-radius: 6px; overflow-x: auto; margin: 1.5rem 0; font-size: 0.9rem; font-family: monospace;"><code>{
  "business_name": "Artisanal Ceramics Studio",
  "hours": "Tue-Sat 10am-6pm",
  "policies": {
    "custom_orders": "Requires 50% deposit. Lead time 3-4 weeks."
  }
}</code></pre>
  <p style="margin-bottom: 1.25rem;">The system prompt instructs the AI agent:</p>
  <blockquote style="border-left: 3px solid var(--accent); padding-left: 1rem; color: var(--muted); font-style: italic; margin: 1.5rem 0; background: var(--light); padding: 1.25rem; border-radius: 4px;">
    "You are an AI assistant for [Business Name]. Only answer questions using the factual data provided in the Knowledge Context block above. If a customer asks a question outside of this data, politely offer to collect their contact details for a team callback."
  </blockquote>
  <p style="margin-bottom: 1.25rem;">Combining structured data inputs with strict boundary rules produces an AI assistant that answers accurately without hallucinating information outside its knowledge base.</p>
  `
);

registerPost('/blog/database-schema-design.html', "Sep 20, 2026", "Building",
  "Schema Design: Structuring Data for Multi-Tenant SaaS",
  "What is the most important factor when designing a database for a multi-tenant platform?",
  "Data isolation and read efficiency. Structuring NoSQL documents so that edge workers can fetch everything they need for a tenant in a single read operation is crucial for performance and security.",
  `
  <p style="margin-bottom: 1.25rem;">A multi-tenant platform stores data for many different clients in the same database. Poor data structuring risks leaking one client's data to another, or forcing edge servers to make dozens of slow queries just to load a single page.</p>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">The Power of NoSQL Document Modeling</h3>
  <p style="margin-bottom: 1.25rem;">In Firebase Firestore or Cloudflare KV, data is stored in JSON-like documents rather than relational tables. The key to high performance in NoSQL is organizing data to match how it will be displayed on screen.</p>
  <p style="margin-bottom: 1.25rem;">Instead of querying separate "Users", "Products", and "Orders" collections, data can be structured hierarchically by tenant ID. Each client has a master document containing their specific configuration, branding, and nested sub-collections for their operational data.</p>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">Security and Isolation</h3>
  <p style="margin-bottom: 1.25rem;">Security rules are easier to enforce when data is properly scoped. Placing all of Tenant A's data under <code>/tenants/{tenant_a_id}/...</code> enables a single Firestore security rule that ensures users can only read or write data where their authentication token matches the top-level tenant ID.</p>
  <p style="margin-bottom: 1.25rem;">Flat, tenant-isolated schemas keep database reads fast and secure as the platform scales.</p>
  `
);

registerPost('/blog/vanilla-js-edge.html', "Sep 27, 2026", "Building",
  "Vanilla JS & Edge Workers: Avoiding Heavy Framework Overkill",
  "When does using Vanilla JavaScript and Edge API calls make more sense than complex frameworks?",
  "For portfolio sites and local business web applications, importing heavy framework bundles adds unnecessary dependencies and build complexity. Vanilla JavaScript (ES6+), custom modern CSS, and edge execution provide all the power needed with zero framework overhead.",
  `
  <p style="margin-bottom: 1.25rem;">Modern frontend development has a strong tendency toward massive framework ecosystems. Developers routinely install hundreds of megabytes of node_modules just to build a four-page website with a contact form.</p>
  <p style="margin-bottom: 1.25rem;">While frameworks like React and Next.js are excellent for complex enterprise dashboards, using them for standard business sites introduces unnecessary build complexity and performance penalties.</p>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">1. Zero Build Chain Friction</h3>
  <ul style="margin-bottom: 1.5rem; padding-left: 1.5rem; color: var(--muted);">
    <li style="margin-bottom: 0.5rem;">Complex bundlers or transpilation steps are not required to preview a style change.</li>
    <li style="margin-bottom: 0.5rem;">Code deploys instantly to edge CDNs without waiting for heavy build pipelines.</li>
    <li style="margin-bottom: 0.5rem;">Security vulnerabilities from outdated npm packages drop to near zero.</li>
  </ul>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">2. Native Browser Features Are Incredibly Powerful</h3>
  <ul style="margin-bottom: 1.5rem; padding-left: 1.5rem; color: var(--muted);">
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">DOM Manipulation:</strong> querySelector and native ES6 template literals make building reactive UI components straightforward.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Asynchronous Fetching:</strong> The native fetch() API combined with async/await communicates directly with serverless endpoints.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">State Management:</strong> Simple state objects with native event listeners handle application state without needing global stores.</li>
  </ul>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">3. Long-Term Maintainability</h3>
  <p style="margin-bottom: 1.25rem;">A site built with clean vanilla code will render perfectly in web browsers years from now with no breaking framework upgrades or deprecated API methods to worry about.</p>
  <p style="margin-bottom: 1.25rem;">The simplest setup that meets requirements and performs well is often the right choice.</p>
  `
);


registerPost('/blog/ai-guardrails.html', "Oct 11, 2026", "AI Architecture",
  "AI Guardrails 101: Preventing Hallucinations in Customer-Facing AI",
  "How can you ensure an AI assistant on a business site won't make up false discounts or hallucinate incorrect information?",
  "Preventing AI hallucinations requires strict context boundaries, explicit prompt engineering rules, negative constraints, and fallback mechanisms that route unknown questions to human intake rather than guessing.",
  `
  <p style="margin-bottom: 1.25rem;">The nightmare scenario for any business implementing an AI customer support chat is having the model hallucinate — promising a customer a 90% discount or inventing services the company does not offer.</p>
  <p style="margin-bottom: 1.25rem;">When building customer-facing AI agents, preventing hallucinations is the single highest priority. Structured prompt guardrails ensure factual accuracy.</p>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">1. Strict Context Boundaries (The "Open Book Exam" Model)</h3>
  <p style="margin-bottom: 1.25rem;">The AI agent operates like an open-book exam:</p>
  <ul style="margin-bottom: 1.5rem; padding-left: 1.5rem; color: var(--muted);">
    <li style="margin-bottom: 0.5rem;">The system prompt contains only the exact, verified business facts provided.</li>
    <li style="margin-bottom: 0.5rem;">The model is instructed never to assume facts not explicitly written in that context block.</li>
  </ul>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">2. Explicit Negative Constraints</h3>
  <blockquote style="border-left: 3px solid var(--accent); padding-left: 1rem; color: var(--muted); font-style: italic; margin: 1.5rem 0; background: var(--light); padding: 1.25rem; border-radius: 4px;">
    <strong>Forbidden Actions:</strong><br><br>
    &bull; DO NOT invent pricing, discounts, or promotional codes.<br>
    &bull; DO NOT answer questions regarding legal, medical, or financial matters.<br>
    &bull; DO NOT discuss competitors or unrelated general topics.
  </blockquote>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">3. Graceful Fallbacks</h3>
  <p style="margin-bottom: 1.25rem;">If a visitor asks a question outside the provided knowledge base, the worst thing an AI can do is guess.</p>
  <blockquote style="border-left: 3px solid var(--accent); padding-left: 1rem; color: var(--muted); font-style: italic; margin: 1.5rem 0; background: var(--light); padding: 1.25rem; border-radius: 4px;">
    "I want to make sure you get the exact right answer on that! That specific detail isn't in my immediate notes - would you like me to take your email so our owner can follow up with you directly?"
  </blockquote>
  <p style="margin-bottom: 1.25rem;">A well-designed fallback converts an unanswerable question into a lead capture opportunity while protecting the business's reputation.</p>
  `
);

registerPost('/blog/css-architecture.html', "Oct 18, 2026", "Building",
  "CSS Architecture: Building Scalable Design Systems",
  "What is the biggest challenge when styling large web applications from scratch?",
  "Avoiding CSS bloat and specificity wars. CSS custom properties (variables) maintain a single source of truth for colors and spacing, keeping stylesheets lean and predictable.",
  `
  <p style="margin-bottom: 1.25rem;">When writing CSS from scratch without a utility framework like Tailwind, stylesheets can easily spiral out of control. Without strict architecture, duplicated colors and unpredictable layout bugs are common.</p>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">The Power of CSS Variables</h3>
  <p style="margin-bottom: 1.25rem;">The foundation of any scalable design system is CSS custom properties (variables). Defining spacing scales, typography rules, and color palettes in the <code>:root</code> pseudo-class provides a single source of truth.</p>
  <p style="margin-bottom: 1.25rem;">Using variables like <code>var(--primary-color)</code> or <code>var(--spacing-md)</code> ensures every button, card, and section matches the design system. Rebranding from blue to green requires changing exactly one line of code.</p>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">Component-Scoped Styling</h3>
  <p style="margin-bottom: 1.25rem;">To avoid specificity wars, CSS should be modular. Global styles are strictly limited to typography and resets. Everything else is scoped to specific component classes like <code>.blog-card</code> or <code>.hero-layout</code>.</p>
  <p style="margin-bottom: 1.25rem;">Treating CSS as an engineered system rather than a visual afterthought keeps the codebase clean, maintainable, and fast to parse.</p>
  `
);


registerPost('/blog/performance-benchmarking.html', "Nov 1, 2026", "Building",
  "Performance Benchmarking: Achieving Sub-Second Global Edge Latency",
  "How can web performance be measured and optimized to guarantee sub-second global load times?",
  "Achieving sub-second latency requires optimizing the entire delivery pipeline: serving HTML directly from edge locations, inlining critical CSS, minimizing render-blocking JavaScript, and leveraging HTTP edge caching for media assets.",
  `
  <p style="margin-bottom: 1.25rem;">Every hundred milliseconds of page load delay increases the likelihood that users abandon the page. Sub-second latency is the benchmark for top-tier digital experiences.</p>
  <p style="margin-bottom: 1.25rem;">Achieving zero render-blocking delay requires systematically optimizing every layer of the network request stack.</p>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">1. Edge Delivery via CDN Workers</h3>
  <p style="margin-bottom: 1.25rem;">Traditional hosting routes all user traffic to a single physical server location. A user requesting a site from Seattle or Tokyo faces high latency due to physical speed-of-light constraints across fiber optic cables.</p>
  <p style="margin-bottom: 1.25rem;">Deploying assets through a CDN edge network ensures:</p>
  <ul style="margin-bottom: 1.5rem; padding-left: 1.5rem; color: var(--muted);">
    <li style="margin-bottom: 0.5rem;">HTML, styles, and core assets are cached across hundreds of edge data centers globally.</li>
    <li style="margin-bottom: 0.5rem;">Seattle visitors connect to a local Seattle edge node; London visitors connect to a London edge node.</li>
    <li style="margin-bottom: 0.5rem;">Initial connection handshakes complete in under 20 milliseconds.</li>
  </ul>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">2. Eliminating Render-Blocking Resources</h3>
  <ul style="margin-bottom: 1.5rem; padding-left: 1.5rem; color: var(--muted);">
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Inline Critical CSS:</strong> Essential structural styles are included directly in the document header so the browser renders layout frames without waiting for external stylesheet downloads.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Asynchronous Script Loading:</strong> JavaScript logic executes asynchronously, allowing visual text and structural containers to paint on screen immediately.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Modern Asset Formats:</strong> Images are converted to lightweight WebP formats with explicit width/height dimensions to prevent layout shifts (CLS).</li>
  </ul>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">3. Measurable Benchmarks</h3>
  <ul style="margin-bottom: 1.5rem; padding-left: 1.5rem; color: var(--muted);">
    <li style="margin-bottom: 0.5rem;">First Contentful Paint (FCP) consistently under 400ms.</li>
    <li style="margin-bottom: 0.5rem;">Time to Interactive (TTI) measures under 700ms on standard mobile connections.</li>
  </ul>
  <p style="margin-bottom: 1.25rem;">Optimizing each layer of the delivery pipeline produces fast load times as a natural outcome of good architecture.</p>
  `
);

// Restored from original
registerPost('/blog/minescout-genesis.html', "Mar 9, 2026", "Engineering",
  "Minescout Genesis: The 17-Day Multi-Tenant Pivot",
  "What drove the decision to pivot Minescout from static sites to a serverless SaaS engine?",
  "Managing separate static codebases for every client was unscalable. A central, multi-tenant architecture was needed where a single codebase could dynamically serve different clients based on edge routing. The core of Minescout Studio was architected and launched in under three weeks.",
  `
  <p style="margin-bottom: 1.25rem;">Minescout didn't start as a multi-tenant SaaS platform. It started as a handful of static sites that were manually deployed for local projects. But as soon as a feature needed updating across multiple sites, the static approach was immediately unscalable.</p>
  <p style="margin-bottom: 1.25rem;">A central engine was needed. The goal: pivot the entire architecture into a multi-tenant platform in under three weeks. Here is how the 17-day sprint went down.</p>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">The Problem with Static</h3>
  <p style="margin-bottom: 1.25rem;">Managing separate codebases for every client is a nightmare. One codebase was needed — a single "brain" — that could serve different content depending on which domain requested it.</p>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">The Serverless Solution</h3>
  <p style="margin-bottom: 1.25rem;">Cloudflare Workers and KV storage solved this. By mapping incoming domains to specific client IDs in a KV namespace, a single Edge Worker can dynamically route requests, pull the correct client data, and inject it into the application shell on the fly.</p>
  <p style="margin-bottom: 1.25rem;">This means a bug fix deployed once updates every client site instantly.</p>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">17 Days Later</h3>
  <p style="margin-bottom: 1.25rem;">After two weeks of intense development, the multi-tenant core was live. The first two nodes launched on the new architecture and ran flawlessly. The 17-day sprint demonstrates that sometimes tearing down what you have built is necessary to build something that can actually scale.</p>
  `
);

registerPost('/blog/launching-this-site.html', "Feb 21, 2026", "Building",
  "Launching This Site",
  "Why build a custom personal site from scratch instead of using a standard template or just a GitHub profile?",
  "A platform was needed that felt clean, fast, and entirely custom. Building it from scratch with vanilla JS and edge hosting acts as a live demonstration of a zero-bloat infrastructure philosophy.",
  `
  <p style="margin-bottom: 1.25rem;">For a long time, the portfolio was just a collection of repositories on GitHub. While that works for other developers, it does not explain why projects are built to non-technical clients.</p>
  <p style="margin-bottom: 1.25rem;">A personal corner of the internet was needed. Something clean, fast, and entirely custom.</p>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">No Templates, No Bloat</h3>
  <p style="margin-bottom: 1.25rem;">This site is built using vanilla JavaScript, HTML, and custom CSS. There is no heavy framework, no WordPress backend, and no bulky templates. It is hosted on the edge, meaning it loads quickly no matter where the visitor is located.</p>
  <p style="margin-bottom: 1.25rem;">This site demonstrates how clean web architecture should be built — lightweight, fast, and maintainable.</p>
  `
);

registerPost('/blog/chop-lab-spa.html', "Aug 16, 2026", "Building",
  "Building for the Client: Overhauling The Chop Lab into a Custom SPA",
  "What was the primary requirement from the client when rebuilding The Chop Lab website?",
  "The client wanted an easier, streamlined way to update product listings, edit site text, and add new product lines without needing to write code or deal with a bloated dashboard. A custom Single Page Application (SPA) architecture solved this.",
  `
  <p style="margin-bottom: 1.25rem;">When small business owners talk about their websites, their biggest complaint is almost never "I want more plugins." It is almost always: <strong>"I just want a simple way to update my text and photos without breaking the site."</strong></p>
  <p style="margin-bottom: 1.25rem;">That exact feedback drove the complete overhaul of The Chop Lab (v2) — a high-performance digital storefront for an artisanal ceramics firm.</p>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">Identifying the Friction</h3>
  <p style="margin-bottom: 1.25rem;">The original site was static and required manual HTML edits whenever new ceramics runs were fired or product specs changed. For a fast-moving studio, waiting for manual code edits every time a product released created unnecessary friction.</p>
  <p style="margin-bottom: 1.25rem;">The objective for v2 was clear:</p>
  <ol style="margin-bottom: 1.5rem; padding-left: 1.5rem; color: var(--muted);">
    <li style="margin-bottom: 0.5rem;">Rebuild the frontend into a custom Single Page Application (SPA) for fast page transitions.</li>
    <li style="margin-bottom: 0.5rem;">Structure the backend content model so product entries, images, and descriptions could be updated effortlessly by the client.</li>
    <li style="margin-bottom: 0.5rem;">Ensure the UI reflected the high-craft nature of the artisanal products.</li>
  </ol>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">The Architectural Solution</h3>
  <p style="margin-bottom: 1.25rem;">Instead of installing a heavy e-commerce framework with dozens of third-party plugins, a lightweight SPA was engineered using vanilla JavaScript and structured JSON data sources.</p>
  <ul style="margin-bottom: 1.5rem; padding-left: 1.5rem; color: var(--muted);">
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Data Decoupling:</strong> Products and studio descriptions are stored in structured configuration files. Adding a new item or updating inventory requires only editing a simple form interface without touching UI component code.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Instant Page Transitions:</strong> Navigating between gallery views, product details, and the studio history happens instantly in memory without full-page reloads.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Responsive Layout:</strong> The interface was crafted to load fast on mobile devices, ensuring art buyers can browse collections smoothly anywhere.</li>
  </ul>
  <p style="margin-bottom: 1.25rem;">When building software for real people, it has to be easy for both the visitors and the person running the site. By cutting out all the extra stuff, The Chop Lab ended up with a site that looks custom but is still simple to update.</p>
  `
);

registerPost('/blog/eagle-scout-project.html', "Sep 6, 2026", "Leadership",
  "Project Leadership at 14: Directing an Eagle Scout Project",
  "What was involved in planning and executing an Eagle Scout service project?",
  "Achieving the rank of Eagle Scout required planning, fundraising, and directing a community literacy project. A team of youth and adult volunteers was led over 60+ total hours to build and install a custom Little Free Library at Illahee Park in Sammamish, WA.",
  `
  <p style="margin-bottom: 1.25rem;">Achieving the rank of Eagle Scout in Scouting America Troop 571 is one of the most challenging leadership experiences a youth can undertake. The centerpiece of the process is the Eagle Scout Leadership Project — a requirement where the candidate must plan, develop, and give leadership to others in a service project benefiting the local community.</p>
  <p style="margin-bottom: 1.25rem;">The project focused on improving local literacy access by constructing and installing a durable, custom-built Little Free Library at Illahee Park in Sammamish, WA.</p>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">Phase 1: Planning and Logistics Approval</h3>
  <p style="margin-bottom: 1.25rem;">Long before any wood was cut or post holes were dug, the project required thorough documentation and administrative approvals:</p>
  <ul style="margin-bottom: 1.5rem; padding-left: 1.5rem; color: var(--muted);">
    <li style="margin-bottom: 0.5rem;">Drafting structural blueprints for weather-resistant outdoor construction in the Pacific Northwest.</li>
    <li style="margin-bottom: 0.5rem;">Presenting safety plans, material lists, and budget estimates to city park officials and Scouting leadership.</li>
    <li style="margin-bottom: 0.5rem;">Coordinating material procurement and tool safety protocols.</li>
  </ul>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">Phase 2: Delegating and Directing Work</h3>
  <p style="margin-bottom: 1.25rem;">As the project leader, the Eagle guidelines state clearly that the candidate is not there to do all the physical work themselves — they are there to lead.</p>
  <p style="margin-bottom: 1.25rem;">Managing a team of over 15 volunteers required clear delegation:</p>
  <ul style="margin-bottom: 1.5rem; padding-left: 1.5rem; color: var(--muted);">
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Safety First:</strong> Ensuring all volunteers understood proper tool usage, PPE, and job site safety.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Task Division:</strong> Assigning specific teams to woodworking, sanding, weather-proofing coats, and ground excavation for post mounting.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Time Management:</strong> Keeping work shifts organized so progress stayed on schedule across multiple work sessions.</li>
  </ul>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">Phase 3: Lasting Community Impact</h3>
  <p style="margin-bottom: 1.25rem;">Over 60+ total volunteer hours, the team successfully constructed and anchored the library post in Illahee Park, filling it with donated books for local neighborhood families.</p>
  <p style="margin-bottom: 1.25rem;">Whether leading a construction team or a software project, real leadership is about clear communication, preparation, and keeping everyone focused on the goal.</p>
  `
);

registerPost('/blog/slow-websites-cost-customers.html', "Nov 19, 2026", "Business",
  "Why Slow Websites Cost Local Businesses Customers (And How Static Edge Sites Fix It)",
  "How does page speed translate into lost revenue for a local business, and what actually fixes it?",
  "Slow pages lose visitors before they ever see the offer. Most of the delay is not the internet — it is a database round trip, plugin bloat, and render-blocking scripts. Static HTML served from an edge network removes all three.",
  `
  <p style="margin-bottom: 1.25rem;">A customer searching for a plumber, a bakery, or a ceramics studio is not comparing design portfolios. They are comparing how fast the page answers their question. If the site stalls, they tap back and pick the next result on the map. The business never sees that person in its analytics as anything other than a bounce.</p>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">Where the seconds actually go</h3>
  <p style="margin-bottom: 1.25rem;">When a local business site feels slow, the network is rarely the culprit. Three things usually are:</p>
  <ul style="margin-bottom: 1.5rem; padding-left: 1.5rem; color: var(--muted);">
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Server response time.</strong> A page built on a CMS has to wake a database, assemble templates, and run every active plugin before it can send a single byte of HTML.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Render-blocking assets.</strong> Stylesheets and scripts in the head block the first paint. The visitor stares at white space while fonts, analytics, chat widgets, and a cookie banner each negotiate their turn.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Distance.</strong> A single server in one region means every visitor outside that region pays the speed-of-light penalty on every request.</li>
  </ul>
  <p style="margin-bottom: 1.25rem;">Stack those together and a page that should open instantly takes three or four seconds on a phone in a parking lot. That is the moment a customer leaves.</p>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">What a static edge site changes</h3>
  <p style="margin-bottom: 1.25rem;">A static site flips the order of operations. The HTML is generated once, at build time, and then stored on servers around the world. There is no database to wake up and no template to assemble when a customer arrives.</p>
  <ul style="margin-bottom: 1.5rem; padding-left: 1.5rem; color: var(--muted);">
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">No origin round trip.</strong> The document is already written. The server answers with bytes it holds in memory.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">No plugin tax.</strong> Nothing is injected at request time, so nothing can slow the response down after the fact.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Local distance.</strong> An edge network keeps a copy near the visitor, so a customer in Sammamish is not waiting on a server in Virginia.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Fewer moving parts to break.</strong> Static files cannot hit a database connection limit or fall over when a plugin update ships.</li>
  </ul>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">The part that matters for the business</h3>
  <p style="margin-bottom: 1.25rem;">Speed is not a technical vanity metric. It is the difference between a customer reading the hours and address and a customer calling the next listing. A storefront that opens in under a second keeps the visitor in the funnel long enough for the offer to do its job.</p>
  <p style="margin-bottom: 1.25rem;">The fix is not a plugin that claims to cache pages. It is picking an architecture where speed is the default rather than a maintenance task — static markup, edge hosting, and a small amount of JavaScript that loads after the page is already readable.</p>
  <p style="margin-bottom: 1.25rem;">If your site takes more than a second to show text on a phone, that is a measurable business problem, and it is one you can design away.</p>
  `
);

registerPost('/blog/custom-ecommerce-cost-2026.html', "Nov 12, 2026", "Business",
  "How Much Does a Custom E-Commerce Website Cost in 2026?",
  "What does a custom e-commerce website actually cost in 2026, and what drives that number up or down?",
  "A custom storefront starts at $2,500, or $3,500 with an AI assistant built in. Ongoing hosting and maintenance run $15–$75 a month and are optional. The final quote is driven by how configurable your products are, how checkout is handled, and who owns the catalog after launch — not by page count.",
  `
  <p style="margin-bottom: 1.25rem;">Most pricing pages for e-commerce work answer this question with a range so wide it is useless. So here is the straight version, using the prices I actually charge rather than an industry average.</p>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">The 2026 starting prices</h3>
  <ul style="margin-bottom: 1.5rem; padding-left: 1.5rem; color: var(--muted);">
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Portfolio Website — from $750.</strong> A custom design, responsive layout, contact form, SEO basics, and fast hosting setup. Right for a maker or freelancer with a handful of products and no real checkout.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Professional Website — from $1,500.</strong> Multiple pages, booking and contact integrations, analytics, and performance work. Right for a small catalog that needs a proper product story.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Business Website — from $2,500.</strong> Discovery meeting, fully custom design, advanced SEO, custom forms, and an AI-ready foundation. This is the tier a real storefront starts in.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Business + AI — from $3,500.</strong> Everything above plus a custom AI assistant, a knowledge base, automation, and a dashboard.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Students, nonprofits, first-time founders — $250–$750.</strong> A limited number of discounted projects each semester, depending on scope.</li>
  </ul>
  <p style="margin-bottom: 1.25rem;">Those are <em>starting</em> prices, and they are quoted per project. A store with six fixed items lands near the bottom of a tier. A store with configurable products, quote flows, and inventory integrations sits above it. The pricing page is the source of truth; treat any number here as a floor, not a ceiling.</p>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">Ongoing costs, which are optional</h3>
  <p style="margin-bottom: 1.25rem;">You are free to host and maintain the site yourself. If you would rather not, the support plans are $10 a month for priority care, $15 for edge hosting and SSL, $40 for hosting plus updates and backups, and $75 for hosting, updates, backups, AI maintenance, and priority support. None of them is required to work with me.</p>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">What actually drives the price</h3>
  <p style="margin-bottom: 1.25rem;"><strong style="color: var(--fg);">1. How configurable the products are.</strong> A store that sells six fixed items is a different project from one that sells a tool built to a customer's exact drawing. The second needs a configurator, validation, and a way to hand a real specification to the maker. That logic, not the page count, is where custom work lives.</p>
  <p style="margin-bottom: 1.25rem;"><strong style="color: var(--fg);">2. Checkout and payments.</strong> Building checkout from scratch is almost never worth it in 2026. Stripe or an equivalent handles cards, tax, and receipts for a small percentage. Budget for the integration, not for a payments team.</p>
  <p style="margin-bottom: 1.25rem;"><strong style="color: var(--fg);">3. Content ownership.</strong> Can the owner add a product without a developer? That is a data model decision made early. Getting it right is cheap; retrofitting it is not.</p>
  <p style="margin-bottom: 1.25rem;"><strong style="color: var(--fg);">4. Photography and copy.</strong> Frequently the largest line item, and frequently skipped in quotes. A storefront is only as good as the images in it.</p>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">What should never cost extra</h3>
  <p style="margin-bottom: 1.25rem;">Speed, mobile layout, and basic search visibility are not premium features in 2026. Neither is a contact path for people who are not ready to buy. If a quote lists those as add-ons, the base price is being held artificially low.</p>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">How to get a real number</h3>
  <p style="margin-bottom: 1.25rem;">Write down three things before you ask for a quote: how many products you sell, which of them need configuration, and who will add new products after launch. Those three answers move the estimate more than any other detail, and any honest quote will start by asking for them. You can also check the <a href="/studio/pricing" style="color: var(--accent);">current pricing page</a> for the tiers in full.</p>
  `
);

registerPost('/blog/chop-lab-storefront.html', "Nov 8, 2026", "Building",
  "How I Built a Fast Online Storefront for a Local Ceramics Brand",
  "What goes into building a fast storefront for a small maker, where every product is built to order?",
  "The Chop Lab needed typed product data, measurements stored canonically in millimetres, and a configurator that turns a customer's drawing into a quote. Server-rendered pages keep the first paint instant; the product model keeps the catalog honest.",
  `
  <p style="margin-bottom: 1.25rem;"><a href="https://chop-lab.com" target="_blank" rel="noopener" style="color: var(--accent);">The Chop Lab</a> is a ceramics tooling studio. The catalog is small but nothing in it is a fixed SKU: custom chops cut from a maker's logo, texture rollers with repeating geometry, slab rails in a customer's exact width. A standard product grid with a quantity box would have been the wrong shape for the business.</p>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">Start with the data model, not the design</h3>
  <p style="margin-bottom: 1.25rem;">The first decision was that every product record carries its own shape: a kind, a category, an engineering drawing reference, a base price, an hourly rate, and an estimated hour count. Prices are quoted, so the storefront needs to reason about work rather than display a sticker.</p>
  <pre style="background: #1e1e1e; color: #d4d4d4; padding: 1.25rem; border-radius: 6px; overflow-x: auto; margin: 1.5rem 0; font-size: 0.9rem; font-family: monospace;"><code>{
  "slug": "texture-roller-10",
  "kind": "roller",
  "basePrice": 3,
  "hourlyRate": 12,
  "estimatedHours": 1.5,
  "specs": [
    { "label": "Length", "value": "10 in / 254 mm" }
  ]
}</code></pre>
  <p style="margin-bottom: 1.25rem;">Keeping that in a typed TypeScript file instead of a database meant the catalog is versioned with the site, type-checked at build time, and impossible to ship with a missing field.</p>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">Millimetres in the data, inches on the screen</h3>
  <p style="margin-bottom: 1.25rem;">Ceramics work in both metric and imperial, and a maker will switch depending on the tool. So the configurator keeps every length it collects in millimetres and converts at render time through one hook. Flipping the units toggle re-renders every measurement in the form at once, and a stored 254 mm reads as 10 in the moment you switch.</p>
  <p style="margin-bottom: 1.25rem;">This is the kind of detail that looks like polish and is actually correctness. A configurator that silently keeps one product's input in inches and the next in millimetres hands the maker a specification that cannot be cut.</p>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">A configurator that ends in a quote</h3>
  <p style="margin-bottom: 1.25rem;">The configurator lets a customer pick a product, choose a texture from the library, and send a mark or a dimension. No payment is collected there. The submission becomes a specification the maker can price and cut, which is what the business actually needs — a dead shopping cart is worse than a good intake form.</p>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">Keeping it fast</h3>
  <ul style="margin-bottom: 1.5rem; padding-left: 1.5rem; color: var(--muted);">
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Fixed aspect wrappers</strong> around every product image, with <code>loading="lazy"</code> and <code>decoding="async"</code> below the fold. The layout never shifts as photos arrive.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Eager hero, lazy gallery.</strong> The first product shot loads immediately; the rest wait.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Design tokens</strong> for colour, spacing, and shadow, so the warm clay palette is one file rather than a hundred inline values.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Server rendering.</strong> The first response already contains the product markup, so a customer on a phone in a studio reads the specs before the JavaScript bundle finishes loading.</li>
  </ul>
  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">What I would tell another maker</h3>
  <p style="margin-bottom: 1.25rem;">If your products are made to order, do not force them into a cart. Model what the product actually is — dimensions, options, the work behind it — and let the site end in a conversation. The storefront is fast because the architecture is simple, and it is simple because the data model matched the business instead of fighting it.</p>
  `
);


registerPost('/blog/custom-website-vs-wix-squarespace.html', "Nov 27, 2026", "Business",
  "Custom Website vs. Wix and Squarespace: When Should a Small Business Upgrade?",
  "Is a custom-coded website actually worth it next to Wix or Squarespace, and when should a small business make the switch?",
  "Sometimes not. But the platforms are cheap to start and expensive to own: 2026 list prices run about $17 to $159 a month for Wix and $25 to $139 a month for Squarespace, before card processing and store fees. Over three years that is $612 to $5,724 — against $750 to $2,500 once for a custom site you own, plus optional hosting at $15 a month.",
  `
  <p style="margin-bottom: 1.25rem;">Wix and Squarespace are good products. For the right project I would recommend either one without hesitating. But "cheap to start" and "cheap to own" are different questions, and a small business lives with the second one for years.</p>
  <p style="margin-bottom: 1.25rem;">So here is the comparison with the numbers the plans pages actually show in late 2026, next to the prices I charge. No industry-survey averages and no "starting at" fine print.</p>

  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">What the platforms cost in 2026</h3>
  <p style="margin-bottom: 1.25rem;">Both companies quote a yearly subscription, paid up front, and both run aggressive first-term discounts. That distinction matters, because the discounted year is not the price you renew at.</p>
  <ul style="margin-bottom: 1.5rem; padding-left: 1.5rem; color: var(--muted);">
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Wix</strong> — the plans page lists Light, Core, Business, and Business Elite, running from about <strong style="color: var(--fg);">$17</strong> to about <strong style="color: var(--fg);">$159</strong> a month on a yearly subscription. Wix states on that same page that prices and currency vary by location, that the displayed price is the yearly plan paid in full, and that taxes are added at checkout.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Squarespace</strong> — Basic <strong style="color: var(--fg);">$25</strong>, Core <strong style="color: var(--fg);">$39</strong>, Plus <strong style="color: var(--fg);">$65</strong>, and Advanced <strong style="color: var(--fg);">$139</strong> a month on annual billing. While I was checking, the pricing page carried a 30% first-term discount, so those same four plans read <strong style="color: var(--fg);">$19</strong>, <strong style="color: var(--fg);">$29</strong>, <strong style="color: var(--fg);">$49</strong>, and <strong style="color: var(--fg);">$99</strong> for the first year.</li>
  </ul>
  <p style="margin-bottom: 1.25rem;">The subscription is only part of the bill. Squarespace charges card processing at 2.9% plus 30&cent; on Basic and Core, 2.7% plus 30&cent; on Plus, and 2.5% plus 30&cent; on Advanced, and Basic also carries a 2% fee on online store transactions. Wix runs its own payment processing on top of the plan. A business taking a few thousand dollars a month through the site can pay more in processing than in subscription — and none of that money buys the site itself.</p>

  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">Three years, side by side</h3>
  <p style="margin-bottom: 1.25rem;">Three years is a fair horizon. It is long enough that a discount year cannot hide, and short enough that you are still running the same business at the end. Multiply the annual plan out and the cheap tiers stop being the story:</p>
  <ul style="margin-bottom: 1.5rem; padding-left: 1.5rem; color: var(--muted);">
    <li style="margin-bottom: 0.5rem;">Wix Light at about $17 a month — <strong style="color: var(--fg);">$612</strong> over three years.</li>
    <li style="margin-bottom: 0.5rem;">Wix Business Elite at about $159 a month — <strong style="color: var(--fg);">$5,724</strong>.</li>
    <li style="margin-bottom: 0.5rem;">Squarespace Basic at the $25 list price — <strong style="color: var(--fg);">$900</strong>, or $684 if the first-year discount somehow held for all three years.</li>
    <li style="margin-bottom: 0.5rem;">Squarespace Advanced at the $139 list price — <strong style="color: var(--fg);">$5,004</strong>, or $3,564 at the promotional rate.</li>
  </ul>
  <p style="margin-bottom: 1.25rem;">On the custom side, Portfolio starts at <strong style="color: var(--fg);">$750</strong>, Professional at <strong style="color: var(--fg);">$1,500</strong>, and Business at <strong style="color: var(--fg);">$2,500</strong>, paid once. Hosting is optional at <strong style="color: var(--fg);">$15</strong> a month, and the care plans run <strong style="color: var(--fg);">$10</strong> to <strong style="color: var(--fg);">$75</strong> a month for priority support, updates, backups, and AI maintenance. At the hosting rate, three years of a Portfolio site all-in is <strong style="color: var(--fg);">$1,290</strong>, Professional is <strong style="color: var(--fg);">$2,040</strong>, and Business is <strong style="color: var(--fg);">$3,040</strong> &mdash; with the code in your hands at the end.</p>
  <p style="margin-bottom: 1.25rem;">Read that again: three years of a custom Business site with hosting costs less than three years of Squarespace Advanced at list price, and a little over half of Wix Business Elite. The cheapest platform tiers are genuinely cheaper than custom work. The tiers a real business grows into are not.</p>

  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">Template bloat is a bill you pay in seconds</h3>
  <p style="margin-bottom: 1.25rem;">A page builder has to ship styles and scripts for every widget it might render, because the page is assembled in the browser from a shared library. Then every app you add — booking, popups, reviews, chat, analytics — loads its own scripts on top. None of that is wrong. It is simply weight the visitor pays before they can read your hours.</p>
  <p style="margin-bottom: 1.25rem;">You can measure it yourself. Open the site on a phone with a throttled connection and watch how long the first text takes to appear. If the address and phone number take more than a second, the template is charging rent in the one currency a local business cannot refund.</p>
  <p style="margin-bottom: 1.25rem;">A custom static site inverts that. The HTML is written once, at build time, and served from an edge network. There is no database to wake up, no template to assemble per request, and no widget library to download. The page is the file. That is how the same content paints in well under a second on a phone in a parking lot.</p>

  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">Lock-in is the real cost</h3>
  <p style="margin-bottom: 1.25rem;">Subscription fees stop when you cancel. Lock-in is what keeps charging after that. On a hosted builder your content lives in the platform's data model, not in files you can move. Export gives you the text and the images; it does not give you the layout, the templates, or the interactions you built. Change the theme and you re-enter the content. Leave the platform and you rebuild from scratch, after paying for years.</p>
  <p style="margin-bottom: 1.25rem;">There is a quieter version of the same thing: the design is tied to the subscription. Stop paying and the site goes dark, whatever you have invested in it. For a business whose website is its storefront, that is a permanent lease on a building you furnished.</p>

  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">What a custom site gives you instead</h3>
  <ul style="margin-bottom: 1.5rem; padding-left: 1.5rem; color: var(--muted);">
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The files.</strong> Plain HTML, CSS, and a small amount of JavaScript in a repository you own. Any developer can pick it up, and so can you.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">A choice of host.</strong> Static output runs on Netlify, Cloudflare, GitHub Pages, or a server you rent. Moving is a DNS change, not a migration project.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Nothing to patch on a schedule.</strong> No plugin that needs updating, and no theme that breaks on the platform's next release.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Room for real features.</strong> A configurator, a quote flow, a live preview of the customer's own mark — things a plugin marketplace does not stock.</li>
  </ul>

  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">When upgrading is worth it</h3>
  <p style="margin-bottom: 1.25rem;">The honest answer is that it depends. Upgrade when any of these is true:</p>
  <ol style="margin-bottom: 1.5rem; padding-left: 1.5rem; color: var(--muted);">
    <li style="margin-bottom: 0.5rem;">You are taking payments, or you plan to within a year.</li>
    <li style="margin-bottom: 0.5rem;">The site has become the place customers decide, not just a business card.</li>
    <li style="margin-bottom: 0.5rem;">You need a feature no plugin sells — a configurator, an instant quote, a booking rule that matches how you actually work.</li>
    <li style="margin-bottom: 0.5rem;">You are already paying for a mid or upper platform tier and still fighting the template.</li>
    <li style="margin-bottom: 0.5rem;">You want to stop renting the thing your business runs on.</li>
  </ol>

  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">When a platform is the right call</h3>
  <p style="margin-bottom: 1.25rem;">Plenty of businesses should stay on Wix or Squarespace, and I will say so. If you need a one-page brochure you can edit yourself this afternoon, or a store with hundreds of items that has to be live this week, a hosted builder is a reasonable answer and custom work would be overkill. The mistake is not starting on a platform. It is staying on one long after the site has outgrown it, paying every month for a design you cannot take with you.</p>

  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">Where to go next</h3>
  <p style="margin-bottom: 1.25rem;">If you are in Sammamish, Issaquah, Redmond, or Bellevue, the <a href="/studio/local-web-design" style="color: var(--accent);">local web design page</a> covers what a fast, custom site includes and what it starts at. The <a href="/studio/pricing" style="color: var(--accent);">pricing page</a> lists every tier and every care plan, with the caveat that none of the monthly plans is required. When you are ready to talk scope, <a href="/studio/intake" style="color: var(--accent);">start a project</a> and you will get a straight number instead of a range.</p>
  `
);

registerPost('/blog/sammamish-small-business-website-guide.html', "Dec 4, 2026", "Business",
  "What Sammamish &amp; Eastside Small Businesses Should Look for in a Website (2026 Guide)",
  "What actually matters when a local business in Sammamish or the Eastside buys a website in 2026?",
  "Four things decide whether the site earns its keep: it works on a phone, it loads fast enough to keep the visitor, it is set up to be found in local search, and it ends in a lead instead of a dead end. Everything else is decoration. Here is how to check each one before you sign.",
  `
  <p style="margin-bottom: 1.25rem;">Most website advice for local businesses is written for companies with a marketing department. A four-person shop in Sammamish, a contractor working out of a truck in Issaquah, a tutor in Redmond, a salon in Bellevue &mdash; they need something much narrower: a site that answers the question a customer is already asking, on the phone in their hand, fast enough that they do not go back to the map.</p>
  <p style="margin-bottom: 1.25rem;">This is the checklist I would use if I were buying, in the order that actually changes whether you get the call.</p>

  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">1. It is designed at phone width, not shrunk to it</h3>
  <p style="margin-bottom: 1.25rem;">Almost every local search starts on a phone, often in a car. That means the first screen has to answer three questions without scrolling: what do you do, where are you, and how do I reach you. Hours, service area, and a tap-to-call button belong above the fold, not behind a hamburger menu.</p>
  <p style="margin-bottom: 1.25rem;">The test is mechanical. Open the site on your phone and try to read it one-handed. If you have to pinch, zoom, or scroll sideways, the layout was designed on a desktop and squeezed afterward. Forms matter too: a contact form with tiny fields and no visible labels loses the lead at the last step.</p>

  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">2. Speed you can measure on a bad connection</h3>
  <p style="margin-bottom: 1.25rem;">Ask for a number, not a promise. A site that renders its text in well under a second on a throttled phone is doing it because of its architecture, not because someone installed a caching plugin. Three things create the delay on a slow site:</p>
  <ul style="margin-bottom: 1.5rem; padding-left: 1.5rem; color: var(--muted);">
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">A server round trip.</strong> A database-backed page has to wake up, assemble templates, and run its plugins before it sends anything.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Render-blocking scripts.</strong> Fonts, analytics, chat widgets, and cookie banners each get a turn before the visitor sees text.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Distance.</strong> One server in one region makes every visitor outside it pay the speed-of-light penalty on every request.</li>
  </ul>
  <p style="margin-bottom: 1.25rem;">A static site served from an edge network removes all three. The HTML is already written, and a copy sits near the customer. That is the difference between a page that opens and a page that gets abandoned.</p>

  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">3. Local SEO that ships with the site</h3>
  <p style="margin-bottom: 1.25rem;">Search visibility for a local business is not a monthly add-on. The groundwork is either built into the site or it is missing:</p>
  <ul style="margin-bottom: 1.5rem; padding-left: 1.5rem; color: var(--muted);">
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">A real title and description per page</strong> that name the service and the city, instead of one site-wide title on every URL.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">A sitemap and structured data</strong> so search engines can read the business name, address, phone, hours, and services without guessing.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Consistent name, address, and phone</strong> across the site and your Google Business Profile. Mismatches split your ranking signal.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Pages for the places you serve</strong> &mdash; Sammamish, Issaquah, Redmond, Bellevue &mdash; that say something specific, not the same paragraph with the city name swapped in.</li>
  </ul>
  <p style="margin-bottom: 1.25rem;">And speed is part of it. Google measures how the page behaves for real visitors, so a slow template undercuts every other SEO effort on the site.</p>

  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">4. Prices published before the first call</h3>
  <p style="margin-bottom: 1.25rem;">You should be able to see what a website costs before you get on a call. If the pricing page is a contact form, you are not comparing vendors, you are being qualified.</p>
  <p style="margin-bottom: 1.25rem;">The tiers I publish are <strong style="color: var(--fg);">$750</strong> for a Portfolio site, <strong style="color: var(--fg);">$1,500</strong> for Professional, and <strong style="color: var(--fg);">$2,500</strong> for Business, quoted per project. Care plans run <strong style="color: var(--fg);">$10</strong> to <strong style="color: var(--fg);">$75</strong> a month and hosting is <strong style="color: var(--fg);">$15</strong> a month, and none of them is required to work with me. When you can see the numbers, you can tell whether the quote you get is scope or padding.</p>

  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">5. A path that ends in a lead, not a dead end</h3>
  <p style="margin-bottom: 1.25rem;">A brochure site collects phone calls. A site built around how the business actually sells collects specifications. That is where custom work earns its keep: the interactive part of the page is the part that turns a visitor into a conversation.</p>
  <p style="margin-bottom: 1.25rem;">The clearest example I have is <a href="https://chop-lab.com" target="_blank" rel="noopener" style="color: var(--accent);">chop-lab.com</a>, a ceramics tooling storefront. Nothing in that catalog is a fixed item &mdash; chops are cut from a customer's own logo, rollers from their texture, slab rails to their exact width. So the site puts a live preview of the customer's mark on a stamp face, in the font they choose, at the size they are ordering. Then the configurator collects the dimensions and ends in a real quote by email instead of a shopping cart nobody can fill.</p>
  <p style="margin-bottom: 1.25rem;">For a local business the shape is the same even when the product is not. A roofer who quotes by roof size, a tutor who books by subject and grade, a bakery that takes custom orders &mdash; each one has a question a form can ask better than a phone call. The build story is written up in <a href="/blog/chop-lab-storefront.html" style="color: var(--accent);">the storefront case study</a> and <a href="/blog/chop-lab-spa.html" style="color: var(--accent);">the rebuild write-up</a>.</p>

  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">6. Five questions to ask before you sign</h3>
  <ol style="margin-bottom: 1.5rem; padding-left: 1.5rem; color: var(--muted);">
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Who owns the files?</strong> If the answer is not "you do", you are renting.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Can I change my own text and hours?</strong> Ask for a walkthrough, not a promise.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">What happens if I stop paying the monthly plan?</strong> The site should stay up, or the plan was never optional.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">How fast is it on a phone?</strong> Get a number and check it yourself.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">What does a change cost after launch?</strong> Know the hourly rate or the plan before you need it.</li>
  </ol>

  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">7. Red flags worth walking away from</h3>
  <ul style="margin-bottom: 1.5rem; padding-left: 1.5rem; color: var(--muted);">
    <li style="margin-bottom: 0.5rem;">Speed and mobile layout listed as paid add-ons. In 2026 they are the baseline, not a feature.</li>
    <li style="margin-bottom: 0.5rem;">A long contract with no way to export your content.</li>
    <li style="margin-bottom: 0.5rem;">"Unlimited pages" as the headline. Page count is rarely what makes a site work.</li>
    <li style="margin-bottom: 0.5rem;">No access to your own analytics or search console.</li>
    <li style="margin-bottom: 0.5rem;">A quote that never asks who updates the site after launch.</li>
  </ul>

  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">Next step</h3>
  <p style="margin-bottom: 1.25rem;">If you want the short version of all of this for the Eastside, the <a href="/studio/local-web-design" style="color: var(--accent);">local web design page</a> lays out what a fast, custom site includes, what it starts at, and how the build runs from first call to launch. When you are ready to talk about your own business, <a href="/studio/intake" style="color: var(--accent);">start a project</a> and tell me what your current site gets wrong.</p>
  `
);

registerPost('/blog/websites-for-clubs-robotics-nonprofits.html', "Dec 11, 2026", "Business",
  "How Student Clubs, Robotics Teams, and Local Nonprofits Can Get a Custom Website Under $750",
  "What does a student club, robotics team, or small nonprofit actually need from a website, and what should it cost?",
  "A schedule, a sponsor showcase, a working sign-up form, and a page that loads on a phone in a school parking lot. Nothing else. The discounted studio tier covers exactly that for $250 to $750 depending on scope, against a regular Portfolio floor of $750, and the site is yours to keep.",
  `
  <p style="margin-bottom: 1.25rem;">A robotics team, a booster club, and a small nonprofit all have the same problem. They need to look credible, publish a schedule, thank sponsors, and take sign-ups &mdash; and they have no budget and nobody with spare evenings to maintain a website.</p>
  <p style="margin-bottom: 1.25rem;">None of that requires an agency. Here is what these groups actually need, why the free template usually stops working, and how the discounted tier works.</p>

  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">What a club site actually has to do</h3>
  <p style="margin-bottom: 1.25rem;">Strip out everything a big company needs and six things remain:</p>
  <ul style="margin-bottom: 1.5rem; padding-left: 1.5rem; color: var(--muted);">
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">A schedule</strong> that is current, because parents check it on the way to a meet.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">A sponsor showcase</strong> that makes a business feel good about writing a check.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">A join, volunteer, or donation form</strong> that sends to an inbox someone actually reads.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Photos and results</strong>, because credibility is the whole point of the site.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">A contact path</strong> for a parent, a teacher, or a partner who has a question.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Speed on a phone</strong>, since that is the only device anyone will use at an event.</li>
  </ul>
  <p style="margin-bottom: 1.25rem;">That is a small site. It should not cost like a large one.</p>

  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">Why the free template stops working</h3>
  <p style="margin-bottom: 1.25rem;">Free and cheap builder plans are a reasonable place to start, and plenty of clubs are on one right now. The trouble usually shows up in the second year, and it is rarely about design taste:</p>
  <ul style="margin-bottom: 1.5rem; padding-left: 1.5rem; color: var(--muted);">
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The ads.</strong> Free tiers put the platform's branding on your site, which is a strange thing to hand a sponsor.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The weight.</strong> Every plugin added for forms, galleries, or calendars makes the page slower on a phone.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The handoff.</strong> The student who built the site graduates, the login goes with them, and nobody left knows where the edit screen is.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The logos.</strong> Sponsor logos arrive as a dozen mismatched images, and on a phone they either disappear or blow the layout apart.</li>
  </ul>
  <p style="margin-bottom: 1.25rem;">A small custom site fixes the last two by design: the content is structured, so adding a sponsor is a line in a list, and the files belong to the club rather than to an account someone will lose.</p>

  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">What the discounted tier covers</h3>
  <p style="margin-bottom: 1.25rem;">Each semester I reserve a limited number of discounted projects for students, robotics teams, scouts, school clubs, and community nonprofits. Typical projects land between <strong style="color: var(--fg);">$250</strong> and <strong style="color: var(--fg);">$750</strong> depending on scope, against a regular Portfolio tier that starts at $750.</p>
  <p style="margin-bottom: 1.25rem;">For that you get a custom design in the club's own colors and photos, mobile-first pages, working forms for sign-ups and contact, SEO basics, and fast edge hosting &mdash; on the same stack as the commercial work, not a cut-down version of it. Most projects launch in about five days once the content is ready.</p>
  <p style="margin-bottom: 1.25rem;">Ongoing support is optional. Priority care is <strong style="color: var(--fg);">$10</strong> a month and hosting plans start at <strong style="color: var(--fg);">$15</strong> a month, and neither is required &mdash; the site is yours to host and edit. If the club would rather run it themselves, that is a perfectly good answer.</p>

  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">Sponsor showcases that respect the sponsors</h3>
  <p style="margin-bottom: 1.25rem;">A sponsor wall is the highest-value page on a club site, and the most commonly botched. Three rules make it work:</p>
  <ol style="margin-bottom: 1.5rem; padding-left: 1.5rem; color: var(--muted);">
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Group by level, not by arrival.</strong> A tiered wall (title, gold, community) tells a prospective sponsor what each check buys.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Link to the business.</strong> A logo that is not clickable is a poster. A link is the part sponsors notice.</li>
    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Normalize the images.</strong> Same height, same padding, real alt text. One oversized PNG is what breaks the wall on a phone.</li>
  </ol>
  <p style="margin-bottom: 1.25rem;">Add one line of plain text saying what the money paid for &mdash; a competition entry, a set of motors, a bus seat &mdash; and the page starts doing sales work for next season.</p>

  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">Schedules that stay current</h3>
  <p style="margin-bottom: 1.25rem;">The schedule is the page that gets visited most and updated least. Two things help. First, put the dates in the page as text, not in a PDF or a screenshot of a calendar, because a PDF does not reflow on a phone and cannot be read by a search engine. Second, make the update path something a student can do in a minute &mdash; either a simple edit screen or a small data file with one line per event.</p>
  <p style="margin-bottom: 1.25rem;">If the team publishes results, keep them on the same page. A visitor who sees this season's standings trusts the rest of the site more than one that still lists last year's captain.</p>

  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">For FIRST Robotics teams specifically</h3>
  <p style="margin-bottom: 1.25rem;">Robotics teams have a shape that most templates fight. The site has to carry a competition schedule, a sponsor packet someone can download, outreach and impact numbers for grant applications, build-season updates, and photos that prove the team actually builds things.</p>
  <p style="margin-bottom: 1.25rem;">It also has to survive an event. A phone on a crowded gym floor is a bad network, and the parent trying to find the pit map or the match time will not wait through a page that loads a plugin library first. A static page served from an edge network answers immediately, which is the entire argument for building it this way.</p>

  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">For nonprofits, the same discipline applies</h3>
  <p style="margin-bottom: 1.25rem;">A small nonprofit needs five things in roughly this order: what you do in one sentence, who you serve, what you have accomplished, how to donate or volunteer, and how to reach a human. Board members and grant reviewers read that page. A site that buries the mission under a carousel loses both audiences.</p>

  <h3 style="margin: 2.5rem 0 1rem; font-family: var(--serif);">How to apply</h3>
  <p style="margin-bottom: 1.25rem;">Availability is limited each semester, so the earlier in the term the better. Have four things ready: the club's logo, a handful of photos, the current schedule, and the sponsor list. That is enough to start, and anything missing can be added after launch.</p>
  <p style="margin-bottom: 1.25rem;">The <a href="/studio/student-nonprofit" style="color: var(--accent);">student and nonprofit program page</a> explains who it is for and what is included. The <a href="/studio/clients" style="color: var(--accent);">client work page</a> shows the same stack running live sites for an artist, an accessibility startup, and a ceramics studio &mdash; the standard does not drop because the budget is smaller. When you are ready, <a href="/studio/intake" style="color: var(--accent);">start a project</a> and tell me what your group does and who it serves.</p>
  `
);
