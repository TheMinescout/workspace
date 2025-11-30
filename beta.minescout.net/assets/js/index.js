/* --- MATRIX RAIN SETUP --- */
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nums = '0123456789';
const alphabet = katakana + latin + nums;

const fontSize = 16;
let columns = canvas.width / fontSize;
let drops = [];

function initDrops() {
    columns = canvas.width / fontSize;
    drops = [];
    for(let i = 0; i < columns; i++) {
        drops[i] = 1;
    }
}
initDrops();
window.addEventListener('resize', initDrops);

function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0F0';
    ctx.font = fontSize + 'px monospace';

    for(let i = 0; i < drops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}
setInterval(draw, 33);

/* --- COMMAND LINE INTERFACE LOGIC --- */

// Global function so HTML onclick works
window.toggleCmd = function() {
    const overlay = document.getElementById('cmd-overlay');
    const input = document.getElementById('cmd-input');
    
    if (overlay.classList.contains('hidden')) {
        // OPEN IT
        overlay.classList.remove('hidden');
        input.value = ''; // Clear input
        document.getElementById('cmd-error').innerText = ''; 
        setTimeout(() => input.focus(), 100); 
    } else {
        // CLOSE IT
        overlay.classList.add('hidden');
    }
};

// 1. KEYBOARD LISTENERS
document.addEventListener('keydown', (event) => {
    // IGNORE if we are already typing inside the input box
    if (event.target.id === 'cmd-input') return;

    // Check for Slash (/), Question Mark (?), or Backslash (\)
    if (event.key === '/' || event.key === '?' || event.key === '\\') {
        event.preventDefault(); // Stop the character from typing
        window.toggleCmd();
    }
    
    // Close on ESC
    if (event.key === 'Escape') {
        document.getElementById('cmd-overlay').classList.add('hidden');
    }
});

// 2. INPUT EXECUTION LISTENER
document.getElementById('cmd-input').addEventListener('keydown', (event) => {
    // Only run when ENTER is pressed
    if (event.key === 'Enter') {
        const command = event.target.value.toLowerCase().trim();
        const errorMsg = document.getElementById('cmd-error');
        
        switch(command) {
            case 'atls':
                // Go to Articles
                window.location.href = 'pages.html';
                break;
            case 'prds':
                // Go to Projects
                window.location.href = 'projects.html';
                break;
            case 'return':
                // Go to Main Site
                window.location.href = 'https://life.minescout.net';
                break;
            case 'exit':
                // Just close window
                window.toggleCmd();
                break;
            default:
                errorMsg.innerText = `> ERROR: '${command}' is not a valid command.`;
                break;
        }
    }
});