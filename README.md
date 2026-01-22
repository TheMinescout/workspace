# 🌿 Minescouts Life

<!-- NAVIGATION BAR -->
<div align="center">
  <h3>
    <a href="README.md">🏠 Main Site Docs</a>
    &nbsp;&nbsp;|&nbsp;&nbsp;
    <a href="README_BETA.md">🧪 Beta Program Docs</a>
  </h3>
</div>
<hr>

## Overview
**Minescouts Life** is a personal content hub and web application platform. It serves as a central repository for tech tips, coding projects, personal updates (Eagle Scout progress, Puppy Life), and a community Minecraft server portal.

The site is built as a static web application enhanced with **Firebase** for real-time data, user authentication, and dynamic content injection.

## 🚀 Key Features
*   **Dynamic Content System:** Articles and announcements are fetched in real-time from Firebase Realtime Database.
*   **Modular Architecture:** Uses JavaScript injection (`loader.js`) to load shared assets (Sidebar, Auth logic) across 20+ pages without code duplication.
*   **Admin Dashboard:** A secure CMS for creating posts, announcements, and managing the development roadmap.
*   **Interactive Features:** Includes a live Project Roadmap, GitHub Status widget, and Real-time Web Analytics (Active Users/Total Views).
*   **Web Apps:** Custom tools like the *Beat Saber Randomizer*, *Scorecard Pro*, and *Vigenère Cipher Tool*.
*   **Feedback System:** Integrated Feature Request form powered by EmailJS and Firebase.

## 🛠️ Tech Stack
*   **Frontend:** HTML5, CSS3 (Custom Variables), JavaScript (ES6 Modules).
*   **Backend/Data:** Google Firebase (Auth, Realtime Database, Analytics).
*   **Utilities:** EmailJS (Notifications), Tailwind CSS (Admin Panel only).
*   **Styling:** Custom CSS (`homepage.css`, `features.css`, `AI-ASSISTANT.css`).
*   **Fonts:** Google Fonts (Inter).

## 📂 Project Structure
```text
life.minescout.net/
├── admin/            # CMS for creating posts & viewing requests
├── archives/         # Monthly/Yearly archive pages
├── assets/           # Core resources
│   ├── css/          # Global styles (homepage.css, features.css)
│   ├── includes/     # HTML fragments (sidebar.html, comments.html)
│   ├── images/       # Site assets and post thumbnails
│   └── js/           # Modular logic (auth.js, loader.js, features.js)
├── pages/            # Category hubs (Tech Tips, Updates, etc.)
├── posts/            # Individual articles organized by topic
├── projects/         # Standalone Web Apps (Scorecard, Beat Saber)
└── index.html        # Entry point
🔧 Installation & Local Development
Because this project uses ES6 Modules (type="module"), you cannot simply double-click the HTML files. You must use a local server.
Clone the Repo:
code
Bash
git clone https://github.com/TheMinescout/workspace.git
Run a Local Server:
VS Code: Install "Live Server" extension -> Right-click index.html -> "Open with Live Server".
Python: python -m http.server 8000
Firebase Config:
Create assets/js/firebase-config.js and paste your API keys there. (This file is ignored by Git for security).
📬 Contact & Support
Email: theminescout@minescout.net
Phone Support (AI): +1 (425) 559 9127
<div align="center">
<sub>© 2026 Minescouts Life. All Rights Reserved.</sub>
</div>