document.addEventListener('DOMContentLoaded', () => {
    
    // --- CONFIGURATION ---
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw5tCVxokG6oCMT3tQDI7Zi4YfGseP9Nch-RJZ8s3prTxeR6_4c3-uM3txtnSPMUj6MXw/exec"; 

    // DOM Elements
    const productSelect = document.getElementById('productSelect');
    const form = document.getElementById('tcl-order-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Modal Elements
    const modal = document.getElementById('successModal');
    const closeBtn = document.getElementById('closeModalBtn');

    // Dynamic Sections
    const simpleSection = document.getElementById('opt-chop-simple');
    const complexSection = document.getElementById('opt-chop-complex');
    const rollerSection = document.getElementById('opt-roller');
    const extraSection = document.getElementById('opt-roller-extra');

    // --- FIX: Setup Close Button Immediately ---
    if(closeBtn) {
        closeBtn.addEventListener('click', function() {
            window.location.href = "index.html"; 
        });
    }

    function hideAllSections() {
        simpleSection.classList.add('hidden');
        complexSection.classList.add('hidden');
        rollerSection.classList.add('hidden');
        extraSection.classList.add('hidden');
        
        // Remove 'required' attributes from hidden fields
        document.querySelectorAll('.dynamic-section input').forEach(input => input.required = false);
    }

    productSelect.addEventListener('change', (e) => {
        const value = e.target.value;
        hideAllSections();

        if (value === 'chop-simple') {
            simpleSection.classList.remove('hidden');
        } 
        else if (value === 'chop-complex') {
            complexSection.classList.remove('hidden');
        }
        else if (value === 'roller-system') {
            rollerSection.classList.remove('hidden');
        }
        else if (value === 'roller-module') {
            extraSection.classList.remove('hidden');
        }
    });

    // --- FORM SUBMISSION LOGIC ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show Loading State
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "Processing Order...";
        submitBtn.disabled = true;

        // Gather Data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Handle File Upload
        const fileInput = document.getElementById('logoUpload');
        if (fileInput && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();
            
            reader.onload = async function() {
                data.fileName = file.name;
                data.fileType = file.type;
                data.fileData = reader.result.split(',')[1]; 
                await sendToGoogle(data);
            };
            reader.readAsDataURL(file);
        } else {
            await sendToGoogle(data);
        }

        // Send Function
        async function sendToGoogle(payload) {
            try {
                await fetch(SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors', 
                    headers: { 'Content-Type': 'text/plain' },
                    body: JSON.stringify(payload)
                });

                // Success! Show Modal
                if(modal) {
                    modal.classList.remove('hidden');
                }
                
                // Reset Form UI
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
});