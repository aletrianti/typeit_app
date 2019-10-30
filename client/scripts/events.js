// events.js
// Frontend JavaScript file for DOM events

// If the span element with the "add-note" id is clicked, display a form in order to add a note
function addNewNote() {
    const newNoteForm = document.getElementById("app-dashboard-container-create-note");

    newNoteForm.classList.remove("hidden-note-form");
}

// Hide the "create note form" by clicking on the element with the "hidden-note-form" id
function hideNoteForm() {
    const newNoteForm = document.getElementById("app-dashboard-container-create-note");

    newNoteForm.classList.add("hidden-note-form");
}

// If the span element with the "add-category" id is clicked, display a form in order to add a category
function addNewCategory() {
    const newCategoryForm = document.getElementById("new-category-form");

    newCategoryForm.classList.remove("hidden-category-form");
}

// Hide the "create category form" by clicking on the element with the "hide-category-form" id
function hideCategoryForm() {
    const newCategoryForm = document.getElementById("new-category-form");

    newCategoryForm.classList.add("hidden-category-form");
}

// If the element with the "app-dashboard-container-edit-note" is clicked, remove the "hidden-note-form" from that element
function openNote() {
    const editNoteForm = document.getElementById("app-dashboard-container-edit-note");

    editNoteForm.classList.remove("hidden-note-form");
}

// If the "share" button is clicked...
function shareNote() {
    const shareNoteDialog = document.getElementById("app-share-note-dialog-container");

    shareNoteDialog.classList.remove("hidden-note-form");
}

function hideDialog() {
    const shareNoteDialog = document.getElementById("app-share-note-dialog-container");

    shareNoteDialog.classList.add("hidden-note-form");
}