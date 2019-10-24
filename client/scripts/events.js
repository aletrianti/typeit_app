// events.js
// Frontend JavaScript file for DOM events

// If the span element with the "add-note" id is clicked ......
function addNewNote() {
    // Write something...
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