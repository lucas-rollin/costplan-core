import { getCookie } from './utils.js';

const csrftoken = getCookie('csrftoken');

const NewProjectForm = document.getElementById('new-project-form')
console.log(NewProjectForm)

/**
 * Handle project creation submission with AJAX
 * @returns {false} to prevent default submission
 */
NewProjectForm.onsubmit = () => {
  // Get the form fields
  const code = NewProjectForm.elements['code'].value;
  const name = NewProjectForm.elements['name'].value;

  // POST request to create a project
  fetch('/project', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken
    },
    body: JSON.stringify({
      code: code,
      name: name
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
      const cancelButton = document.querySelector('#new-project .btn-secondary');

      // Check if the cancel button exists and simulate a click
      if (cancelButton) {
        cancelButton.click();
      }
      
      // Add project to table
      add_project(result.project_id, code, name, new Date().toLocaleDateString("pt-BR"))
    }
  });

  return false; // Prevent default form submission
}


/**
 * Adds a new project to table.
 * 
 * @param {number} project_id - The project ID.
 * @param {number} code - The project code.
 * @param {string} name - The project name.
 * @param {date} date - The project creation date.
 */
function add_project(project_id, code, name, date) {
  // Create a new row for the project
  const newRow = document.createElement('div');
  newRow.className = 'row gap-2 border rounded py-2 project-row';

  newRow.innerHTML = `
    <div class="col d-flex justify-content-center align-items-center">
      <div>${code}</div>
    </div>
    <div class="col d-flex justify-content-center align-items-center">
      <div>${name}</div>
    </div>
    <div class="col d-flex justify-content-center align-items-center">
      <div>${date}</div>
    </div>
    <div class="col-1 d-flex justify-content-center align-items-center">
      <div class="fs-5 text-danger generate-pdf ptr" onclick="(window.open('\/pdf\/report\/${project_id}' , '_blank').focus())">
        <i class="fa-solid fa-file-pdf"></i>
      </div>
    </div>
    <div class="col-1 d-flex justify-content-center align-items-center">
      <form action="/" method="POST" class="m-0">
        <input type="hidden" name="csrfmiddlewaretoken" value="${csrftoken}" />
        <input type="hidden" name="project_id" value="${project_id}" />
        <button type="submit" class="btn btn-link p-0 text-dark">
          <i class="fa-solid fa-pen-to-square fs-5"></i>
        </button>
      </form>
    </div>
  `;

  // Append the new row to the project list
  document.querySelector('#project-table').appendChild(newRow);
}


/**
 * Add event listeners to each project PDF icon to open the report page.
 */
const PdfButtons = document.querySelectorAll('.generate-pdf')
PdfButtons.forEach(generatePdf => {
  generatePdf.addEventListener('click', () => {
    const url = generatePdf.dataset['url']
    window.open(url , '_blank').focus();
  })
});