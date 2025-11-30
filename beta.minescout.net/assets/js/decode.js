const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*";

document.querySelectorAll(".hacker-link").forEach(item => {
    
    // Store the original "encrypted" text to reset on mouse-out
    item.dataset.original = item.innerText;

    item.onmouseover = event => {
        let iterations = 0;
        const targetText = event.target.dataset.value;
        
        const interval = setInterval(() => {
            
            event.target.innerText = targetText
                .split("")
                .map((letter, index) => {
                    // Check if enough iterations have passed to reveal the actual letter
                    if(index < iterations) {
                        return targetText[index];
                    }
                    // Otherwise, return a random hacker character
                    return letters[Math.floor(Math.random() * letters.length)];
                })
                .join("");

            // Stop the animation once all letters are revealed
            if(iterations >= targetText.length) { 
                clearInterval(interval);
            }
            
            // Control the speed of the reveal
            iterations += 1 / 3; 

        }, 30); // Update every 30ms for a smooth animation
    }

    // Re-encrypt when mouse leaves
    item.onmouseleave = event => {
        // Ensure the full target value has been revealed before re-encrypting
        if (event.target.innerText === event.target.dataset.value) {
            event.target.innerText = event.target.dataset.original;
        }
    }
});