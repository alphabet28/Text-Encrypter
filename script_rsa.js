document.addEventListener('DOMContentLoaded', () => {
    const keySizeSelect = document.getElementById('keySize');
    const generateKeysButton = document.querySelector('.key_generation_button');
    const encryptButton = document.getElementById('encrypt-btn-rsa');
    const publicKeyTextArea = document.getElementById('text1-rsa1');
    const privateKeyTextArea = document.getElementById('text2-rsa1');
    const plainTextArea = document.getElementById('text1-rsa2');
    const keyInputArea = document.getElementById('text2-rsa2');
    const encryptedTextArea = document.getElementById('encryptedTextt-rsa');
    const cipherMode = document.getElementById('cipherMode-rsa');
    const inputText = document.getElementById('inputtext');
    const modeToggle = document.getElementById('modeToggle-rsa');
    const modeTextLeft = document.getElementById('modeTextLeft');
    const modeTextRight = document.getElementById('modeTextRight');

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
            modeTextLeft.textContent = 'Encrypt';
            modeTextRight.textContent = 'Decrypt';
            encryptButton.textContent = 'Encrypt';
            plainTextArea.placeholder = 'Enter text to encrypt';
            keyInputArea.placeholder = 'Enter public key';
            inputText.textContent = 'Enter private key';

        } else {
            modeTextLeft.textContent = 'Encrypt';
            modeTextRight.textContent = 'Decrypt';
            encryptButton.textContent = 'Decrypt';
            plainTextArea.placeholder = 'Enter text to decrypt';
            keyInputArea.placeholder = 'Enter public key';
        }
    };

    // Event listener for encryption/decryption toggle
    modeToggle.addEventListener('change', toggleMode);

    // Event listener for encryption/decryption
    encryptButton.addEventListener('click', () => {
        const text = plainTextArea.value;
        const key = keyInputArea.value;

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
