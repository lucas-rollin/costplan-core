import { formatBrazilianNumber } from '../utils.js';

const tBody = document.getElementById('resource-tbody');

function getResources() {
    fetch('api/get_project_resource')
    .then(response => response.json())
    .then(data => {
        updateResourceTable(data);
    })
    .catch(error => {
        console.error("Error fetching BDI data:", error);
    });
}


function updateResourceTable(data) {

    const frag = document.createDocumentFragment();

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.unit}</td>
            <td>${formatBrazilianNumber(item.unit_cost)}</td>
            <td>${formatBrazilianNumber(item.quantity)}</td>
            <td>${formatBrazilianNumber(item.total_cost)}</td>
        `;
        frag.appendChild(row);
    });


    tBody.appendChild(frag)
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