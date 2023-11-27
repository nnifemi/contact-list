'use strict';

import Contact from './contact.js';

export function validateEmail(email) {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
}

export function fetchContacts() {
    fetch('/contacts')
        .then(response => response.json())
        .then(contacts => {
            contacts.sort((a, b) => a.name.localeCompare(b.name));
            listContacts(contacts);
        })
        .catch(error => {
            console.error('Error fetching contacts:', error);
            displayMessage('Error fetching contacts. Please try again later.', 'error');
        });
}

const MAX_SAVABLE_CONTACTS = 6;

export function addContact() {
    const contactInfoInput = document.getElementById('contactInfo');
    const contactInfo = contactInfoInput.value.trim();

    if (!contactInfo || !contactInfo.includes(',')) {
        displayMessage('Invalid contact information format. Please use the format: Name, City, Email', 'error');
        return;
    }

    const [name, city, email] = contactInfo.split(',').map(item => item.trim());

    if (!name || !city || !email) {
        displayMessage('Invalid contact information format. Please use the format: Name, City, Email', 'error');
        return;
    }

    const nameRegex = /^[a-zA-Z]+ [a-zA-Z]+$/;
    if (!nameRegex.test(name)) {
        displayMessage('Invalid name format. Please use the format: First Last', 'error');
        return;
    }

    const cityRegex = /^[a-zA-Z]+ [a-zA-Z]+$/;
    if (!cityRegex.test(city)) {
        displayMessage('Invalid city format. Please use the format: City Part', 'error');
        return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        displayMessage('Invalid email address', 'error');
        return;
    }

    const contactDisplaySection = document.getElementById('contactDisplaySection');
    if (contactDisplaySection.childElementCount >= MAX_SAVABLE_CONTACTS) {
        displayMessage('Maximum number of savable contacts reached (6)', 'error');
        return;
    }

    displayContactInfo({ name, city, email });
    contactInfoInput.value = '';
}

function displayContactInfo(contact) {
    const contactDisplaySection = document.getElementById('contactDisplaySection');

    const contactDiv = document.createElement('div');
    contactDiv.classList.add('contact-grid-item');
    contactDiv.style.cursor = 'pointer';

    const nameParagraph = document.createElement('p');
    nameParagraph.innerHTML = `<strong>Name:</strong> ${contact.name}`;

    const cityParagraph = document.createElement('p');
    cityParagraph.innerHTML = `<strong>City:</strong> ${contact.city}`;

    const emailParagraph = document.createElement('p');
    emailParagraph.innerHTML = `<strong>Email:</strong> ${contact.email}`;

    contactDiv.appendChild(nameParagraph);
    contactDiv.appendChild(cityParagraph);
    contactDiv.appendChild(emailParagraph);

    const deleteMessage = document.createElement('p');
    deleteMessage.textContent = 'Click to delete';
    deleteMessage.classList.add('delete-message');
    deleteMessage.style.display = 'none';

    contactDiv.appendChild(deleteMessage);

    contactDiv.addEventListener('mouseover', () => {
        deleteMessage.style.display = 'block';
    });

    contactDiv.addEventListener('mouseout', () => {
        deleteMessage.style.display = 'none';
    });

    contactDiv.addEventListener('click', () => {
        deleteContact(contactDiv);
    });

    const existingContacts = Array.from(contactDisplaySection.children);
    const insertIndex = findInsertIndex(existingContacts, contact.name);
    contactDisplaySection.insertBefore(contactDiv, existingContacts[insertIndex]);

    updateContactCount(contactDisplaySection.childElementCount);
}

function displayMessage(message, messageType) {
    const messageContainer = document.getElementById('messageContainer');
    const messageDiv = document.createElement('div');

    messageDiv.textContent = message;
    messageDiv.classList.add(messageType);

    messageContainer.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

export function listContacts(contacts) {
    const contactsSection = document.getElementById('contactsSection');
    contactsSection.innerHTML = '';

    contacts.sort((a, b) => a.name.localeCompare(b.name));

    contacts.forEach((contact, index) => {
        const contactDiv = document.createElement('div');
        contactDiv.classList.add('contact');

        const nameParagraph = document.createElement('p');
        nameParagraph.textContent = `Name: ${contact.name}`;

        const cityParagraph = document.createElement('p');
        cityParagraph.textContent = `City: ${contact.city}`;

        const emailParagraph = document.createElement('p');
        emailParagraph.textContent = `Email: ${contact.email}`;

        contactDiv.appendChild(nameParagraph);
        contactDiv.appendChild(cityParagraph);
        contactDiv.appendChild(emailParagraph);

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteContact(contactDiv);

        contactDiv.appendChild(deleteBtn);
        contactsSection.appendChild(contactDiv);
    });

    updateContactCount(contacts.length);
}

function updateContactCount(count) {
    const contactCountElement = document.getElementById('contactCount');
    if (contactCountElement) {
        contactCountElement.textContent = `Saved Contacts: ${count}`;
    } else {
        const countElement = document.createElement('div');
        countElement.id = 'contactCount';
        countElement.textContent = `Saved Contacts: ${count}`;
        countElement.style.position = 'fixed';
        countElement.style.bottom = '10px';
        countElement.style.right = '10px';
        countElement.style.background = 'rgba(255, 255, 255, 0.8)';
        countElement.style.padding = '5px';
        document.body.appendChild(countElement);
    }
}

export function deleteContact(contactDiv) {
    console.log('Deleting contact');
    contactDiv.parentNode.removeChild(contactDiv);

    const contactDisplaySection = document.getElementById('contactDisplaySection');
    updateContactCount(contactDisplaySection.childElementCount);
}

function findInsertIndex(existingContacts, newName) {
    let insertIndex = 0;
    for (let i = 0; i < existingContacts.length; i++) {
        const name = existingContacts[i].querySelector('p').textContent.split(': ')[1];
        if (name.localeCompare(newName) <= 0) {
            insertIndex = i + 1;
        } else {
            break;
        }
    }
    return insertIndex;
}

document.addEventListener('DOMContentLoaded', () => {
    const clearMessage = document.getElementById('clearMessage');

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            clearContacts();
        }
    });

    function clearContacts() {
        const contactDisplaySection = document.getElementById('contactDisplaySection');
        contactDisplaySection.innerHTML = '';

        displayMessage('Contacts cleared!', 'success');

        setTimeout(() => {
            clearMessage.textContent = 'Click Enter to clear all contacts';
        }, 3000);
    }
});
