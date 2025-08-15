document.addEventListener('DOMContentLoaded', function() {
    const verifyButton = document.getElementById('verify-button');
    if (verifyButton) {
        verifyButton.disabled = true;
    }

    // Function to handle successful CAPTCHA verification
    window.onCaptchaSuccess = function() {
        if (verifyButton) {
            verifyButton.disabled = false;
        }
    };

    // Function to handle CAPTCHA expiration
    window.onCaptchaExpired = function() {
        if (verifyButton) {
            verifyButton.disabled = true;
        }
    };

    // Function to handle CAPTCHA error
    window.onCaptchaError = function() {
        if (verifyButton) {
            verifyButton.disabled = true;
        }
    };

    // Handle form submission
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const captchaResponse = hcaptcha.getResponse();
            if (!captchaResponse) {
                alert('Please complete the CAPTCHA challenge');
                return;
            }

            try {
                const response = await fetch('/verify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ captchaResponse })
                });

                const data = await response.json();
                if (data.success) {
                    window.location.href = data.redirect;
                } else {
                    alert(data.message || 'Verification failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred during verification');
            }
        });
    }
}); 