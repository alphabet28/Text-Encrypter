document.getElementById('left-button').addEventListener('click', function() {
    var text = document.getElementById('text1').value;
    var key = document.getElementById('text3').value;
    if (text === '' || key === '') {
        alert('Please enter both text and key.');
        return;
    }
    var encrypted = CryptoJS.DES.encrypt(text, key).toString();
    document.getElementById('text2').value = encrypted;
});

document.getElementById('right-button').addEventListener('click', function() {
    var encryptedText = document.getElementById('text2').value;
    var key = document.getElementById('text3').value;
    if (encryptedText === '' || key === '') {
        alert('Please enter both encrypted text and key.');
        return;
    }
    var decrypted = CryptoJS.DES.decrypt(encryptedText, key);
    var decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    document.getElementById('text1').value = decryptedText;
});

document.getElementById('clear-button').addEventListener('click', function() {
    document.getElementById('text1').value = '';
    document.getElementById('text2').value = '';
    document.getElementById('text3').value = '';
});