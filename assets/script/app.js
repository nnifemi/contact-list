'use strict';

// Import individual functions from utils.js
import { fetchContacts, addContact } from './utils.js';

// Or import everything as an object and use it as needed
// import * as utils from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    fetchContacts();
});

document.getElementById('addContactBtn').addEventListener('click', () => {
    addContact();
});
