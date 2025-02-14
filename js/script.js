class PasswordGenerator {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.passwordHistory = [];
        this.loadPasswordHistory();
    }

    initializeElements() {
        // Get all necessary DOM elements
        this.resultEl = document.getElementById('PasswordResult');
        this.lengthEl = document.getElementById('Passwordlength');
        this.uppercaseEl = document.getElementById('uppercase');
        this.lowercaseEl = document.getElementById('lowercase');
        this.numbersEl = document.getElementById('numbers');
        this.symbolsEl = document.getElementById('symbols');
        this.generateBtn = document.getElementById('generateBtn');
        this.clipboardBtn = document.getElementById('clipboardBtn');
        this.saveBtn = document.getElementById('saveBtn');
        this.strengthMeter = document.getElementById('strengthMeter');
        this.modal = document.getElementById('saveModal');
    }

    setupEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generatePassword());
        this.clipboardBtn.addEventListener('click', () => this.copyToClipboard());
        this.saveBtn.addEventListener('click', () => this.showSaveModal());
        this.resultEl.addEventListener('input', () => this.updateStrengthMeter());
        
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(button => {
            button.addEventListener('click', (e) => this.switchTab(e));
        });

        document.getElementById('savedPasswords').addEventListener('click', () => {
            this.viewSavedPasswords();
        });
    }

    generatePassword() {
        const length = +this.lengthEl.value;
        const hasUpper = this.uppercaseEl.checked;
        const hasLower = this.lowercaseEl.checked;
        const hasNumber = this.numbersEl.checked;
        const hasSymbol = this.symbolsEl.checked;
        
        const password = this.generatePasswordString(length, hasUpper, hasLower, hasNumber, hasSymbol);
        this.resultEl.value = password;
        this.updateStrengthMeter();
        this.addToHistory(password);
    }

    generatePasswordString(length, upper, lower, number, symbol) {
        const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const numberChars = '0123456789';
        const symbolChars = '!@#$%^&*()_+[]{}|;:,.<>?';

        let chars = '';
        if (upper) chars += uppercaseChars;
        if (lower) chars += lowercaseChars;
        if (number) chars += numberChars;
        if (symbol) chars += symbolChars;

        return Array(length)
            .fill(null)
            .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
            .join('');
    }

    updateStrengthMeter() {
        const password = this.resultEl.value;
        const strength = this.calculatePasswordStrength(password);
        const strengthBar = this.strengthMeter.querySelector('.strength-bar');
        const strengthText = this.strengthMeter.querySelector('.strength-text');

        strengthBar.style.width = `${strength.score * 25}%`;
        strengthBar.style.backgroundColor = strength.color;
        strengthText.textContent = `Strength: ${strength.label}`;
    }

    calculatePasswordStrength(password) {
        let score = 0;
        
        if (password.length >= 12) score++;
        if (password.match(/[A-Z]/)) score++;
        if (password.match(/[a-z]/)) score++;
        if (password.match(/[0-9]/)) score++;
        if (password.match(/[^A-Za-z0-9]/)) score++;

        const strengthLevels = [
            { score: 0, label: 'Very Weak', color: '#ff4444' },
            { score: 1, label: 'Weak', color: '#ffbb33' },
            { score: 2, label: 'Moderate', color: '#ffeb3b' },
            { score: 3, label: 'Strong', color: '#00C851' },
            { score: 4, label: 'Very Strong', color: '#007E33' }
        ];

        return strengthLevels[score];
    }

    async copyToClipboard() {
        try {
            await navigator.clipboard.writeText(this.resultEl.value);
            this.showNotification('Password copied!', 'success');
        } catch (err) {
            this.showNotification('Failed to copy password', 'error');
        }
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    addToHistory(password) {
        this.passwordHistory.unshift({
            password: password,
            timestamp: new Date().toLocaleString()
        });

        if (this.passwordHistory.length > 5) {
            this.passwordHistory.pop();
        }

        this.updateHistoryDisplay();
        this.savePasswordHistory();
    }

    updateHistoryDisplay() {
        const historyList = document.getElementById('historyList');
        historyList.innerHTML = this.passwordHistory
            .map(item => `
                <li>
                    <span>${item.password}</span>
                    <small>${item.timestamp}</small>
                </li>
            `)
            .join('');
    }

    savePasswordHistory() {
        localStorage.setItem('passwordHistory', JSON.stringify(this.passwordHistory));
    }

    loadPasswordHistory() {
        const saved = localStorage.getItem('passwordHistory');
        if (saved) {
            this.passwordHistory = JSON.parse(saved);
            this.updateHistoryDisplay();
        }
    }

    switchTab(event) {
        const tabId = event.target.dataset.tab;
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
        
        event.target.classList.add('active');
        document.getElementById(tabId).classList.remove('hidden');
    }

    showSaveModal() {
        const modal = document.getElementById('saveModal');
        const closeBtn = modal.querySelector('.close');
        const confirmBtn = document.getElementById('confirmSave');
        const websiteInput = document.getElementById('websiteInput');
        const usernameInput = document.getElementById('usernameInput');

        modal.style.display = 'block';

        closeBtn.onclick = () => {
            modal.style.display = 'none';
        };

        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };

        confirmBtn.onclick = () => {
            this.savePassword(
                websiteInput.value,
                usernameInput.value,
                this.resultEl.value
            );
            modal.style.display = 'none';
            websiteInput.value = '';
            usernameInput.value = '';
        };
    }

    savePassword(website, username, password) {
        if (!website || !username || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        // Encrypt password before saving
        const encryptedPassword = this.encryptPassword(password);
        
        const savedPasswords = JSON.parse(localStorage.getItem('savedPasswords') || '[]');
        savedPasswords.push({
            website,
            username,
            password: encryptedPassword,
            date: new Date().toISOString()
        });

        localStorage.setItem('savedPasswords', JSON.stringify(savedPasswords));
        this.showNotification('Password saved successfully!', 'success');
    }

    encryptPassword(password) {
        // Simple encryption using CryptoJS (make sure you have included the library)
        const secretKey = 'your-secret-key'; // You should use a more secure key in production
        return CryptoJS.AES.encrypt(password, secretKey).toString();
    }

    viewSavedPasswords() {
        const savedPasswords = JSON.parse(localStorage.getItem('savedPasswords') || '[]');
        const secretKey = 'your-secret-key';

        // Create modal content for saved passwords
        const modalContent = `
            <div id="savedPasswordsModal" class="modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h3>Saved Passwords</h3>
                    <div class="saved-passwords-list">
                        ${savedPasswords.map(item => {
                            const decryptedPassword = CryptoJS.AES.decrypt(item.password, secretKey)
                                .toString(CryptoJS.enc.Utf8);
                            return `
                                <div class="saved-password-item">
                                    <div class="site-info">
                                        <strong>${item.website}</strong>
                                        <p>Username: ${item.username}</p>
                                        <p class="password-text">Password: 
                                            <span class="hidden-password">••••••••</span>
                                            <span class="actual-password" style="display:none">${decryptedPassword}</span>
                                        </p>
                                    </div>
                                    <div class="password-actions">
                                        <button onclick="navigator.clipboard.writeText('${decryptedPassword}').then(() => document.querySelector('.notification.success').style.display='block')" class="btn-small">
                                            <i class="far fa-clipboard"></i>
                                        </button>
                                        <button onclick="togglePasswordVisibility(this)" class="btn-small">
                                            <i class="far fa-eye"></i>
                                        </button>
                                        <button onclick="deletePassword('${item.website}')" class="btn-small">
                                            <i class="far fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;

        // Add modal to document
        document.body.insertAdjacentHTML('beforeend', modalContent);

        // Get the modal element
        const modal = document.getElementById('savedPasswordsModal');
        const closeBtn = modal.querySelector('.close');

        // Show modal
        modal.style.display = 'block';

        // Close modal functionality
        closeBtn.onclick = () => {
            modal.remove();
        };

        window.onclick = (event) => {
            if (event.target === modal) {
                modal.remove();
            }
        };
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new PasswordGenerator();
});

// Add this function at the end of your file, outside the class
function togglePasswordVisibility(button) {
    const passwordItem = button.closest('.saved-password-item');
    const hiddenPassword = passwordItem.querySelector('.hidden-password');
    const actualPassword = passwordItem.querySelector('.actual-password');
    const icon = button.querySelector('i');

    if (hiddenPassword.style.display !== 'none') {
        hiddenPassword.style.display = 'none';
        actualPassword.style.display = 'inline';
        icon.className = 'far fa-eye-slash';
    } else {
        hiddenPassword.style.display = 'inline';
        actualPassword.style.display = 'none';
        icon.className = 'far fa-eye';
    }
}

// Add this function to handle password deletion
function deletePassword(website) {
    const savedPasswords = JSON.parse(localStorage.getItem('savedPasswords') || '[]');
    const updatedPasswords = savedPasswords.filter(item => item.website !== website);
    localStorage.setItem('savedPasswords', JSON.stringify(updatedPasswords));
    document.getElementById('savedPasswordsModal').remove();
    new PasswordGenerator().viewSavedPasswords();
}
