const password = "471312";
let isEditorActive = false;
let currentPage = null;

// Check if user is logged in on page load
if (localStorage.getItem("editorLoggedIn") === "true") {
    isEditorActive = true;
    document.getElementById("editor-access").style.display = "block";
}
loadItems();

document.getElementById("editor-access").onclick = () => {
    if (!isEditorActive) {
        const input = prompt("Passwort eingeben:");
        if (input === password) {
            isEditorActive = true;
            localStorage.setItem("editorLoggedIn", "true");
            document.getElementById("editor-access").style.display = "block";
            document.getElementById("editor").style.display = "block";
            loadItems();
        } else {
            alert("Falsches Passwort, Boss!");
        }
    } else {
        document.getElementById("editor").style.display = "block";
        loadItems();
    }
};

function loadItems() {
    const items = JSON.parse(localStorage.getItem("items") || "[]");
    const listContainer = document.getElementById("list-container");
    const itemList = document.getElementById("item-list");
    listContainer.innerHTML = "";
    itemList.innerHTML = "";
    
    items.forEach((item, index) => {
        const li = document.createElement("li");
        li.textContent = item.name;
        li.onclick = () => showPage(index);
        listContainer.appendChild(li);
        
        if (isEditorActive) {
            const editorLi = document.createElement("li");
            editorLi.textContent = item.name;
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Löschen";
            deleteBtn.onclick = () => deleteItem(index);
            editorLi.appendChild(deleteBtn);
            itemList.appendChild(editorLi);
        }
    });
}

function addItem() {
    const newItemInput = document.getElementById("new-item");
    const name = newItemInput.value.trim();
    if (!name) return;
    
    const items = JSON.parse(localStorage.getItem("items") || "[]");
    items.push({ name, imageUrl: "", text: "", acc: "", pw: "" });
    localStorage.setItem("items", JSON.stringify(items));
    newItemInput.value = "";
    loadItems();
}

function deleteItem(index) {
    const items = JSON.parse(localStorage.getItem("items") || "[]");
    items.splice(index, 1);
    localStorage.setItem("items", JSON.stringify(items));
    loadItems();
}

function saveList() {
    isEditorActive = false;
    localStorage.setItem("editorLoggedIn", "false");
    document.getElementById("editor").style.display = "none";
    document.getElementById("editor-access").style.display = "none";
    loadItems();
}

function showPage(index) {
    currentPage = index;
    const items = JSON.parse(localStorage.getItem("items") || "[]");
    const item = items[index];
    document.getElementById("list-container").style.display = "none";
    document.getElementById("page-content").style.display = "block";
    document.getElementById("page-image").src = item.imageUrl || "https://via.placeholder.com/300";
    document.getElementById("page-text").textContent = item.text || "";
    document.getElementById("copy-acc").onclick = () => navigator.clipboard.writeText(item.acc || "");
    document.getElementById("copy-pw").onclick = () => navigator.clipboard.writeText(item.pw || "");
    
    if (isEditorActive) {
        document.getElementById("edit-page").style.display = "block";
        document.getElementById("edit-page").onclick = () => editPage(index);
    } else {
        document.getElementById("edit-page").style.display = "none";
    }
}

function editPage(index) {
    const items = JSON.parse(localStorage.getItem("items") || "[]");
    const item = items[index];
    document.getElementById("page-content").style.display = "none";
    document.getElementById("page-editor").style.display = "block";
    document.getElementById("edit-image-url").value = item.imageUrl || "";
    document.getElementById("edit-text").value = item.text || "";
    document.getElementById("edit-acc").value = item.acc || "";
    document.getElementById("edit-pw").value = item.pw || "";
}

function savePage() {
    const items = JSON.parse(localStorage.getItem("items") || "[]");
    items[currentPage] = {
        name: items[currentPage].name,
        imageUrl: document.getElementById("edit-image-url").value,
        text: document.getElementById("edit-text").value,
        acc: document.getElementById("edit-acc").value,
        pw: document.getElementById("edit-pw").value
    };
    localStorage.setItem("items", JSON.stringify(items));
    isEditorActive = false;
    localStorage.setItem("editorLoggedIn", "false");
    document.getElementById("page-editor").style.display = "none";
    document.getElementById("page-content").style.display = "block";
    document.getElementById("editor-access").style.display = "none";
    showPage(currentPage);
}
