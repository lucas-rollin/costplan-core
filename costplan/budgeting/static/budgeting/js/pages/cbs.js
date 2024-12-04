import { getCookie, formatBrazilianNumber, displayCostComposition, updateCbsTable, parseValue, updateCell } from '../utils.js';

const csrftoken = getCookie('csrftoken');
const cbsForm = document.querySelector('#cost-breakdown-sheet-form');

let projectTotal = 0;

/**
 * Fetches CBS (Cost Breakdown Sheet) data from the server and updates the page.
 * - Calls `updateCbsTable` to populate the CBS table with fetched data.
 */
function getCbs() {
    fetch('api/get_cbs')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        projectTotal = updateCbsTable(data, cbsForm); // Call the function to update the table
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
 * Calculates and updates the costs for a row and the project total.
 * 
 * @param {HTMLInputElement} inputCell - The input cell that triggered the calculation.
 */
function calculateAndUpdateCbs(inputCell) {
    const row = inputCell.parentElement.parentElement; // Get the row
    const quantity = parseValue(inputCell.value);

    const unitCostCell = row.querySelector(`[id^="cbs-uc"]`);
    const totalCostCell = row.querySelector(`[id^="cbs-tc"]`);

    const unitCost = parseValue(unitCostCell.innerHTML);

    const previousTotal = parseValue(totalCostCell.innerHTML); // Previous total for this row
    const newTotal = quantity * unitCost;

    // Update the total for this row
    updateCell(totalCostCell.id, newTotal);

    // Update the project total incrementally
    projectTotal += newTotal - previousTotal;

    // Update the project total display
    document.getElementById('total-cost-display').innerHTML = "R$ " + formatBrazilianNumber(projectTotal);
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
                    alert(`Message: ${result.message}`);
                }
            })
            .catch(error => console.error("Fetch Error:", error)); // Log fetch errors
    };

    // Fetch initial data and populate the table
    getCbs()
    

    // Add event listeners for each CBS item to open related Cost Composition
    document.querySelectorAll('.cbs-id').forEach((el) => {
        el.addEventListener('click', () => {
            
            const composition = el.innerHTML;
            const template = document.getElementById('template-select').value;

            load_cost_composition(template, composition);
        });
    });

    // Attach input listeners for dynamic calculations
    cbsForm.querySelectorAll('input').forEach((input) => {
        input.addEventListener('input', () => calculateAndUpdateCbs(input));
    });
}
