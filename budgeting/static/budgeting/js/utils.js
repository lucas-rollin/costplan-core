/**
 * Retrieve CSRF protection token from browser cookies.
 * 
 * From Django Documentation: https://docs.djangoproject.com/en/5.1/howto/csrf/
 * @param {string} name - The CSRF token header name.
 * @returns {string|null} The CSRF token if found, otherwise null.
 */
export function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');


/**
 * Formats a number to the Brazilian currency format.
 * 
 * @param {number} value - The number to format.
 * @returns {string} Formatted string in Brazilian currency format (e.g., "1.234,56").
 */
export function formatBrazilianNumber(value) {
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true
    }).format(value);
}


/**
 * Populates the Cost Composition table with data.
 * 
 * @param {HTMLElement} headerBody - The header body element to update.
 * @param {HTMLElement} body - The main table body element to update.
 * @param {Object} data - The data object containing `header` and `items` for the composition.
 * @param {boolean} [can_edit=false] - Determines if the table allows editing quantities.
 */
export function displayCostComposition(headerBody, body, data, can_edit=false) {
    // Clear existing content
    headerBody.innerHTML = '';
    body.innerHTML = '';

    // Use DocumentFragment for performance
    const headerFragment = document.createDocumentFragment();
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <td>${data.header.name}</td>
        <td>${data.header.unit}</td>
        <td>${formatBrazilianNumber(data.header.quantity)}</td>
        <td>${data.header.id}</td>
    `;
    headerFragment.appendChild(headerRow);
    headerBody.appendChild(headerFragment);

    const fragment = document.createDocumentFragment();

    // Add rows to the fragment
    data.items.forEach(item => {
        const row = document.createElement('tr');
        const quantity = item.quantity ? formatBrazilianNumber(item.quantity) : "";

        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.unit}</td>
            ${can_edit ?
                `<td class="input">
                    <input type="text" class="form-control" name="${item.id}" value="${quantity}" 
                    aria-label="Quantidade de ${item.name} (ID: ${item.id})">
                </td>`
                : `<td>${quantity}</td>`
            }
            <td>${item.unit_cost ? formatBrazilianNumber(item.unit_cost) : ""}</td>
            <td>${item.project_quantity ? formatBrazilianNumber(item.project_quantity) : ""}</td>
            <td>${item.total_cost ? formatBrazilianNumber(item.total_cost) : ""}</td>
        `;
        fragment.appendChild(row);
    });

    // Add footer rows to the fragment
    const footerRows = [
        `
        <td colspan="6" class="text-start">Preço Unitário SEM BDI</td>
        <td class="text-center">${formatBrazilianNumber(data.header.unit_cost)}</td>
        `,
        `
        <td colspan="6" class="text-start">Total de Custos SEM BDI</td>
        <td class="text-center">${formatBrazilianNumber(data.header.total_cost)}</td>
        `,
        `
        <td colspan="4" class="text-start">TOTAL DE CUSTOS DIRETOS COM BDI</td>
        <td colspan="2" class="text-center">BDI: ${formatBrazilianNumber(data.header.bdi)} %</td>
        <td>${formatBrazilianNumber(data.header.total_cost_bdi)}</td>
        `
    ];

    footerRows.forEach(rowContent => {
        const footerRow = document.createElement('tr');
        footerRow.classList.add('bg-gray');
        footerRow.innerHTML = rowContent;
        fragment.appendChild(footerRow);
    });

    const buttonContainer = document.getElementById('cost-composition-edit-button');
    if (buttonContainer) {  
        if (can_edit) {
            buttonContainer.classList.remove('d-none'); // Show button
        } else {
            buttonContainer.classList.add('d-none'); // Hide button
        }
    }

    // Append fragment to body
    body.appendChild(fragment);
}


/**
 * Parses a value from a string to a float, handling localization (e.g., comma as a decimal separator).
 * 
 * @param {string} value - The string value to parse.
 * @returns {number} Parsed float value, or 0 if parsing fails.
 */
export const parseValue = (value) => parseFloat(value.replaceAll('.', '').replace(',', '.')) || 0;


/**
 * Sums all input values in a form that match a specific name prefix.
 * 
 * @param {HTMLFormElement} form - The form containing the inputs.
 * @param {string} prefix - The prefix to match input names.
 * @returns {number} The total sum of matching input values.
 */
export const sumInputs = (form, prefix) => {
    const inputs = form.querySelectorAll(`input[name^="${prefix}"]`);
    return Array.from(inputs).reduce((total, input) => total + parseValue(input.value), 0);
};


/**
 * Updates a table cell with a new value.
 * 
 * @param {string} cellId - The ID of the cell to update.
 * @param {number} value - The new value to display.
 */
export const updateCell = (cellId, value) => {
    const cell = document.getElementById(cellId);
    if (cell) {
        cell.textContent = formatBrazilianNumber(value);
    }
};


/**
 * Updates the Cost Breakdown Sheet (CBS) table with data.
 * 
 * @param {Object[]} data - Array of objects containing CBS item data.
 * @param {HTMLFormElement} cbsForm - The form element containing CBS-related inputs.
 * @returns {number} The project Total cost.
 */
export function updateCbsTable(data, cbsForm) {
    let totalCostSum = 0;

    data.forEach(item => {
        // Find the input field within the form using the name attribute
        const inputField = cbsForm.querySelector(`input[name="${item.id}"]`);
        if (inputField) {
            // Update the input field value with the quantity
            inputField.value = formatBrazilianNumber(item.quantity.replace(",", ".")); // Format as a number
            
            // Find the parent <tr> of the input field
            const row = inputField.closest('tr');
            if (row) {
                // Select the appropriate <td> elements for unit_cost and total_cost
                const unitCostCell = row.children[4];
                const totalCostCell = row.children[5];

                // Update their content with the data from the JSON
                unitCostCell.innerHTML = formatBrazilianNumber(item.unit_cost);
                totalCostCell.innerHTML = formatBrazilianNumber(item.total_cost);

                const totalCost = parseFloat(item.total_cost.replace(",", "."));
                totalCostSum += totalCost;
            }
        } else {
            console.warn(`No input field found in CBS form for item: ${item.id}`);
        }
    });

    document.getElementById('total-cost-display').innerHTML = "R$ " + formatBrazilianNumber(totalCostSum);
    return totalCostSum
}

/**
 * Populates the Resource Table with fetched data.
 * 
 * @param {Object[]} data - Array of objects containing Resource item data.
 * @param {HTMLElement} body - The table body for row insertions.
 */
export function updateResourceTable(data, body) {
    body.innerHTML = ''

    // Use DocumentFragment for performance
    const fragment = document.createDocumentFragment();

    // Add rows to the fragmnet
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.unit}</td>
            <td>${formatBrazilianNumber(item.quantity)}</td>
            <td>${formatBrazilianNumber(item.unit_cost)}</td>
            <td>${formatBrazilianNumber(item.total_cost)}</td>
        `;
        fragment.appendChild(row);
    });

    // Append fragment to body
    body.appendChild(fragment)
}