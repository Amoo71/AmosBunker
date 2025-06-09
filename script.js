const password = "471312";
const vaultCode = ["13", "12", "47", "13"];
let currentVaultInput = [];
let isEditorActive = false;
let currentPage = null;

// Vault lock logic
let rotation = 0;
const dial = document.getElementById("vault-dial");
const codeDisplay = document.getElementById("vault-code-display");

document.getElementById("vault-dial").addEventListener("mousedown", startRotate);
document.addEventListener("mousemove", rotateDial);
document.addEventListener("mouseup", stopRotate);
document.getElementById("vault-dial").addEventListener("touchstart", startRotate);
document.addEventListener("touchmove", rotateDial);
document.addEventListener("touchend", stopRotate);

let isRotating = false;

function startRotate(e) {
    isRotating = true;
    e.preventDefault();
}

function rotateDial(e) {
    if (!isRotating) return;
    const rect = dial.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    const angle = Math.atan2(clientY - centerY, clientX - centerX) * 180 / Math.PI;
    rotation = (angle + 360) % 360;
    const value = Math.round(rotation / 3.6); // Map 0-360° to 0-99
    dial.style.transform = `rotate(${rotation}deg)`;
    codeDisplay.textContent = value;
}

function stopRotate() {
    isRotating = false;
}

function submitVaultCode() {
    const value = Math.round(rotation / 3.6);
    currentVaultInput.push(value.toString());
    if (currentVaultInput.length < vaultCode.length) {
        rotation = 0;
        dial.style.transform = `rotate(0deg)`;
        codeDisplay.textContent = "0";
    } else {
        if (currentVaultInput.join(",") === vaultCode.join(",")) {
            document.getElementById("vault-overlay").style.display = "none";
            document.getElementById("main-content").style.filter = "none";
            loadItems();
        } else {
            alert("Falscher Code, Boss!");
            currentVaultInput = [];
            rotation = 0;
            dial.style.transform = `rotate(0deg)`;
            codeDisplay.textContent = "0";
        }
    }
}

// Initial load (vault overlay shown, content blurred)
document.getElementById("list-container").style.display = "none";
document.getElementById("page-content").style.display = "none";

document.getElementById("editor-access").onclick = () => {
    const input = prompt("Passwort eingeben:");
    if (input === password) {
        isEditorActive = true;
        document.getElementById("editor").style.display = "block";
        loadItems();
    } else {
        alert("Falsches Passwort, Boss!");
    }
};

document.getElementById("back-btn").onclick = () => {
    document.getElementById("page-content").style.display = "none";
    document.getElementById("list-container").style.display = "block";
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
    document.getElementById("editor").style.display = "none";
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
    document.getElementById("copy-acc").onclick = () => {
        navigator.clipboard.writeText(item.acc || "");
        showToast();
    };
    document.getElementById("copy-pw").onclick = () => {
        navigator.clipboard.writeText(item.pw || "");
        showToast();
    };
    
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
    document.getElementById("page-editor").style.display = "none";
    document.getElementById("page-content").style.display = "block";
    loadItems();
    showPage(currentPage);
}

function showToast() {
    const toast = document.getElementById("copy-toast");
    toast.style.display = "block";
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
        toast.style.display = "none";
    }, 2000);
}
