document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.overlay-menu');
    
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            if (menu.classList.contains('active')) {
                toggle.innerHTML = "&times;";
            } else {
                toggle.innerHTML = "&#9776;";
            }
        });
    }
});