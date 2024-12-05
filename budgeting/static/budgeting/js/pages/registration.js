import { getCookie } from '../utils.js';

const csrftoken = getCookie('csrftoken');

const registrationForm = document.getElementById('registration-form');

/**
 * Initializes the Registration page functionality.
 * - Handles the form submission via AJAX with CSRF token.
 */
export function initRegistration() {
    console.log('Initializing Registration Page');

    registrationForm.onsubmit = (event) => {

        event.preventDefault(); // Prevent default browser behavior
    
        const form = event.target; // Reference to the form element
    
        // Check if the form is valid
        if (!form.checkValidity()) {
            form.reportValidity(); // Show native validation tooltips
            return;
        }
    
        console.log("Form is valid. Preparing data...");
    
        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries()); // Converts to an object
    
        // Debug collected data
        console.log("Collected Data:", data);
    
        // Perform PUT request
        fetch('update_project', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            console.log("Server Response:", result); // Debug message
            if ('error' in result) {
                alert(`Error: ${result.error}`);
            } else {
                alert(`Message: ${result.message}`);
            }
        })
        .catch(error => console.error("Fetch Error:", error)); // Log fetch errors
    };
}