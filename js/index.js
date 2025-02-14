class PasswordGenerator {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.passwordHistory = [];
        this.loadPasswordHistory();
    }

    initializeElements() {
        this.resultEl = document.getElementById('PasswordResult');
        this.lengthEl = document.getElementById('Passwordlength');
        this.uppercaseEl = document.getElementById('uppercase');
        this.lowercaseEl = document.getElementById('lowercase');
        this.numbersEl = document.getElementById('numbers');
        this.symbolsEl = document.getElementById('symbols');
        this.excludeSimilarEl = document.getElementById('excludeSimilar');
        this.memorableEl = document.getElementById('memorable');
        this.patternEl = document.getElementById('pattern');
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
        
        // Theme switcher
        document.getElementById('theme-switch').addEventListener('change', (e) => {
            document.body.setAttribute('data-theme', e.target.checked ? 'dark' : 'light');
            localStorage.setItem('theme', e.target.checked ? 'dark' : 'light');
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(button => {
            button.addEventListener('click', (e) => this.switchTab(e));
        });

        // Modal close button
        document.querySelector('.close').addEventListener('click', () => {
            this.modal.style.display = 'none';
        });

        // Save password confirmation
        document.getElementById('confirmSave').addEventListener('click', () => {
            this.savePassword();
        });
    }

    generatePassword() {
        const length = +this.lengthEl.value;
        const hasUpper = this.uppercaseEl.checked;
        const hasLower = this.lowercaseEl.checked;
        const hasNumber = this.numbersEl.checked;
        const hasSymbol = this.symbolsEl.checked;
        const excludeSimilar = this.excludeSimilarEl.checked;
        const isMemorablePattern = this.memorableEl.checked;
        
        let password = '';
        
        if (isMemorablePattern) {
            password = this.generateMemorablePassword();
        } else {
            password = this.generateRandomPassword(length, hasUpper, hasLower, hasNumber, hasSymbol, excludeSimilar);
        }

        this.resultEl.value = password;
        this.updateStrengthMeter();
        this.addToHistory(password);
    }

    generateRandomPassword(length, upper, lower, number, symbol, excludeSimilar) {
        const similarChars = 'il1Lo0O';
        let chars = '';
        
        if (upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (lower) chars += 'abcdefghijklmnopqrstuvwxyz';
        if (number) chars += '0123456789';
        if (symbol) chars += '!@#$%^&*()_+[]{}|;:,.<>?';
        
        if (excludeSimilar) {
            chars = chars.split('').filter(char => !similarChars.includes(char)).join('');
        }

        return Array(length)
            .fill(null)
            .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
            .join('');
    }

    // ... Rest of the class implementation with other methods
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new PasswordGenerator();
});