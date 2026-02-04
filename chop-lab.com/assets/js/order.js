document.addEventListener('DOMContentLoaded', () => {
    
    // --- CONFIGURATION ---
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxA0tHDzsc4baNHSURGJRMFVvRpXLZMAL0Hhkezq5xC641ehY5asGkTD1X4k6uauBJF9A/exec"; 

    // DOM Elements
    const productSelect = document.getElementById('productSelect');
    const form = document.getElementById('tcl-order-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    const modal = document.getElementById('successModal');
    const closeBtn = document.getElementById('closeModalBtn');

    // Dynamic Sections
    const simpleSection = document.getElementById('opt-chop-simple');
    const complexSection = document.getElementById('opt-chop-complex');
    const roller4Section = document.getElementById('opt-roller-4in');
    const roller10Section = document.getElementById('opt-roller-10in');
    const reprintSection = document.getElementById('opt-roller-reprint');

    // --- NEW: URL PARAMETER LOGIC ---
    // This reads the "?product=xyz" from the link you clicked
    const urlParams = new URLSearchParams(window.location.search);
    const preSelectedProduct = urlParams.get('product');

    if (preSelectedProduct && productSelect) {
        // Set the dropdown value
        productSelect.value = preSelectedProduct;
        // Trigger the section display update manually
        updateSections(preSelectedProduct);
    }

    // Setup Close Button
    if(closeBtn) {
        closeBtn.addEventListener('click', function() {
            window.location.href = "index.html"; 
        });
    }

    function hideAllSections() {
        if(simpleSection) simpleSection.classList.add('hidden');
        if(complexSection) complexSection.classList.add('hidden');
        if(roller4Section) roller4Section.classList.add('hidden');
        if(roller10Section) roller10Section.classList.add('hidden');
        if(reprintSection) reprintSection.classList.add('hidden');
        
        document.querySelectorAll('.dynamic-section input').forEach(input => input.required = false);
    }

    // Helper function to handle visibility
    function updateSections(value) {
        hideAllSections();

        if (value === 'chop-simple' && simpleSection) simpleSection.classList.remove('hidden');
        else if (value === 'chop-complex' && complexSection) complexSection.classList.remove('hidden');
        else if (value === 'roller-4in' && roller4Section) roller4Section.classList.remove('hidden');
        else if (value === 'roller-10in' && roller10Section) roller10Section.classList.remove('hidden');
        else if (value === 'roller-reprint' && reprintSection) reprintSection.classList.remove('hidden');
    }

    if (productSelect) {
        productSelect.addEventListener('change', (e) => {
            updateSections(e.target.value);
        });
    }

    // --- FORM SUBMISSION ---
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const originalText = submitBtn.innerText;
            submitBtn.innerText = "Processing Order...";
            submitBtn.disabled = true;

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Handle Files (Logo OR Reprint Photo)
            const logoInput = document.getElementById('logoUpload');
            const reprintInput = document.getElementById('reprintUpload');
            let fileToUpload = null;

            if (data.productSelect === 'chop-complex' && logoInput && logoInput.files.length > 0) {
                fileToUpload = logoInput.files[0];
            }
            else if (data.productSelect === 'roller-reprint' && reprintInput && reprintInput.files.length > 0) {
                fileToUpload = reprintInput.files[0];
            }

            if (fileToUpload) {
                const reader = new FileReader();
                reader.onload = async function() {
                    data.fileName = fileToUpload.name;
                    data.fileType = fileToUpload.type;
                    data.fileData = reader.result.split(',')[1]; 
                    await sendToGoogle(data);
                };
                reader.readAsDataURL(fileToUpload);
            } else {
                await sendToGoogle(data);
            }

            async function sendToGoogle(payload) {
                try {
                    await fetch(SCRIPT_URL, {
                        method: 'POST',
                        mode: 'no-cors', 
                        headers: { 'Content-Type': 'text/plain' },
                        body: JSON.stringify(payload)
                    });

                    if(modal) modal.classList.remove('hidden');
                    form.reset();
                    hideAllSections();
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;

                } catch (error) {
                    console.error("Error:", error);
                    alert("Connection Error. Please try again.");
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                }
            }
        });
    }
});