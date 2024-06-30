document.addEventListener('DOMContentLoaded', () => {
    const keySizeSelect = document.getElementById('keySize');
    const generateKeysButton = document.querySelector('.key_generation_button');
    const encryptButton = document.getElementById('encrypt-btn-rsa');
    const publicKeyTextArea = document.getElementById('text1-rsa1');
    const privateKeyTextArea = document.getElementById('text2-rsa1');
    const encryptedTextArea = document.getElementById('encryptedTextt-rsa');
    const inputTextArea1 = document.getElementById('text1-rsa2');
    const inputTextArea2 = document.getElementById('text2-rsa2');
    const modeToggle = document.getElementById('modeToggle-rsa');
    const output = document.getElementById('output');
    const navBar = document.getElementById('nav-bar-rsa');
    const outputLabel = document.getElementById('outputLabel');
    let publicKey, privateKey;
    let isEncryptionMode = true;

    // Function to generate RSA keys
    const generateKeys = (keySize) => {
        const keypair = forge.pki.rsa.generateKeyPair({ bits: keySize, e: 0x10001 });
        publicKey = forge.pki.publicKeyToPem(keypair.publicKey);
        privateKey = forge.pki.privateKeyToPem(keypair.privateKey);

        publicKeyTextArea.value = publicKey;
        privateKeyTextArea.value = privateKey;
    };

    // Event listener for key generation
    generateKeysButton.addEventListener('click', () => {
        const keySize = parseInt(keySizeSelect.value);
        generateKeys(keySize);
    });

    // Function to sanitize PEM key format
    const sanitizePemKey = (pemKey) => {
        return pemKey
            .replace(/(\r\n|\n|\r)/gm, '\n') // Normalize line endings
            .replace(/\s+/g, ' ') // Remove excessive whitespace
            .replace(/ {2,}/g, ' ') // Replace multiple spaces with a single space
            .trim();
    };

    // Function to encrypt text
    const encryptText = (text, publicKeyPem) => {
        try {
            const sanitizedPublicKeyPem = sanitizePemKey(publicKeyPem);
            const publicKey = forge.pki.publicKeyFromPem(sanitizedPublicKeyPem);
            const encrypted = publicKey.encrypt(text, 'RSA-OAEP');
            return forge.util.encode64(encrypted);
        } catch (error) {
            console.error('Error during encryption:', error);
            alert('Failed to encrypt the text. Please ensure the public key is in the correct format.');
            return null;
        }
    };

    // Function to decrypt text
    const decryptText = (encryptedText, privateKeyPem) => {
        try {
            const sanitizedPrivateKeyPem = sanitizePemKey(privateKeyPem);
            const privateKey = forge.pki.privateKeyFromPem(sanitizedPrivateKeyPem);
            const decoded = forge.util.decode64(encryptedText);
            const decrypted = privateKey.decrypt(decoded, 'RSA-OAEP');
            return decrypted;
        } catch (error) {
            console.error('Error during decryption:', error);
            alert('Failed to decrypt the text. Please ensure the private key is in the correct format.');
            return null;
        }
    };

    // Function to toggle between encryption and decryption modes
    const toggleMode = () => {
        isEncryptionMode = !isEncryptionMode;
        if (isEncryptionMode) {
            encryptButton.textContent = 'Encrypt';
            inputTextArea1.placeholder = 'Enter text to encrypt';
            output.textContent = 'Enter Public Key';
            navBar.textContent = 'RSA Encryption';
            inputTextArea2.placeholder = 'Enter Public Key';
            outputLabel.textContent = 'Encrypted Output Text';
        } else {
            encryptButton.textContent = 'Decrypt';
            inputTextArea1.placeholder = 'Enter encrypted text to decrypt';
            output.textContent = 'Enter Private Key';
            navBar.textContent = 'RSA Decryption';
            inputTextArea2.placeholder = 'Enter Private Key';
            outputLabel.textContent = 'Decrypted Output Text';
        }

        // Clear the text areas when mode changes
        inputTextArea1.value = '';
        inputTextArea2.value = '';
        encryptedTextArea.value = '';
    };

    // Event listener for encryption/decryption toggle
    modeToggle.addEventListener('change', toggleMode);

    // Event listener for encryption/decryption
    encryptButton.addEventListener('click', () => {
        const text = inputTextArea1.value;
        const key = inputTextArea2.value;

        if (text && key) {
            if (isEncryptionMode) {
                const encryptedText = encryptText(text, key);
                if (encryptedText) {
                    encryptedTextArea.value = encryptedText;
                }
            } else {
                const decryptedText = decryptText(text, key);
                if (decryptedText) {
                    encryptedTextArea.value = decryptedText;
                }
            }
        } else {
            alert('Please enter both the text and the key.');
        }
    });
});
