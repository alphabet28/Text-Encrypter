// script_aes.js
document.addEventListener('DOMContentLoaded', function () {
    const modeToggle = document.getElementById('modeToggle');
    const plainText = document.getElementById('plainText');
    const cipherMode = document.getElementById('cipherMode');
    const initializationVector = document.getElementById('initializationVector');
    const padding = document.getElementById('padding');
    const keySize = document.getElementById('keySize');
    const secretKey = document.getElementById('secretKey');
    const encryptedText = document.getElementById('encryptedText');
    const ivInput = document.getElementById('ivInput');
    const encryptBtn = document.querySelector('.encrypt-btn');
    const textLabel = document.getElementById('textLabel');
    const outputLabel = document.getElementById('outputLabel');

    cipherMode.addEventListener('change', function () {
        if (cipherMode.value === 'CBC' || cipherMode.value === 'CTR') {
            ivInput.classList.remove('hidden');
        } else {
            ivInput.classList.add('hidden');
        }
    });

    modeToggle.addEventListener('change', function () {
        if (modeToggle.checked) {
            textLabel.textContent = 'Enter Cipher Text to Decrypt';
            encryptBtn.textContent = 'Decrypt';
            outputLabel.textContent = 'Decrypted Output Text';
        } else {
            textLabel.textContent = 'Enter Plain Text to Encrypt';
            encryptBtn.textContent = 'Encrypt';
            outputLabel.textContent = 'Encrypted Output Text';
        }
    });

    function pad(text, blockSize) {
        const padLength = blockSize - (text.length % blockSize);
        const padding = String.fromCharCode(padLength).repeat(padLength);
        return text + padding;
    }

    function unpad(text) {
        const padLength = text.charCodeAt(text.length - 1);
        return text.slice(0, -padLength);
    }

    encryptBtn.addEventListener('click', async function () {
        const text = plainText.value;
        const mode = modeToggle.checked ? 'decrypt' : 'encrypt';
        const cipher = cipherMode.value;
        const keyLen = parseInt(keySize.value);
        const key = secretKey.value;
        const iv = initializationVector.value;
        const paddingMode = padding.value;
        let result;

        if (key.length !== keyLen / 8) {
            alert(`Key length must be ${keyLen / 8} characters.`);
            return;
        }

        if ((cipher === 'CBC' || cipher === 'CTR') && !iv) {
            alert('Initialization Vector or Counter is required for CBC and CTR modes.');
            return;
        }

        try {
            const cryptoKey = await crypto.subtle.importKey(
                'raw',
                new TextEncoder().encode(key),
                { name: 'AES-' + cipher, length: keyLen },
                false,
                mode === 'encrypt' ? ['encrypt'] : ['decrypt']
            );

            let ivOrCounter;
            if (cipher === 'CTR') {
                ivOrCounter = new Uint8Array(16);
                const ivBytes = new TextEncoder().encode(iv);
                ivOrCounter.set(ivBytes.subarray(0, 16));
            } else if (cipher === 'CBC') {
                ivOrCounter = new TextEncoder().encode(iv);
            }

            if (mode === 'encrypt') {
                let data = text;
                if (paddingMode === 'PKCS5Padding' && cipher !== 'CTR') {
                    data = pad(text, 16);
                }

                const encrypted = await crypto.subtle.encrypt(
                    {
                        name: 'AES-' + cipher,
                        iv: cipher === 'CBC' ? ivOrCounter : undefined,
                        counter: cipher === 'CTR' ? ivOrCounter : undefined,
                        length: cipher === 'CTR' ? 64 : undefined,
                    },
                    cryptoKey,
                    new TextEncoder().encode(data)
                );

                result = btoa(String.fromCharCode(...new Uint8Array(encrypted)));
            } else {
                const decrypted = await crypto.subtle.decrypt(
                    {
                        name: 'AES-' + cipher,
                        iv: cipher === 'CBC' ? ivOrCounter : undefined,
                        counter: cipher === 'CTR' ? ivOrCounter : undefined,
                        length: cipher === 'CTR' ? 64 : undefined,
                    },
                    cryptoKey,
                    Uint8Array.from(atob(text), c => c.charCodeAt(0))
                );

                let data = new TextDecoder().decode(decrypted);
                if (paddingMode === 'PKCS5Padding' && cipher !== 'CTR') {
                    data = unpad(data);
                }

                result = data;
            }

            encryptedText.value = result;
        } catch (e) {
            alert('Error: ' + e.message);
        }
    });
});
