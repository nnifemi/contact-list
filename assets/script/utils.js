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
        .catch(error => console.error('Error fetching contacts:', error));
}

const MAX_SAVABLE_CONTACTS = 6;

export function addContact() {
    const contactInfoInput = document.getElementById('contactInfo');
    const contactInfo = contactInfoInput.value.trim();

    if (!contactInfo || !contactInfo.includes(',')) {
        alert('Invalid contact information format. Please use the format: Name, City, Email');
        return;
    }

    const [name, city, email] = contactInfo.split(',').map(item => item.trim());

    if (!name || !city || !email) {
        alert('Invalid contact information format. Please use the format: Name, City, Email');
        return;
    }

    const nameRegex = /^[a-zA-Z]+ [a-zA-Z]+$/;
    if (!nameRegex.test(name)) {
        alert('Invalid name format. Please use the format: First Last');
        return;
    }

    const cityRegex = /^[a-zA-Z]+ [a-zA-Z]+$/;
    if (!cityRegex.test(city)) {
        alert('Invalid city format. Please use the format: City Part');
        return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        alert('Invalid email address');
        return;
    }

    const contactDisplaySection = document.getElementById('contactDisplaySection');
    if (contactDisplaySection.childElementCount >= MAX_SAVABLE_CONTACTS) {
        alert('Maximum number of savable contacts reached (6)');
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

        clearMessage.textContent = 'Contacts cleared!';
        clearMessage.style.color = 'red';

        setTimeout(() => {
            clearMessage.textContent = 'Click Enter to clear all contacts';
            clearMessage.style.color = '';
        }, 3000);
    }
});
