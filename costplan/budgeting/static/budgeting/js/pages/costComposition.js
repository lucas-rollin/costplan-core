import { getCookie, displayCostComposition } from '../utils.js';

const csrftoken = getCookie('csrftoken');

const costCompositionForm = document.getElementById('cost-composition-form');

const NewTemplateForm = document.getElementById('new-template');

const costCompositionEditForm = document.getElementById('cost-composition-edit-form');

/**
 * Adds template to all template selection elements.
 * 
 * @param {string|number} template_id - New template ID.
 * @param {string} name - New template name.
 */
function add_template(template_id, name) {
    const elements = document.querySelectorAll('.template-select');
    console.log(elements)
    elements.forEach(item => {
        const option = document.createElement('option');
        option.value = template_id;
        option.innerHTML = name;
        item.appendChild(option);
    });
}


/**
 * Initializes the Cost Composition page functionality.
 * 
 * This function sets up event listeners for:
 * - Submitting the cost composition search form to fetch and display data.
 * - Creating new templates via an AJAX POST request.
 * - Updating cost composition data via an AJAX PUT request.
 */
export function initCostComposition() {
    console.log('Initializing Cost Composition Page');

    // Attach the submit handler to GET Cost Composition
    costCompositionForm.onsubmit = (event) => {

        event.preventDefault(); // Prevent default browser behavior
    
        const form = event.target; // Reference to the form element
    
        // Check if the form is valid
        if (!form.checkValidity()) {
            form.reportValidity(); // Show native validation tooltips
            return;
        }
        
        const template = form.querySelector(`select[name="template"]`).value;
        const composition = form.querySelector(`select[name="composition"]`).value;
    
        fetch(`api/cost_composition?template=${template}&composition=${composition}`)
        .then(response => response.json())
        .then(data => {
            console.log(data); // Call the function to update the table
            const body = document.getElementById('cost-composition-tbody');
            const headerBody = document.getElementById('cost-composition-header-tbody');
        
            displayCostComposition(headerBody, body, data.data, data.can_edit);
        
            body.parentElement.classList.remove('d-none');
            headerBody.parentElement.classList.remove('d-none');
        })
        .catch(error => {
            console.error("Error fetching Cost Composition data:", error);
        });
    }

    // Attach the submit handler to Create new Template
    NewTemplateForm.onsubmit = (event) => {
    
        event.preventDefault();
    
        // Get the form fields
        const name = NewTemplateForm.querySelector('input').value;
        const baseTemplate = NewTemplateForm.querySelector('select').value;
        const description = NewTemplateForm.querySelector('textarea').value;
    
        // POST request to create a template
        fetch('/template', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                name: name,
                base_template: baseTemplate,
                description: description
            })
        })
        .then(response => response.json())
        .then(result => {
            // Alert message or error
            console.log(result);
            if ('error' in result) {
            alert(`Error: ${result.error}`);
            } else {
            alert(`Message: ${result.message}`);
    
            // Select the cancel button within the modal
            const cancelButton = document.querySelector('#new-template .btn-secondary');
    
            // Check if the cancel button exists and simulate a click
            if (cancelButton) {
                cancelButton.click();
            }
            
            // Add template to all template-select elements
            add_template(result.template_id, name)
            }
        });
    }

    // Attach the submit event handler to Update Cost Composition
    costCompositionEditForm.onsubmit = (event) => {

        event.preventDefault(); // Prevent default browser behavior
    
        const form = event.target; // Reference to the form element
    
        // Check if the form is valid
        if (!form.checkValidity()) {
            form.reportValidity(); // Show native validation tooltips
            return;
        }

        const template = costCompositionForm.querySelector(`select[name="template"]`).value;
        const composition = costCompositionForm.querySelector(`select[name="composition"]`).value;
        
        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries()); // Converts to an object

        // Debug collected data
        console.log("Collected Data:", data);
    
        // Perform PUT request
        fetch(`update_composition/${template}/${composition}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify(data)
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
    }
}