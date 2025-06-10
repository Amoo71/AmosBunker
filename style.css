let editMode = false;
let currentEditIndex = -1;
let items = [];

// GitHub Repository Configuration
const GITHUB_CONFIG = {
    owner: 'YOUR_GITHUB_USERNAME',     // Replace with your GitHub username
    repo: 'YOUR_REPO_NAME',            // Replace with your repository name
    token: 'YOUR_GITHUB_TOKEN',        // Replace with your GitHub token
    file: 'data.json'                  // File to store data
};

// Vault entry functionality
document.getElementById('vaultPassword').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkVaultPassword();
    }
});

document.getElementById('vaultPassword').addEventListener('input', function() {
    if (this.value.length === 4) {
        checkVaultPassword();
    }
});

document.getElementById('editPassword').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        confirmEditPassword();
    }
});

function checkVaultPassword() {
    const password = document.getElementById('vaultPassword').value;
    if (password === '1312') {
        document.getElementById('vaultOverlay').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('vaultOverlay').style.display = 'none';
        }, 500);
        loadData();
    } else {
        document.getElementById('vaultPassword').style.borderColor = '#ff0000';
        document.getElementById('vaultPassword').value = '';
        setTimeout(() => {
            document.getElementById('vaultPassword').style.borderColor = 'rgba(128, 0, 255, 0.3)';
        }, 1000);
    }
}

// GitHub API functions
async function loadDataFromGitHub() {
    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.file}`, {
            headers: {
                'Authorization': `token ${GITHUB_CONFIG.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const content = JSON.parse(atob(data.content));
            return content;
        } else {
            console.log('No data file found, using default data');
            return null;
        }
    } catch (error) {
        console.error('Error loading data from GitHub:', error);
        return null;
    }
}

async function saveDataToGitHub(data) {
    try {
        // First, try to get the current file to get its SHA
        let sha = null;
        try {
            const response = await fetch(`https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.file}`, {
                headers: {
                    'Authorization': `token ${GITHUB_CONFIG.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            if (response.ok) {
                const fileData = await response.json();
                sha = fileData.sha;
            }
        } catch (error) {
            console.log('File does not exist yet, will create new file');
        }

        // Create or update the file
        const content = btoa(JSON.stringify(data, null, 2));
        const body = {
            message: 'Update bunker data',
            content: content
        };
        
        if (sha) {
            body.sha = sha;
        }

        const response = await fetch(`https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.file}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_CONFIG.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (response.ok) {
            showNotification('Data saved to GitHub successfully!');
            return true;
        } else {
            throw new Error('Failed to save to GitHub');
        }
    } catch (error) {
        console.error('Error saving data to GitHub:', error);
        showNotification('Error saving data to GitHub!');
        return false;
    }
}

// Load data
async function loadData() {
    // Try to load from GitHub first
    const githubData = await loadDataFromGitHub();
    
    if (githubData && githubData.items) {
        items = githubData.items;
    } else {
        // Initialize with sample data if no data exists
        items = [
            {
                name: 'Sample Item',
                image: 'https://via.placeholder.com/400x200/8000ff/ffffff?text=Sample+Item',
                description: 'This is a sample item in your bunker. Click to view details and edit when in edit mode.',
                account: 'sample_user',
                password: 'sample_pass'
            }
        ];
    }
    renderItems();
}

// Render items
function renderItems() {
    const container = document.getElementById('itemsContainer');
    container.innerHTML = '';

    items.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        itemDiv.onclick = () => editMode ? openItemEditor(index) : openItemDetail(index);
        
        itemDiv.innerHTML = `
            <div class="item-name">${item.name || 'Unnamed Item'}</div>
        `;
        
        container.appendChild(itemDiv);
    });
}

// Open item detail view
function openItemDetail(index) {
    const item = items[index];
    const content = document.getElementById('itemDetailContent');
    
    content.innerHTML = `
        <h2 style="color: #8000ff; margin-bottom: 1.5rem; text-align: center;">${item.name || 'Unnamed Item'}</h2>
        ${item.image ? `<img src="${item.image}" alt="Item image" class="item-detail-image" onerror="this.style.display='none'">` : ''}
        <div class="item-detail-description">${item.description || 'No description available'}</div>
        <div class="item-detail-buttons">
            <button class="copy-btn" onclick="copyToClipboard('${item.account}', event)">Copy Account</button>
            <button class="copy-btn" onclick="copyToClipboard('${item.password}', event)">Copy Password</button>
        </div>
    `;
    
    document.getElementById('overlay').classList.add('active');
    document.getElementById('itemDetailModal').classList.add('active');
}

// Close item detail view
function closeItemDetail() {
    document.getElementById('overlay').classList.remove('active');
    document.getElementById('itemDetailModal').classList.remove('active');
}

// Copy to clipboard
function copyToClipboard(text, event) {
    if (event) event.stopPropagation();
    
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied!');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Copied!');
    });
}

// Show notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

// Enter edit mode
function enterEditMode() {
    document.getElementById('editPasswordOverlay').classList.add('active');
    document.getElementById('editPassword').focus();
}

// Confirm edit password
function confirmEditPassword() {
    const password = document.getElementById('editPassword').value;
    if (password === '471312') {
        editMode = true;
        document.getElementById('editControls').classList.add('active');
        document.getElementById('editPasswordOverlay').classList.remove('active');
        document.getElementById('editPassword').value = '';
        showNotification('Edit mode activated!');
    } else {
        document.getElementById('editPassword').style.borderColor = '#ff0000';
        document.getElementById('editPassword').value = '';
        setTimeout(() => {
            document.getElementById('editPassword').style.borderColor = 'rgba(128, 0, 255, 0.3)';
        }, 1000);
        showNotification('Wrong password!');
    }
}

// Cancel edit password
function cancelEditPassword() {
    document.getElementById('editPasswordOverlay').classList.remove('active');
    document.getElementById('editPassword').value = '';
}

// Toggle edit mode
function toggleEditMode() {
    editMode = false;
    document.getElementById('editControls').classList.remove('active');
    showNotification('Edit mode deactivated!');
}

// Add new item
function addItem() {
    const name = document.getElementById('newItemName').value;
    const image = document.getElementById('newItemImage').value;
    const description = document.getElementById('newItemDescription').value;
    const account = document.getElementById('newItemAccount').value;
    const password = document.getElementById('newItemPassword').value;

    if (name && description) {
        items.push({
            name: name,
            image: image,
            description: description,
            account: account,
            password: password
        });

        // Clear form
        document.getElementById('newItemName').value = '';
        document.getElementById('newItemImage').value = '';
        document.getElementById('newItemDescription').value = '';
        document.getElementById('newItemAccount').value = '';
        document.getElementById('newItemPassword').value = '';

        renderItems();
        showNotification('Item added!');
    } else {
        showNotification('Please fill in at least name and description!');
    }
}

// Open item editor
function openItemEditor(index) {
    currentEditIndex = index;
    const item = items[index];
    
    document.getElementById('editItemName').value = item.name || '';
    document.getElementById('editItemImage').value = item.image || '';
    document.getElementById('editItemDescription').value = item.description || '';
    document.getElementById('editItemAccount').value = item.account || '';
    document.getElementById('editItemPassword').value = item.password || '';
    
    document.getElementById('overlay').classList.add('active');
    document.getElementById('itemEditor').classList.add('active');
}

// Close item editor
function closeItemEditor() {
    document.getElementById('overlay').classList.remove('active');
    document.getElementById('itemEditor').classList.remove('active');
    currentEditIndex = -1;
}

// Update item
function updateItem() {
    if (currentEditIndex >= 0) {
        const name = document.getElementById('editItemName').value;
        const description = document.getElementById('editItemDescription').value;
        
        if (name && description) {
            items[currentEditIndex] = {
                name: name,
                image: document.getElementById('editItemImage').value,
                description: description,
                account: document.getElementById('editItemAccount').value,
                password: document.getElementById('editItemPassword').value
            };
            
            renderItems();
            closeItemEditor();
            showNotification('Item updated!');
        } else {
            showNotification('Please fill in at least name and description!');
        }
    }
}

// Delete item
function deleteItem() {
    if (currentEditIndex >= 0 && confirm('Are you sure you want to delete this item?')) {
        items.splice(currentEditIndex, 1);
        renderItems();
        closeItemEditor();
        showNotification('Item deleted!');
    }
}

// Save data to GitHub
async function saveData() {
    const data = {
        items: items,
        lastUpdated: new Date().toISOString()
    };
    
    const success = await saveDataToGitHub(data);
    if (success) {
        // Notify all users to reload (in a real app, you'd use WebSockets)
        broadcastUpdate();
    }
}

// Broadcast update to all users (placeholder for real-time updates)
function broadcastUpdate() {
    // In a real application, you would use WebSockets or Server-Sent Events
    // For GitHub Pages, you could implement polling or use GitHub webhooks
    console.log('Data updated - in production, this would notify all users');
}

// Auto-refresh data periodically (polling approach for GitHub Pages)
setInterval(async () => {
    if (!editMode) {
        const githubData = await loadDataFromGitHub();
        if (githubData && githubData.items) {
            const currentItemsString = JSON.stringify(items);
            const newItemsString = JSON.stringify(githubData.items);
            
            if (currentItemsString !== newItemsString) {
                items = githubData.items;
                renderItems();
                showNotification('Data updated!');
            }
        }
    }
}, 30000); // Check for updates every 30 seconds

// Close modals when clicking overlay
document.getElementById('overlay').addEventListener('click', function(e) {
    if (e.target === this) {
        closeItemDetail();
        closeItemEditor();
    }
});

// Prevent closing when clicking inside modals
document.getElementById('itemDetailModal').addEventListener('click', function(e) {
    e.stopPropagation();
});

document.getElementById('itemEditor').addEventListener('click', function(e) {
    e.stopPropagation();
});

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Amo\'s Bunker loaded successfully!');
    
    // Instructions for setup
    if (GITHUB_CONFIG.owner === 'YOUR_GITHUB_USERNAME') {
        console.warn('⚠️ Please configure your GitHub settings in script.js:');
        console.warn('1. Replace YOUR_GITHUB_USERNAME with your GitHub username');
        console.warn('2. Replace YOUR_REPO_NAME with your repository name');
        console.warn('3. Replace YOUR_GITHUB_TOKEN with your GitHub personal access token');
        console.warn('4. Make sure your repository is public or your token has proper permissions');
    }
});
