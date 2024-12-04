import { displayCostComposition } from '../utils.js';

/**
 * Fetches and displays a page with up to 10 cost calculations.
 * Also, displays a paginator for navigation.
 *
 * @param {string|number} page - The pagination page.
 */
export function load_cost_composition_all(page = 1) {
    const content = document.getElementById('cost-composition-all-content');
    content.innerHTML = ''; // Clear existing rows

    const template = document.getElementById('template-select').value;

    fetch(`api/cost_composition_all?template=${template}&page=${page}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);

            // Update paginator
            const paginator = document.getElementById('nav-paginator');
            paginator.innerHTML = ''; // Clear previous paginator content

            if (data.pagination.has_previous) {
                const prevBtn = document.createElement('li');
                prevBtn.classList.add('page-item');

                const prevLink = document.createElement('span');
                prevLink.classList.add('page-link', 'paginator');
                prevLink.textContent = 'Anterior';

                // Add event listener for previous button
                prevLink.addEventListener('click', () => load_cost_composition_all(page - 1));
                prevBtn.appendChild(prevLink);
                paginator.appendChild(prevBtn);
            }

            if (data.pagination.has_next) {
                const nextBtn = document.createElement('li');
                nextBtn.classList.add('page-item');

                const nextLink = document.createElement('span');
                nextLink.classList.add('page-link', 'paginator');
                nextLink.textContent = 'Próximo';

                // Add event listener for next button
                nextLink.addEventListener('click', () => load_cost_composition_all(page + 1));
                nextBtn.appendChild(nextLink);
                paginator.appendChild(nextBtn);
            }

            const fragment = document.createDocumentFragment();
            let itemCount = 0;

            // Populate tables with data
            data.data.forEach((item) => {
                itemCount++;

                // Create header table
                const headerTable = document.createElement('table');
                headerTable.classList.add('table');
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
                            <th>QDTE</th>
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
                            <th>QDTE</th>
                            <th>Custo Unitário (R$)</th>
                            <th>QDTE Total</th>
                            <th>Custo Total (R$)</th>
                        </tr>
                    </thead>
                    <tbody id="cost-composition-all-tbody-${itemCount}">
                    </tbody>
                `;

                const line = document.createElement('hr');
                line.classList.add('mb-4', 'mt-4');

                // Append tables to fragment
                fragment.appendChild(headerTable);
                fragment.appendChild(bodyTable);
                fragment.appendChild(line);

                // Get dynamically created tbody elements
                const headerBody = headerTable.querySelector(`#cost-composition-header-tbody-${itemCount}`);
                const body = bodyTable.querySelector(`#cost-composition-all-tbody-${itemCount}`);

                // Populate data into the header and body
                displayCostComposition(headerBody, body, item);
            });

            // Append the fragment to the content container
            content.append(fragment);
        })
        .catch((error) => {
            content.innerHTML = '<div>Failed to load data. Please try again.</div>';
            console.error('Error fetching Cost Composition data:', error);
        });
}

/**
 * Initializes the Cost Composition page functionality.
 * - Loads the first page.
 */
export function initCostCompositionAll() {
    console.log('Initializing Cost Composition All Page');

    // Fetch initial data and populate the table
    load_cost_composition_all(1);
}
