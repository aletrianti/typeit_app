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

// If the "share" button is clicked, display a dialog in order to share a note
function shareNote() {
    const shareNoteDialog = document.getElementById("app-share-note-dialog-container");

    shareNoteDialog.classList.remove("hidden-note-form");
}

// Hide the "share note dialog" by clicking on the element with the "app-share-note-dialog-container" id
function hideDialog() {
    const shareNoteDialog = document.getElementById("app-share-note-dialog-container");

    shareNoteDialog.classList.add("hidden-note-form");
}

// Add emails to a list - share note
// function addEmailToList() {
    // const ul = document.getElementById("show-emails-list");
    // let inputValue = document.getElementById("add-participants").value;

    // const li = document.createElement("li");
    // const text = document.createTextNode(inputValue);

    // li.appendChild(text);
    // li.classList.add("show-emails-list-items");

    // let emailArray = [];

    // if (inputValue === "") {
        // console.log('meh');
    // } else {
        // Show the emails in a list
        // ul.appendChild(li);

        // const list = ul.getElementsByTagName("li");
        // console.log(list);
        // for (let item = 0; item < list.length; item++) {
        //     emailArray.push(i.innerText);
        //     console.log(i.innerText);
        // }
    // }
    // inputValue = "";

    // console.log(emailArray);

// }