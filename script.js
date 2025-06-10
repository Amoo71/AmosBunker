const password = "471312";
const vaultCode = "1312";
let isEditorActive = false;
let currentPage = null;

// Vault lock logic
function submitVaultCode() {
    const input = document.getElementById("vault-code-input").value.trim();
    if (input === vaultCode) {
        document.getElementById("vault-overlay").style.display = "none";
        document.getElementById("main-content").style.filter = "none";
        document.getElementById("list-container").style.display = "block";
        loadItems();
    } else {
        alert("Wrong Code, Boss!");
        document.getElementById("vault-code-input").value = "";
    }
}

document.getElementById("vault-code-input").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        submitVaultCode();
    }
});

// Editor access logic
const editorAccess = document.getElementById("editor-access");
if (!editorAccess) {
    console.error("Editor access button not found!");
} else {
    editorAccess.onclick = () => {
        console.log("Editor access clicked!");
        const input = prompt("Enter Password:");
        if (input === password) {
            console.log("Correct password, opening editor...");
            isEditorActive = true;
            document.getElementById("editor").style.display = "block";
            loadItems();
        } else {
            alert("Wrong Password, Boss!");
        }
    };
}

// Initial load (vault overlay shown, content blurred)
document.getElementById("list-container").style.display = "none";
document.getElementById("page-content").style.display = "none";

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
            deleteBtn.textContent = "Delete";
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
    console.log("Showing page for index:", index, "Item:", item);
    document.getElementById("list-container").style.display = "none";
    document.getElementById("page-content").style.display = "block";
    document.getElementById("page-image").src = item.imageUrl || "https://via.placeholder.com/300";
    document.getElementById("page-text").textContent = item.text || "";
    
    // Copy buttons logic
    const copyAccBtn = document.getElementById("copy-acc");
    const copyPwBtn = document.getElementById("copy-pw");
    
    copyAccBtn.onclick = () => {
        console.log("Copy Acc clicked, attempting to copy:", item.acc || "");
        if (item.acc && item.acc.trim()) {
            navigator.clipboard.writeText(item.acc.trim()).then(() => {
                console.log("Account copied successfully!");
                showToast();
            }).catch(err => {
                console.error("Failed to copy account:", err);
                alert("Copy failed! Check console for details.");
            });
        } else {
            console.log("No account value available to copy!");
            alert("No Item to copy!");
        }
    };
    
    copyPwBtn.onclick = () => {
        console.log("Copy Pw clicked, attempting to copy:", item.pw || "");
        if (item.pw && item.pw.trim()) {
            navigator.clipboard.writeText(item.pw.trim()).then(() => {
                console.log("Password copied successfully!");
                showToast();
            }).catch(err => {
                console.error("Failed to copy password:", err);
                alert("Copy failed! Check console for details.");
            });
        } else {
            console.log("No password value available to copy!");
            alert("No Item to copy!");
        }
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
    console.log("Editing page for index:", index, "Item:", item);
    document.getElementById("page-content").style.display = "none";
    document.getElementById("page-editor").style.display = "block";
    document.getElementById("edit-image-url").value = item.imageUrl || "";
    document.getElementById("edit-text").value = item.text || "";
    document.getElementById("edit-acc").value = item.acc || "";
    document.getElementById("edit-pw").value = item.pw || "";
}

function savePage() {
    const items = JSON.parse(localStorage.getItem("items") || "[]");
    console.log("Saving page for index:", currentPage);
    items[currentPage] = {
        name: items[currentPage].name,
        imageUrl: document.getElementBy-JonesById("edit-image-url").value,
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
    console.log("Showing toast with message: Copied!");
    const toast = document.getElementById("copy-toast");
    toast.textContent = "Copied!";
    toast.style.display = "block";
    toast.classList.add("show");
    setTimeout(() => {
        console.log("Hiding toast...");
        toast.classList.remove("hide");
        setTimeout(() => {
            toast.style.display = "none";
            toast.classList.remove("hide");
        }, 300); // Wait for transition to complete
    }, 2000); // Hides after 2 seconds
}
</script>
