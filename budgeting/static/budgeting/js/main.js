// Handle sidebar and dropdown buttons toggle
const toggleButton = document.getElementById('toggle-btn');
const sidebar = document.getElementById('sidebar');


/**
 * Toggles the sidebar open/close state and ensures all submenus are closed.
 */
toggleButton.addEventListener('click', () => {
    sidebar.classList.toggle('close');
    toggleButton.classList.toggle('rotate');
})


// Import modular initialization functions for individual pages
import { initRegistration } from './pages/registration.js';
import { initCbs } from './pages/cbs.js';
import { initBdi } from './pages/bdi.js';
import { initCostComposition } from './pages/costComposition.js';
import { initCostCompositionAll } from './pages/costCompositionAll.js';
import { initResource } from './pages/resource.js';

/**
 * Mapping of page IDs to their respective initialization functions.
 * Add new pages and their corresponding initialization functions here.
 */
const pageFunctions = {
    "registration": initRegistration,
    "cost-breakdown-sheet": initCbs,
    "bdi": initBdi,
    "cost-composition": initCostComposition,
    "cost-composition-all": initCostCompositionAll,
    "resource": initResource
};


/**
 * Handles dynamic loading of pages based on the URL hash.
 * - Default page is 'registration'.
 * - Initializes the correct page using its associated function from `pageFunctions`.
 */
function loadPageFromHash() {
    const hash = location.hash.slice(1); // Remove the '#' from the hash

    const pageId = hash || 'registration'; // Default to 'registration'
    showPage(pageId);
    setActiveButton(pageId);
    triggerPageFunction(pageId);
}

// Attach event listener for hash changes
window.addEventListener('hashchange', loadPageFromHash);

// Initial page load
loadPageFromHash();


/**
 * Shows the correct page based on the page ID.
 * Hides all other pages to simulate single-page application behavior.
 * 
 * @param {string} pageId - ID of the page to display.
 */
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        if (page.id === pageId) {
            page.classList.remove('d-none');
        } else {
            page.classList.add('d-none');
        }
    });
}


/**
 * Sets the active state on the navigation button corresponding to the current page.
 * 
 * @param {string} pageId - ID of the current page.
 */
function setActiveButton(pageId) {
    const pageButtons = document.querySelectorAll('.page-button');
    pageButtons.forEach(button => {
        if (button.getAttribute('href').slice(1) === pageId) {
            button.parentElement.classList.add('active');
        } else {
            button.parentElement.classList.remove('active');
        }
    });
}


/**
 * Triggers the initialization function associated with the current page.
 * 
 * @param {string} pageId - ID of the page to initialize.
 */
function triggerPageFunction(pageId) {
    if (pageFunctions[pageId]) {
        pageFunctions[pageId](); // Call the associated function
    } else {
        console.warn(`No function associated with page: ${pageId}`);
    }
}


/**
 * Opens the report PDF in a new tab when the 'Generate PDF' button is clicked.
 */
const generatePdf = document.getElementById('generate-pdf')
generatePdf.addEventListener('click', () => {
    const url = generatePdf.dataset['url']
    window.open(url , '_blank').focus();
})