document.addEventListener('DOMContentLoaded', () => {
    // 1. Set the current year in the footer
    const yearSpan = document.getElementById('year');
    if(yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Console log to check connection
    console.log("The Chop Lab is ready for orders.");
});