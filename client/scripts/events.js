// events.js
// Frontend JavaScript file for DOM events

// If the "share" button is clicked, display a dialog in order to share a note
function shareNote() {
    const shareNoteDialog = document.getElementById("app-share-note-dialog-container");

    shareNoteDialog.classList.remove("hidden-form");
}

// Hide the "share note dialog" by clicking on the element with the "app-share-note-dialog-container" id
function hideDialog() {
    const shareNoteDialog = document.getElementById("app-share-note-dialog-container");

    shareNoteDialog.classList.add("hidden-form");
}

// // If the "delete" icon is clicked, display a dialog in order to delete a note
// function deleteNote() {
//     const deleteDialog = document.getElementById("delete-note-form");

//     deleteDialog.classList.remove("hidden-form");
// }

// // If the "delete" icon is clicked, display a dialog in order to delete a category
// function deleteCategory() {
//     const deleteDialog = document.getElementById("delete-category-form");

//     deleteDialog.classList.remove("hidden-form");
// }

// // Hide the "delete note dialog" by clicking on the element with the cancel button
// function hideDeleteNoteForm() {
//     const deleteDialog = document.getElementById("delete-note-form");

//     deleteDialog.classList.add("hidden-form");
// }

// // Hide the "delete category dialog" by clicking on the element with the cancel button
// function hideDeleteCategoryForm() {
//     const deleteDialog = document.getElementById("delete-category-form");

//     deleteDialog.classList.add("hidden-form");
// }