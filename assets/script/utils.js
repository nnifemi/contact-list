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
            // Sort contacts alphabetically by name
            contacts.sort((a, b) => a.name.localeCompare(b.name));
            listContacts(contacts);
        })
        .catch(error => console.error('Error fetching contacts:', error));
}

const MAX_SAVABLE_CONTACTS = 6;

export function addContact() {
    const contactInfoInput = document.getElementById('contactInfo');
    const contactInfo = contactInfoInput.value.trim();

    // Ensure the input is a comma-separated string
    if (!contactInfo || !contactInfo.includes(',')) {
        alert('Invalid contact information format. Please use the format: Name, City, Email');
        return;
    }

    const [name, city, email] = contactInfo.split(',').map(item => item.trim());

    // Validate individual fields
    if (!name || !city || !email) {
        alert('Invalid contact information format. Please use the format: Name, City, Email');
        return;
    }

    // Validate the format of the name (should have a space between first and last name)
    const nameRegex = /^[a-zA-Z]+ [a-zA-Z]+$/;
    if (!nameRegex.test(name)) {
        alert('Invalid name format. Please use the format: First Last');
        return;
    }

    // Validate the format of the city (should have a space between parts)
    const cityRegex = /^[a-zA-Z]+ [a-zA-Z]+$/;
    if (!cityRegex.test(city)) {
        alert('Invalid city format. Please use the format: City Part');
        return;
    }

    // Validate the email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        alert('Invalid email address');
        return;
    }

    // Check the maximum number of savable contacts
    const contactDisplaySection = document.getElementById('contactDisplaySection');
    if (contactDisplaySection.childElementCount >= MAX_SAVABLE_CONTACTS) {
        alert('Maximum number of savable contacts reached (6)');
        return;
    }

    // Display the contact information in a div below the form
    displayContactInfo({ name, city, email });

    // Clear the form
    contactInfoInput.value = '';
}

function displayContactInfo(contact) {
    const contactDisplaySection = document.getElementById('contactDisplaySection');

    const contactDiv = document.createElement('div');
    contactDiv.classList.add('contact-grid-item');
    contactDiv.style.cursor = 'pointer';

    // Create three paragraphs for Name, City, and Email
    const nameParagraph = document.createElement('p');
    nameParagraph.innerHTML = `<strong>Name:</strong> ${contact.name}`;

    const cityParagraph = document.createElement('p');
    cityParagraph.innerHTML = `<strong>City:</strong> ${contact.city}`;

    const emailParagraph = document.createElement('p');
    emailParagraph.innerHTML = `<strong>Email:</strong> ${contact.email}`;

    // Append paragraphs to the contact div
    contactDiv.appendChild(nameParagraph);
    contactDiv.appendChild(cityParagraph);
    contactDiv.appendChild(emailParagraph);

    // Add "Click to delete" message
    const deleteMessage = document.createElement('p');
    deleteMessage.textContent = 'Click to delete';
    deleteMessage.classList.add('delete-message'); // Add the delete-message class
    deleteMessage.style.display = 'none'; // Initially hide the message

    contactDiv.appendChild(deleteMessage);

    // Add event listeners to show/hide the message on hover
    contactDiv.addEventListener('mouseover', () => {
        // Show the "Click to delete" message only on the current contact div
        deleteMessage.style.display = 'block';
    });

    contactDiv.addEventListener('mouseout', () => {
        // Hide the "Click to delete" message when mouse leaves the current contact div
        deleteMessage.style.display = 'none';
    });

    // Add click event listener to the contact div
    contactDiv.addEventListener('click', () => {
        // Call deleteContact with the contact div
        deleteContact(contactDiv);
    });

    // Append the contact div to the display section in alphabetical order
    const existingContacts = Array.from(contactDisplaySection.children);
    const insertIndex = findInsertIndex(existingContacts, contact.name);
    contactDisplaySection.insertBefore(contactDiv, existingContacts[insertIndex]);

    // Update the count of saved contacts
    updateContactCount(contactDisplaySection.childElementCount);
}

export function listContacts(contacts) {
    const contactsSection = document.getElementById('contactsSection');
    contactsSection.innerHTML = '';

    // Sort contacts alphabetically by name
    contacts.sort((a, b) => a.name.localeCompare(b.name));

    contacts.forEach((contact, index) => {
        const contactDiv = document.createElement('div');
        contactDiv.classList.add('contact');

        // Create three paragraphs for Name, City, and Email
        const nameParagraph = document.createElement('p');
        nameParagraph.textContent = `Name: ${contact.name}`;

        const cityParagraph = document.createElement('p');
        cityParagraph.textContent = `City: ${contact.city}`;

        const emailParagraph = document.createElement('p');
        emailParagraph.textContent = `Email: ${contact.email}`;

        // Append paragraphs to the contact div
        contactDiv.appendChild(nameParagraph);
        contactDiv.appendChild(cityParagraph);
        contactDiv.appendChild(emailParagraph);

        // Create a delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteContact(contactDiv);

        // Append delete button to the contact div
        contactDiv.appendChild(deleteBtn);

        // Append the contact div to the contacts section
        contactsSection.appendChild(contactDiv);
    });

    // Update the count of saved contacts
    updateContactCount(contacts.length);
}

// Add a function to update the contact count
function updateContactCount(count) {
    const contactCountElement = document.getElementById('contactCount');
    if (contactCountElement) {
        contactCountElement.textContent = `Saved Contacts: ${count}`;
    } else {
        // Create the element if it doesn't exist
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

    // Remove the grid item from the display section
    contactDiv.parentNode.removeChild(contactDiv);

    // Update the count of saved contacts
    const contactDisplaySection = document.getElementById('contactDisplaySection');
    updateContactCount(contactDisplaySection.childElementCount);
}

// Function to find the index to insert a new contact alphabetically
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
