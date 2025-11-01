/**
 * Newsletter Form Handler
 * 
 * Replace 'YOUR_WEB_APP_URL' below with the URL you get after deploying
 * your Google Apps Script as a web app.
 */

// Replace this with your Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwqa9qW7eVUIDulb-nB1DPZseivFMwu88EOH0IpH8d16qJB_pHa7R54SDpsGpL60yl6/exec';

// Debug mode: enable by adding ?debug=true to URL or setting window.DEBUG = true
const DEBUG = window.DEBUG || (new URLSearchParams(window.location.search).get('debug') === 'true');

// Helper function for conditional error logging
const debugError = (...args) => {
    if (DEBUG) console.error(...args);
};

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('newsletter-form-component');
    const messageElement = document.getElementById('newsletter-message');
    const emailInput = document.getElementById('newsletter-email');

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const email = emailInput.value.trim();
            
            // Validate email
            if (!email || !email.includes('@')) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }

            // Disable submit button
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';

            try {
                // Use form submission with hidden iframe to avoid CORS issues
                const iframe = document.createElement('iframe');
                iframe.name = 'hidden-iframe';
                iframe.style.display = 'none';
                document.body.appendChild(iframe);

                // Create a temporary form to submit to Google Apps Script
                const tempForm = document.createElement('form');
                tempForm.method = 'POST';
                tempForm.action = GOOGLE_SCRIPT_URL;
                tempForm.target = 'hidden-iframe';
                
                const emailInput = document.createElement('input');
                emailInput.type = 'hidden';
                emailInput.name = 'email';
                emailInput.value = email;
                
                tempForm.appendChild(emailInput);
                document.body.appendChild(tempForm);
                
                // Submit the form
                tempForm.submit();
                
                // Wait a moment then check/cleanup
                setTimeout(function() {
                    document.body.removeChild(tempForm);
                    document.body.removeChild(iframe);
                    showMessage('Thank you for subscribing!', 'success');
                    form.reset();
                }, 1000);
                
            } catch (error) {
                debugError('Error:', error);
                showMessage('Sorry, there was an error. Please try again.', 'error');
            } finally {
                // Re-enable submit button after a delay
                setTimeout(function() {
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }, 1000);
            }
        });
    }

    function showMessage(message, type) {
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.style.display = 'block';
            messageElement.style.color = type === 'success' ? '#4CAF50' : '#f44336';
            
            // Hide message after 5 seconds
            setTimeout(function() {
                messageElement.style.display = 'none';
            }, 5000);
        }
    }
});

