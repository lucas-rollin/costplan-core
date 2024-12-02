import { getCookie, sumInputs, updateCell } from '../utils.js';

const csrftoken = getCookie('csrftoken');

const chargesForm = document.getElementById('charges-form');

/**
 * Calculate table Subtotals and Total and update corresponding cells.
 * - Calls `sumInputs` to sum via name prefix.
 * - Calls `updateCell` to update the cell with total.
 */
const calculateAndUpdateCharges = () => {
    // Calculate subtotals
    const totalA = sumInputs(chargesForm, 'A')
    const totalB = sumInputs(chargesForm, 'B')
    const totalC = sumInputs(chargesForm, 'C')
    const totalD = sumInputs(chargesForm, 'D')

    // Calculate partial and total BDI
    const chargesTotal = totalA + totalB + totalC + totalD;

    // Update table cells
    updateCell('charges-group-A', totalA)
    updateCell('charges-group-B', totalB)
    updateCell('charges-group-C', totalC)
    updateCell('charges-group-D', totalD)
    updateCell('charges-total', chargesTotal)
}

/**
 * Initializes the Charges page functionality.
 * - Handles the form submission via AJAX with CSRF token.
 * - Attach input listeners for dynamic calculations of Totals.
 */
export function initCharges() {
    console.log('Initializing Charges Page');

    // Attach the submit handler
    chargesForm.onsubmit = (event => {
        console.log("Form submission triggered"); // Debug message
    
        event.preventDefault(); // Prevent default browser behavior
    
        const form = event.target; // Reference to the form element
    
        // Check if the form is valid
        if (!form.checkValidity()) {
            form.reportValidity(); // Show native validation tooltips
            console.log("Form validation failed"); // Debug message
            return;
        }
    
        console.log("Form is valid. Preparing data...");
    
        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries()); // Converts to an object
    
        // Debug collected data
        console.log("Collected Data:", data);
    
        // Perform PUT request
        fetch('update_charges', {
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
    });
    
    // Attach input listeners for dynamic calculations
    chargesForm.querySelectorAll('input').forEach((input) => {
        input.addEventListener('input', calculateAndUpdateCharges);
    });
}