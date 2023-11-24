'use strict';

import { fetchContacts, addContact } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    fetchContacts();
});

document.getElementById('addContactBtn').addEventListener('click', () => {
    addContact();
});
