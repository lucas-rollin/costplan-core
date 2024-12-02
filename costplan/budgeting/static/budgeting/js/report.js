import { updateCbsTable } from './utils.js';

const cbsForm = document.getElementById('cost-breakdown-sheet-form'); 


/**
 * Update the CBS table after fetch request.
 * @returns the fetch promise for executing the following code only after the update is complete.
 */
async function getCbs() {
    return fetch('../../api/get_cbs') // Return the fetch promise
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
 * Call `getCbs` and wait for it to finish before printing.
 */
getCbs().then(() => {
    // Get current date and time
    var d = new Date();
    var date = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();

    // Insert date and time into HTML
    document.getElementById("datetime").innerHTML = `Data: ${date}`;

    // Print PDF 
    window.print();
});


/**
 * Close window after completion.
 */
window.onafterprint = function() {
    window.close();
};
