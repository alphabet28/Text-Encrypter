document.addEventListener('DOMContentLoaded', () => {
    const keySizeSelect = document.getElementById('keySize');
    const generateKeysButton = document.querySelector('.key_generation_button');
    const encryptButton = document.getElementById('encrypt-btn-rsa');
    const publicKeyTextArea = document.getElementById('text1-rsa1');
    const privateKeyTextArea = document.getElementById('text2-rsa1');
    const encryptedTextArea = document.getElementById('encryptedTextt-rsa');
    const cipherMode = document.getElementById('cipherMode-rsa');
    const inputText = document.getElementById('inputtext');
    const modeToggle = document.getElementById('modeToggle-rsa');
    const modeTextLeft = document.getElementById('modeTextLeft');
    const modeTextRight = document.getElementById('modeTextRight');
    const outputtext = document.getElementById('output');
    const nav_bar = document.getElementById('nav-bar-rsa');
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
            plainTextArea.placeholder = 'Enter text to encrypt';
           
            outputtext.textContent = 'Enter Public Key';
            nav_bar.textContent = 'RSA Encryption';
            inputText.textcontent = 'Enter Plain Text';
            outputLabel.textContent = 'Encrypted Output Text';

        } else {
          
            encryptButton.textContent = 'Decrypt';
            plainTextArea.placeholder = 'Enter encrypted text to decrypt';
           
            outputtext.textContent = 'Enter Private Key';
            nav_bar.textContent = 'RSA Decryption';
            inputText.textcontent = 'Enter encrypted text';
            outputLabel.textContent = 'Decrypted Output Text';
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
