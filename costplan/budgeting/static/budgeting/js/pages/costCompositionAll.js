import { displayCostComposition } from '../utils.js';


/**
 * Fetchs and displays a page with up to 10 cost calculations.
 * Also, displays a paginator for navigation.
 * 
 * @param {string|number} page - The pagination page.
 */
function load_cost_composition_all(page=1) {
    const content = document.getElementById('cost-composition-all-content');
    content.innerHTML = ''; // Clear existing rows
    
    const template = document.getElementById('template-select').value;

    fetch(`api/cost_composition_all?template=${template}&page=${page}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            // Update paginator
            const paginator = document.getElementById('nav-paginator');
            paginator.innerHTML = '';

            if (data.pagination.has_previous) {
                const prevBtn = document.createElement('li');
                prevBtn.classList.add('page-item');
                prevBtn.innerHTML = `
                    <span class="page-link paginator" onclick="load_cost_composition_all(${page - 1})">Anterior</span>
                `;
                paginator.appendChild(prevBtn);
            }

            if (data.pagination.has_next) {
                const nextBtn = document.createElement('li');
                nextBtn.classList.add('page-item');
                nextBtn.innerHTML = `
                    <span class="page-link paginator" onclick="load_cost_composition_all(${page + 1})">Próximo</span>
                `;
                paginator.appendChild(nextBtn);
            }

            const fragment = document.createDocumentFragment();
            let itemCount = 0;

            // Populate tables with data
            data.data.forEach(item => {
                itemCount++;

                // Create header table
                const headerTable = document.createElement('table');
                headerTable.classList.add('table', 'mb-0');
                headerTable.innerHTML = `
                    <colgroup>
                        <col style="width: 58%;">
                        <col style="width: 14%;">
                        <col style="width: 14%;">
                        <col style="width: 14%;">
                    </colgroup>
                    <thead class="table-header">
                        <tr>
                            <th>Descrição dos Serviços</th>
                            <th>Unidade</th>
                            <th>Quantidade</th>
                            <th>Item da PPU</th>
                        </tr>
                    </thead>
                    <tbody id="cost-composition-header-tbody-${itemCount}">
                    </tbody>
                `;

                // Create body table
                const bodyTable = document.createElement('table');
                bodyTable.classList.add('table');
                bodyTable.innerHTML = `
                    <colgroup>
                        <col style="width: 8%;">
                        <col style="width: 42%;">
                        <col style="width: 8%;">
                        <col style="width: 10%;">
                        <col style="width: 10%;">
                        <col style="width: 10%;">
                        <col style="width: 12%;">
                    </colgroup>
                    <thead class="table-header">
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>UN</th>
                            <th>Quantidade</th>
                            <th>Custo Unitário (R$)</th>
                            <th>Quantidade Total</th>
                            <th>Custo Total (R$)</th>
                        </tr>
                    </thead>
                    <tbody id="cost-composition-all-tbody-${itemCount}">
                    </tbody>
                `;
                const Line = document.createElement('hr');
                Line.classList.add('mb-4', 'mt-4')

                // Append tables to fragment first
                fragment.appendChild(headerTable);
                fragment.appendChild(bodyTable);
                fragment.appendChild(Line);

                // Get dynamically created tbody elements
                const headerBody = headerTable.querySelector(`#cost-composition-header-tbody-${itemCount}`);
                const body = bodyTable.querySelector(`#cost-composition-all-tbody-${itemCount}`);

                // Populate data into the header and body
                displayCostComposition(headerBody, body, item);
            });

            // Append the fragment to the content container
            content.append(fragment);
        })
        .catch(error => {
            content.innerHTML = '<div>Failed to load data. Please try again.</div>';
            console.error("Error fetching Cost Composition data:", error);
        });
}


/**
 * Initializes the Cost Composition page All functionality.
 * - Loads the first page.
 */
export function initCostCompositionAll() {
    console.log('Initializing BDI Page');

    // Fetch initial data and populate the table
    load_cost_composition_all(1);
}