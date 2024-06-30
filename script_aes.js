document.addEventListener('DOMContentLoaded', function () {
    const modeToggle = document.getElementById('modeToggle');
    const encryptBtn = document.getElementById('encryptBtn');
    const plainText = document.getElementById('plainText');
    const cipherMode = document.getElementById('cipherMode');
    const padding = document.getElementById('padding');
    const keySize = document.getElementById('keySize');
    const secretKey = document.getElementById('secretKey');
    const encryptedText = document.getElementById('encryptedText');
    const ivInput = document.getElementById('ivInput');
    const initializationVector = document.getElementById('initializationVector');
    const textLabel = document.getElementById('textLabel');
    const outputLabel = document.getElementById('outputLabel');

    modeToggle.addEventListener('change', function () {
        if (modeToggle.checked) {
            // Decrypt mode
            textLabel.textContent = 'Enter Encrypted Text to Decrypt';
            encryptBtn.textContent = 'Decrypt';
            outputLabel.textContent = 'Decrypted Output Text';
            // Clear encryption-related fields
            plainText.value = '';
            ivInput.classList.add('hidden');
            initializationVector.value = '';
            padding.parentElement.classList.remove('hidden');
            encryptedText.value = '';
        } else {
            // Encrypt mode
            textLabel.textContent = 'Enter Plain Text to Encrypt';
            encryptBtn.textContent = 'Encrypt';
            outputLabel.textContent = 'Encrypted Output Text';
            // Clear decryption-related fields
            encryptedText.value = '';
        }
        // Clear secret key field in both modes
        secretKey.value = '';
    });

    cipherMode.addEventListener('change', function () {
        // Clear all text areas when cipher mode changes
        clearTextAreas();

        switch (cipherMode.value) {
            case 'CBC':
                ivInput.classList.remove('hidden');
                padding.parentElement.classList.remove('hidden');
                break;
            case 'CTR':
                ivInput.classList.remove('hidden');
                padding.parentElement.classList.add('hidden');
                break;
            case 'ECB':
            default:
                ivInput.classList.add('hidden');
                padding.parentElement.classList.remove('hidden');
                break;
        }
    });

    secretKey.addEventListener('input', function () {
        const maxLength = keySize.value / 8;
        if (secretKey.value.length > maxLength) {
            secretKey.value = secretKey.value.slice(0, maxLength);
        }
    });

    encryptBtn.addEventListener('click', function () {
        const inputText = plainText.value;
        const key = CryptoJS.enc.Utf8.parse(secretKey.value);
        const iv = initializationVector.value ? CryptoJS.enc.Utf8.parse(initializationVector.value) : CryptoJS.lib.WordArray.random(16);
        const keySizeBits = parseInt(keySize.value);
        const mode = getCipherMode(cipherMode.value);
        const paddingType = getPaddingType(padding.value);

        if (!inputText || !secretKey.value) {
            alert('Please enter text and secret key.');
            return;
        }

        if (cipherMode.value === 'CBC' && !initializationVector.value) {
            alert('Please enter an Initialization Vector (IV) for CBC mode.');
            return;
        }

        let result;
        if (modeToggle.checked) {
            // Decryption
            result = decrypt(inputText, key, iv, mode, paddingType);
        } else {
            // Encryption
            result = encrypt(inputText, key, iv, mode, paddingType);
        }

        encryptedText.value = result;
    });

    function clearTextAreas() {
        plainText.value = '';
        secretKey.value = ''; // Clear secret key field
        initializationVector.value = '';
        encryptedText.value = '';
    }

    function getCipherMode(mode) {
        switch (mode) {
            case 'CBC':
                return CryptoJS.mode.CBC;
            case 'CTR':
                return CryptoJS.mode.CTR;
            case 'ECB':
            default:
                return CryptoJS.mode.ECB;
        }
    }

    function getPaddingType(padding) {
        switch (padding) {
            case 'NoPadding':
                return CryptoJS.pad.NoPadding;
            case 'PKCS5Padding':
            default:
                return CryptoJS.pad.Pkcs7;
        }
    }

    function encrypt(text, key, iv, mode, padding) {
        const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text), key, {
            mode: mode,
            padding: padding,
            iv: iv
        });
        return encrypted.toString();
    }

    function decrypt(cipherText, key, iv, mode, padding) {
        const decrypted = CryptoJS.AES.decrypt(cipherText, key, {
            mode: mode,
            padding: padding,
            iv: iv
        });
        return CryptoJS.enc.Utf8.stringify(decrypted);
    }
});
