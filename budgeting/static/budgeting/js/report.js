import { updateCbsTable, updateResourceTable } from './utils.js';

const cbsForm = document.getElementById('cost-breakdown-sheet-form');
const resourceBody = document.getElementById('resource-tbody');

/**
 * Fetch and update the CBS table.
 * @returns {Promise<void>} Resolves after table update is complete.
 */
async function getCbs() {
    try {
        const response = await fetch('../../api/get_cbs');
        const data = await response.json();
        console.log(data);
        updateCbsTable(data, cbsForm);
    } catch (error) {
        console.error("Error fetching Cost Breakdown Sheet data:", error);
    }
}

/**
 * Fetch and update the Resource table.
 * @returns {Promise<void>} Resolves after table update is complete.
 */
async function getResources() {
    try {
        const response = await fetch('../../api/get_project_resource');
        const data = await response.json();
        updateResourceTable(data, resourceBody);
    } catch (error) {
        console.error("Error fetching Resource data:", error);
    }
}

/**
 * Main function to handle the sequence of operations.
 */
async function main() {
    try {
        // Wait for both getCbs and getResources to finish
        await getCbs();
        await getResources();

        // Get current date and time
        const d = new Date();
        const date = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;

        // Insert date and time into HTML
        document.getElementById("datetime").innerHTML = `Data: ${date}`;

        window.print();
    } catch (error) {
        console.error("Error during execution:", error);
    }
}

/**
 * Close window after printing.
 */
window.onafterprint = function () {
    window.close();
};

// Start the process
main();
