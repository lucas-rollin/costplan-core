import { getCookie, displayCostComposition, updateCbsTable } from '../utils.js';

const csrftoken = getCookie('csrftoken');
const cbsForm = document.querySelector('#cost-breakdown-sheet-form');

/**
 * Fetches CBS (Cost Breakdown Sheet) data from the server and updates the page.
 * - Calls `updateCbsTable` to populate the CBS table with fetched data.
 */
function getCbs() {
    fetch('api/get_cbs')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        updateCbsTable(data, cbsForm); // Call the function to update the table
    })
    .catch(error => {
        console.error("Error fetching Cost Breakdown Sheet data:", error);
    });
}

/**
 * Fetches and displays Cost Composition data for a selected CBS item.
 * @param {number|string} template - The template ID (must be a number or string that can be parsed).
 * @param {string} composition - The composition identifier, typically retrieved from innerHTML.
 */
function load_cost_composition(template, composition) {

    fetch(`api/cost_composition?template=${template}&composition=${composition}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const body = document.getElementById('cost-composition-tbody');
            const headerBody = document.getElementById('cost-composition-header-tbody');

            // Populate the tables with the fetched data
            displayCostComposition(headerBody, body, data.data, data.can_edit);

            // Ensure tables are visible
            body.parentElement.classList.remove('d-none');
            headerBody.parentElement.classList.remove('d-none');

            // Handle view logic
            window.location.hash = '#cost-composition';
        })
        .catch(error => {
            console.error("Error fetching Cost Composition data:", error);
        });
}

/**
 * Initializes the CBS page functionality.
 * - Handles the form submission via AJAX with CSRF token.
 * - Fetches initial CBS data to populate the form.
 * - Sets up event listeners for clicking CBS items.
 */
export function initCbs() {
    console.log('Initializing CBS Page');

    // Handle form submission with AJAX
    cbsForm.onsubmit = (event) => {
        event.preventDefault();

        const form = event.target;

        // Check if form is valid
        if (!form.checkValidity()) {
            form.reportValidity(); // Show native validation
            return;
        }

        console.log("Form is valid. Preparing data...");

        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries()); // Converts to an object

        // Debug collected data
        console.log("Collected Data:", data);

        // Perform PUT request
        fetch('update_cbs', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(result => {
                console.log("Server Response:", result); // Debug message
                if ('error' in result) {
                    alert(`Error: ${result.error}`);
                } else {
                    getCbs();
                }
            })
            .catch(error => console.error("Fetch Error:", error)); // Log fetch errors
    };

    // Fetch initial data and populate the table
    getCbs();

    // Add event listeners for each CBS item to open related Cost Composition
    document.querySelectorAll('.cbs-id').forEach((el) => {
        el.addEventListener('click', () => {
            
            const composition = el.innerHTML;
            const template = document.getElementById('template-select').value;

            load_cost_composition(template, composition);
        });
    });
}
