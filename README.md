🌐 The Minescouts Ecosystem & The Chop Lab
==========================================

_A consolidated overview of the Minescouts Life platform, the Experimental Beta Program, and The Chop Lab micro-manufacturing service._

🌿 Minescouts Life
------------------

### Overview

**Minescouts Life** is a personal content hub and web application platform. It serves as a central repository for tech tips, coding projects, personal updates (Eagle Scout progress, Puppy Life), and a community Minecraft server portal.

The site is built as a static web application enhanced with **Firebase** for real-time data, user authentication, and dynamic content injection.

### 🚀 Key Features

*   **Dynamic Content System:** Articles and announcements are fetched in real-time from Firebase Realtime Database.
    
*   **Modular Architecture:** Uses JavaScript injection (loader.js) to load shared assets (Sidebar, Auth logic) across 20+ pages without code duplication.
    
*   **Admin Dashboard:** A secure CMS for creating posts, announcements, and managing the development roadmap.
    
*   **Interactive Features:** Includes a live Project Roadmap, GitHub Status widget, and Real-time Web Analytics (Active Users/Total Views).
    
*   **Web Apps:** Custom tools like the _Beat Saber Randomizer_, _Scorecard Pro_, and _Vigenère Cipher Tool_.
    
*   **Feedback System:** Integrated Feature Request form powered by EmailJS and Firebase.
    

### 📂 Project Structure

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   life.minescout.net/  ├── admin/            # CMS for creating posts & viewing requests  ├── archives/         # Monthly/Yearly archive pages  ├── assets/           # Core resources  │   ├── css/          # Global styles (homepage.css, features.css)  │   ├── includes/     # HTML fragments (sidebar.html, comments.html)  │   ├── images/       # Site assets and post thumbnails  │   └── js/           # Modular logic (auth.js, loader.js, features.js)  ├── pages/            # Category hubs (Tech Tips, Updates, etc.)  ├── posts/            # Individual articles organized by topic  ├── projects/         # Standalone Web Apps (Scorecard, Beat Saber)  └── index.html        # Entry point   `

🧪 Minescouts Beta Program
--------------------------

### ⚠️ Warning: Experimental Zone

Welcome to the **Minescouts Beta** documentation. This branch (beta.minescout.net) simulates a persistent "Web Operating System" with a Hacker/Terminal aesthetic.

**Current Version:** v5.0-beta (Terminal OS & AI Suite)

### 🚧 Active Beta Experiments

#### 1\. The Terminal OS (Core v5.0)

A fully functional Command Line Interface that persists state across pages.

*   **Navigation:** Use / to toggle the terminal overlay.
    
*   **New Commands:**
    
    *   alias \[name\]=\[cmd\]: Create custom shortcuts.
        
    *   snake: Play a terminal-based mini-game with physics integration.
        
    *   stats: View real-time system health in ASCII art.
        
    *   main: Triggers a "Reverse Matrix" transition to return to the live site.
        
*   **Security:** Implements a Clearance Level system (Lvl 0 - 10).
    

#### 2\. AI Writer Suite (v41.0)

An advanced, browser-based IDE for generating HTML content using Artificial Intelligence.

*   **Tech Stack:** Puter.js (AI), IndexedDB (Local Storage), Firebase (Community).
    
*   **Features:**
    
    *   **Smart Asset Injection:** Upload images/videos, and the AI automatically places them contextually within the article using Base64 encoding.
        
    *   **Dual Export:** Standard HTML or Admin-ready injected templates.
        

#### 3\. Utility Tools

*   **Vigenère Cipher:** Cryptography tool featuring encryption, decryption, and a dictionary-based brute force attack.
    
*   **Portfolio Simulator:** Neon-themed financial projection engine using Chart.js to model compound interest and volatility.
    

### 🔒 Admin Beta Access

**Clearance Level 10** is reserved for the Administrator (theminescout@minescout.net).

*   **Terminal:** Grants access to vm (View Messages) and ls -a (Hidden Files).
    
*   **AI Writer:** Entering the Admin Override Code unlocks production-ready export templates.
    

🏺 The Chop Lab
---------------

### Overview

**The Chop Lab** is a micro-manufacturing hub specializing in bringing digital precision to the physical world. Operating under the tagline _"Where CAD meets Clay"_, the lab engineers custom tools for ceramic artists and provides rapid 3D prototyping services for makers, cosplayers, and engineers.

### 🚀 Key Services

*   **Ceramic Studio Tools:** High-relief, non-stick PLA Matte stamps ("Chops"), continuous texture rollers, and concentric trimming foot guides engineered specifically for moist clay.
    
*   **Print-On-Demand (STL):** A public-facing 3D printing service utilizing high-speed Bambu Lab A1 printers. Customers can upload .stl files for instant quotes and manufacturing in durable PETG or detailed PLA Matte.
    

### 🛠️ Tech Stack & Architecture

The Chop Lab operates on a custom-built, lightning-fast Single Page Application (SPA).

*   **Frontend:** Vanilla HTML5/CSS3/JS, entirely contained within a single index.html file for zero-latency routing.
    
*   **Interactive 3D:** Integrates **Three.js** and **WebGL** to provide customers with an interactive, spinning 3D preview of their uploaded STL files before submission.
    
*   **Backend/Data:** Powered by Google Apps Script and Firebase, capturing order logic, sending automated HTML email quotes, and persisting client project histories.
    
*   **AI Integration:** Features a Cloudflare Worker-powered AI Chat terminal acting as a virtual lab assistant, and utilizes AI to summarize incoming admin orders.
    

© 2026 The Minescouts Ecosystem & The Chop Lab. All Rights Reserved.

Email: theminescout@minescout.net | AI Support: +1 (425) 559 9127
