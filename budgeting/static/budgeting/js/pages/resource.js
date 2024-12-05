import { updateResourceTable } from '../utils.js';

const body = document.getElementById('resource-tbody');

/**
 * Fetches Resource data from the server and updates the page.
 * - Calls `updateResourceTable` to populate the Resource table with fetched data.
 */
function getResources() {
    fetch('api/get_project_resource')
    .then(response => response.json())
    .then(data => {
        updateResourceTable(data, body);
    })
    .catch(error => {
        console.error("Error fetching BDI data:", error);
    });
}


/**
 * Initializes the Resource page functionality.
 * 
 * - Fetches Resource data to populate the table.
 */
export function initResource() {
    console.log('Initializing Resource Page');

    getResources()
}