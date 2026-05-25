// =========================================
// VIEW: GLITCH REALM / EASTER EGG
// =========================================

export const render = () => `
    <style>
        .security-gate { text-align: center; z-index: 20; background: #000; border: 2px solid #FF0000; padding: 40px; box-shadow: 0 0 20px #FF0000; }
        .playground { display: none; background: rgba(0, 0, 0, 0.9); border: 2px dashed #00FFFF; padding: 30px; width: 600px; max-width: 90%; text-align: center; box-shadow: 0 0 20px #00FFFF; z-index: 10; }
        .active-mod { background: #003300 !important; border-color: #00FF00 !important; box-shadow: 0 0 5px #00FF00 inset !important; }
    </style>

    <div style="display:flex; justify-content:center; align-items:center; height:100%;">
        <div id="gate" class="security-gate">
            <h2 style="color: #FF0000; margin: 0 0 20px 0; font-size: 2rem;">// RESTRICTED AREA //</h2>
            <p style="color: #0F0; margin-bottom: 15px;">ENTER OVERRIDE CODE FROM CONSOLE LOGS</p>
            <input type="text" id="auth-input" maxlength="4" placeholder="____" style="background: #110000; border: 1px solid #FF0000; color: #FF0000; padding: 10px; font-family: inherit; font-size: 1.5rem; text-align: center; width: 150px; outline: none; text-transform: uppercase;">
            <div class="gate-msg" id="gate-msg" style="margin-top: 10px; color: #FF0000; height: 20px; font-weight: bold;"></div>
        </div>

        <div class="playground" id="box">
            <h1 style="color: #00FFFF; text-shadow: 2px 2px 0 #FF00FF; letter-spacing: 3px; margin-bottom:10px;">// SYSTEM_OVERRIDE //</h1>
            <p style="color:#0F0;">Changes apply instantly and persist across the network.</p>
            
            <div class="controls" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px;">
                <button id="btn-rainbow" class="action-btn" onclick="window.toggleRainbow()">[ TOGGLE RAINBOW ]</button>
                <button id="btn-invert" class="action-btn" onclick="window.toggleInvert()">[ INVERT REALITY ]</button>
                <button id="btn-flip" class="action-btn" onclick="window.toggleFlip()">[ FLIP WORLD ]</button>
                <button id="btn-grav" class="action-btn" onclick="window.toggleGravity()">[ GRAVITY FAIL ]</button>
            </div>

            <a href="#/" style="display: block; margin-top: 20px; color: #555; text-decoration: none; cursor: pointer;">&lt;&lt; REBOOT SYSTEM</a>
        </div>
    </div>
`;

export const init = () => {
    const gateInput = document.getElementById('auth-input');
    const gateMsg = document.getElementById('gate-msg');
    
    if (gateInput) {
        gateInput.focus();
        
        gateInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                // Fallback code '1337' added so it functions natively without prior sessionStorage setup
                const secret = sessionStorage.getItem('egg_code') || '1337'; 
                
                if (gateInput.value.toUpperCase() === secret.toUpperCase()) {
                    document.getElementById('gate').style.display = 'none';
                    document.getElementById('box').style.display = 'block';
                    loadButtonStates();
                } else {
                    gateMsg.innerText = "ACCESS DENIED";
                    gateInput.value = "";
                    setTimeout(() => window.location.location = "/", 1000);
                }
            }
        });
    }

    // Attach global toggle handlers for inline HTML usage
    window.toggleRainbow = function() {
        const current = sessionStorage.getItem('egg_rainbow') === 'true';
        sessionStorage.setItem('egg_rainbow', !current);
        document.getElementById('btn-rainbow').classList.toggle('active-mod');
    };

    window.toggleInvert = function() {
        const current = sessionStorage.getItem('egg_invert') === 'true';
        sessionStorage.setItem('egg_invert', !current);
        document.body.style.filter = !current ? "invert(1) hue-rotate(180deg)" : "none";
        document.getElementById('btn-invert').classList.toggle('active-mod');
    };

    window.toggleFlip = function() {
        const current = sessionStorage.getItem('egg_flip') === 'true';
        sessionStorage.setItem('egg_flip', !current);
        document.body.style.transform = !current ? "scaleY(-1)" : "none";
        document.getElementById('btn-flip').classList.toggle('active-mod');
    };

    window.toggleGravity = function() {
        const current = sessionStorage.getItem('egg_gravity') === 'true';
        sessionStorage.setItem('egg_gravity', !current);
        location.reload(); 
    };

    function loadButtonStates() {
        if(sessionStorage.getItem('egg_rainbow') === 'true') document.getElementById('btn-rainbow').classList.add('active-mod');
        if(sessionStorage.getItem('egg_invert') === 'true') document.getElementById('btn-invert').classList.add('active-mod');
        if(sessionStorage.getItem('egg_flip') === 'true') document.getElementById('btn-flip').classList.add('active-mod');
        if(sessionStorage.getItem('egg_gravity') === 'true') document.getElementById('btn-grav').classList.add('active-mod');
    }

    // Nullify standard commands inside the restricted area
    window.handlePageCommand = null;
};