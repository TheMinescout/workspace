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
*   **Modular Architecture:** Uses JavaScript injection to load shared assets (Sidebar, Header, Auth logic) across 20+ pages.
*   **User System:** Full Login/Sign-up functionality with Admin privileges for content creation.
*   **Interactive Web Apps:** Includes custom tools like the *Beat Saber Randomizer*, *Scorecard Pro*, and *Vigenère Cipher Tool*.
*   **Responsive Design:** Fully mobile-compatible grid layouts and navigation.

## 🛠️ Tech Stack
*   **Frontend:** HTML5, CSS3 (Custom Variables), JavaScript (ES6 Modules).
*   **Backend/Data:** Google Firebase (Auth & Realtime Database).
*   **Styling:** Custom CSS (`homepage.css`, `AI-ASSISTANT.css`) + Tailwind CSS (for specific tools).
*   **Fonts:** Google Fonts (Inter).

## 🔧 Installation & Local Development
Because this project uses ES6 Modules (`type="module"`), you cannot simply double-click the HTML files. You must use a local server.

1.  **Clone the Repo:**
    ```bash
    git clone https://github.com/your-username/minescout-life.git
    ```
2.  **Run a Local Server:**
    *   **VS Code:** Install "Live Server" extension -> Right-click `index.html` -> "Open with Live Server".
    *   **Python:** `python -m http.server 8000`
3.  **Firebase Config:**
    Ensure `assets/js/auth.js` contains your valid Firebase API keys.

## 📬 Contact & Support
*   **Email:** theminescout@minescout.net
*   **Phone Support (AI):** +1 (425) 559 9127

---
<div align="center">
  <sub>© 2025 Minescouts Life. All Rights Reserved.</sub>
</div>