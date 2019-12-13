// events.js
// Frontend JavaScript file for DOM events

// If the "share" button is clicked, display a dialog in order to share a note
function shareNote() {
    const shareNoteDialog = document.getElementById("app-share-note-dialog-container");

    shareNoteDialog.classList.remove("hidden");
}

// Hide the "share note dialog" by clicking on the element with the "app-share-note-dialog-container" id
function hideDialog() {
    const shareNoteDialog = document.getElementById("app-share-note-dialog-container");

    shareNoteDialog.classList.add("hidden");
}

// Open the sidebar menu by clicking on the menu button
function openSidebarMenu() {
    const sidebarMenu = document.getElementById("app-notes-sidebar-wrapper");
    const burgerMenu = document.getElementById("app-note-sidebar-menu");

    sidebarMenu.classList.add("visible");
    burgerMenu.classList.add("hidden");
}

// Close the sidebar menu by clicking on the cross icon
function closeSidebarMenu() {
    const sidebarMenu = document.getElementById("app-notes-sidebar-wrapper");
    const burgerMenu = document.getElementById("app-note-sidebar-menu");

    sidebarMenu.classList.remove("visible");
    burgerMenu.classList.remove("hidden");
}

// Open the list by clicking on the icon
function toggleParticipantsList() {
    const participantsList = document.getElementById("show-participants-list");
    const participantsListBtn = document.getElementById("list-participants-button-icon");

    if (participantsList.classList.contains("hidden")) {
        participantsList.classList.remove("hidden");
        participantsListBtn.classList.add("rotated-icon");
    } else {
        participantsList.classList.add("hidden");
        participantsListBtn.classList.remove("rotated-icon");
    }
}

// // If the "delete" icon is clicked, display a dialog in order to delete a note
// function deleteNote() {
//     const deleteDialog = document.getElementById("delete-note-form");

//     deleteDialog.classList.remove("hidden");
// }

// // If the "delete" icon is clicked, display a dialog in order to delete a category
// function deleteCategory() {
//     const deleteDialog = document.getElementById("delete-category-form");

//     deleteDialog.classList.remove("hidden");
// }

// // Hide the "delete note dialog" by clicking on the element with the cancel button
// function hideDeleteNoteForm() {
//     const deleteDialog = document.getElementById("delete-note-form");

//     deleteDialog.classList.add("hidden");
// }

// // Hide the "delete category dialog" by clicking on the element with the cancel button
// function hideDeleteCategoryForm() {
//     const deleteDialog = document.getElementById("delete-category-form");

//     deleteDialog.classList.add("hidden");
// }