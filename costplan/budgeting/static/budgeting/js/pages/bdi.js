import { getCookie, formatBrazilianNumber, parseValue, sumInputs, updateCell } from '../utils.js';

const csrftoken = getCookie('csrftoken');

const bdiForm = document.querySelector('#bdi-form');


/**
 * Fetches BDI (Budgeted Difference Income) data from the server and updates the page.
 * - Calls `updateBdiTable` to populate the BDI table with fetched data.
 * - Calls `calculateAndUpdateBdi` to calculate initial BDI values dynamically.
 */
function getBdi() {
    fetch('api/get_bdi')
    .then(response => response.json())
    .then(data => {
        updateBdiTable(data);
        calculateAndUpdateBdi();
    })
    .catch(error => {
        console.error("Error fetching BDI data:", error);
    });
}


/**
 * Updates the BDI table with data fetched from the server.
 * @param {Array} data - Array of objects containing BDI item data.
 * - Each object should include `id` and `rate` properties.
 * - Updates input fields in the form with corresponding BDI rates.
 */
function updateBdiTable(data) {
    data.forEach(item => {
        const inputField = bdiForm.querySelector(`input[name="${item.id}"]`);
        if (inputField) {
            inputField.value = formatBrazilianNumber(parseFloat(item.rate.replace(",", ".")));
        } else {
            console.warn(`No input field found in BDI form for item: ${item.id}`);
        }
    });
}


/**
 * Dynamically calculates and updates BDI totals in the table.
 * - Computes subtotals for various BDI categories.
 * - Calculates partial and total BDI values.
 * - Updates the relevant table cells with the calculated values.
 */
const calculateAndUpdateBdi = () => {
    // Calculate subtotals
    const total1 = sumInputs(bdiForm, '1.');
    const total7 = sumInputs(bdiForm, '7.');
    const total2 = parseValue(bdiForm.querySelector('input[name="2.1"]').value);
    const total3 = parseValue(bdiForm.querySelector('input[name="3.1"]').value);
    const total4 = parseValue(bdiForm.querySelector('input[name="4.1"]').value);
    const total5 = parseValue(bdiForm.querySelector('input[name="5.1"]').value);
    const total6 = parseValue(bdiForm.querySelector('input[name="6.1"]').value);

    // Calculate partial and total BDI values
    const bdiPartial = total1 + total2 + total3 + total4 + total5 + total6;
    const bdiTotal = bdiPartial + total7;

    // Update table cells
    updateCell('bdi-1', total1);
    updateCell('bdi-2', total2);
    updateCell('bdi-3', total3);
    updateCell('bdi-4', total4);
    updateCell('bdi-5', total5);
    updateCell('bdi-6', total6);
    updateCell('bdi-7', total7);
    updateCell('bdi-partial', bdiPartial);
    updateCell('bdi-total', bdiTotal);
};


/**
 * Initializes the BDI page functionality.
 * - Handles the form submission via AJAX with CSRF token.
 * - Adds input listeners for real-time BDI calculations.
 * - Fetches initial BDI data to populate the form.
 */
export function initBdi() {
    console.log('Initializing BDI Page');

    // Handle form submission with AJAX
    bdiForm.onsubmit = (event) => {
        event.preventDefault();

        console.log('Form submission triggered');

        // Check if form is valid
        if (!bdiForm.checkValidity()) {
            bdiForm.reportValidity(); // Show native validation
            return;
        }

        // Collect form data and send PUT request
        const formData = new FormData(bdiForm);
        const data = Object.fromEntries(formData.entries()); // Converts to an object

        fetch('update_bdi', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((result) => {
                console.log('Server Response:', result);
                if ('error' in result) {
                    alert(`Error: ${result.error}`);
                } else {
                    alert(`Message: ${result.message}`);
                }
            })
            .catch((error) => console.error('Fetch Error:', error));
    };

    // Attach input listeners for dynamic calculations
    bdiForm.querySelectorAll('input').forEach((input) => {
        input.addEventListener('input', calculateAndUpdateBdi);
    });

    // Fetch and populate initial BDI data
    getBdi();
}
