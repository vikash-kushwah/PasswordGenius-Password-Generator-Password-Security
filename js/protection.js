document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password-input');
    const strengthValue = document.getElementById('strength-value');
    const meterBar = document.querySelector('.meter-bar');
    const requirements = document.querySelectorAll('#requirements-list li');

    passwordInput.addEventListener('input', (e) => {
        const password = e.target.value;
        const strength = checkPasswordStrength(password);
        updateStrengthMeter(strength);
        updateRequirements(password);
    });

    function checkPasswordStrength(password) {
        let score = 0;
        const checks = {
            length: password.length >= 12,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[^A-Za-z0-9]/.test(password)
        };

        score = Object.values(checks).filter(Boolean).length;

        return {
            score,
            label: getStrengthLabel(score),
            color: getStrengthColor(score)
        };
    }

    function updateStrengthMeter(strength) {
        strengthValue.textContent = strength.label;
        meterBar.style.setProperty('--strength-color', strength.color);
        meterBar.style.setProperty('--strength-width', `${strength.score * 20}%`);
    }

    function updateRequirements(password) {
        const checks = {
            length: password.length >= 12,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[^A-Za-z0-9]/.test(password)
        };

        requirements.forEach(req => {
            const requirement = req.getAttribute('data-requirement');
            if (checks[requirement]) {
                req.classList.add('met');
            } else {
                req.classList.remove('met');
            }
        });
    }

    function getStrengthLabel(score) {
        const labels = ['Very Weak', 'Weak', 'Moderate', 'Strong', 'Very Strong'];
        return labels[score];
    }

    function getStrengthColor(score) {
        const colors = ['#f44336', '#ff9800', '#ffeb3b', '#4caf50', '#2196f3'];
        return colors[score] || colors[0];
    }
});