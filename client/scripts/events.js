// events.js
// Frontend JavaScript file for DOM events

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

// If the "share" button is clicked...
function shareNote() {
    const shareNoteDialog = document.getElementById("app-share-note-dialog-container");

    shareNoteDialog.classList.remove("hidden-note-form");
}

function hideDialog() {
    const shareNoteDialog = document.getElementById("app-share-note-dialog-container");

    shareNoteDialog.classList.add("hidden-note-form");
}