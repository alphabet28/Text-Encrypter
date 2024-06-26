document.getElementById('aesBtn').onclick = function() {
    document.getElementById('navbar').classList.remove('hidden');
    document.getElementById('aesLink').classList.add('active');
    location.href = 'aes.html';
};
document.getElementById('desBtn').onclick = function() {
    document.getElementById('navbar').classList.remove('hidden');
    document.getElementById('desLink').classList.add('active');
    location.href = 'des.html';
};
document.getElementById('rsaBtn').onclick = function() {
    document.getElementById('navbar').classList.remove('hidden');
    document.getElementById('rsaLink').classList.add('active');
    location.href = 'rsa.html';
};


// function addDynamicTextBoxes() {
//     const dynamicContent = document.getElementById('dynamic-content');
//     dynamicContent.innerHTML = `
//         <h2>Enter Text to Encrypt</h2>
//         <input type="text" placeholder="Enter your text here" id="inputText">
//         <input type="text" placeholder="Enter your key here" id="inputKey">
//         <button id="encryptBtn">Encrypt</button>
//     `;
//     dynamicContent.classList.remove('hidden');

//     document.getElementById('encryptBtn').onclick = function() {
//         const text = document.getElementById('inputText').value;
//         const key = document.getElementById('inputKey').value;
//         alert('Text: ' + text + '\nKey: ' + key);
//     };
// }

// // If you're on the AES page, add the dynamic text boxes
// if (window.location.pathname.endsWith('aes.html')) {
//     addDynamicTextBoxes();
// }
