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

# 🧪 Minescouts Beta Program

<!-- NAVIGATION BAR -->
<div align="center">
  <h3>
    <a href="README.md">🏠 Main Site Docs</a>
    &nbsp;&nbsp;|&nbsp;&nbsp;
    <a href="README_BETA.md">🧪 Beta Program Docs</a>
  </h3>
</div>
<hr>

## ⚠️ Warning: Experimental Zone
Welcome to the **Minescouts Beta** documentation. This branch (`beta.minescout.net`) simulates a persistent "Web Operating System" with a Hacker/Terminal aesthetic.

**Current Version:** `v5.0-beta (Terminal OS & AI Suite)`

## 🚧 Active Beta Experiments

### 1. The Terminal OS (Core v5.0)
A fully functional Command Line Interface that persists state across pages.
*   **Navigation:** Use `/` to toggle the terminal overlay.
*   **New Commands:**
    *   `alias [name]=[cmd]`: Create custom shortcuts.
    *   `snake`: Play a terminal-based mini-game with physics integration.
    *   `stats`: View real-time system health in ASCII art.
    *   `main`: Triggers a "Reverse Matrix" transition to return to the live site.
*   **Security:** Implements a Clearance Level system (Lvl 0 - 10).

### 2. AI Writer Suite (v41.0)
An advanced, browser-based IDE for generating HTML content using Artificial Intelligence.
*   **Tech Stack:** Puter.js (AI), IndexedDB (Local Storage), Firebase (Community).
*   **Features:**
    *   **Smart Asset Injection:** Upload images/videos, and the AI automatically places them contextually within the article using Base64 encoding.
    *   **Dual Export:**
        *   **Standard:** Downloads a standalone HTML file.
        *   **Admin:** Injects content into the official `life.minescout.net` production template with sidebar/auth scripts.
    *   **Community Library:** Share created articles to a global feed or load templates from other users.

### 3. Utility Tools
Standalone web-tools built for the "Projects" directory.
*   **Vigenère Cipher:** A cryptography tool featuring encryption, decryption, and a dictionary-based brute force attack.
*   **Portfolio Simulator:** A neon-themed financial projection engine using Chart.js to model compound interest and volatility.

### 4. Secure Uplink (Messaging)
*   **Admin Inbox:** A hidden GUI (`admin-messages.html`) for viewing contact form submissions and feature requests.
*   **Alerts:** The main terminal will flash **RED** ("CHECK_THE_CORNERS") if unread high-priority messages exist.

## 🐛 How to Report Bugs
If you find a glitch (that isn't part of the aesthetic) or a broken link, please report it via the Terminal.

**Feature Request / Bug Report:**
1.  Open the Command Window (Press `/`).
2.  Type `reqs` to open the secure uplink.
3.  Fill out the form. Select **"HIGH"** priority for breaking bugs.

## 🔒 Admin Beta Access
**Clearance Level 10** is reserved for the Administrator (`theminescout@minescout.net`).
*   **Terminal:** Grants access to `vm` (View Messages) and `ls -a` (Hidden Files).
*   **AI Writer:** Entering the Admin Override Code unlocks production-ready export templates and meta-tag customization.
*   **Analytics:** Grants read-access to the realtime page view database.

---
<div align="center">
  <sub>Thanks for testing the future of Minescouts Life!</sub>
</div>
