

function caesarCipherEncrypt(message, shift) {
    return message.split('').map(char => {
        if (char.match(/[a-zA-Z]/)) {
            let code = char.charCodeAt();
            if (char >= 'A' && char <= 'Z') {
                char = String.fromCharCode(((code - 65 + shift) % 26 + 26) % 26 + 65); 
            } else if (char >= 'a' && char <= 'z') {
                char = String.fromCharCode(((code - 97 + shift) % 26 + 26) % 26 + 97); 
            }
        }
        return char;
    }).join('');
}

function caesarCipherDecrypt(message, shift) {
    return caesarCipherEncrypt(message, -shift);
}


function generatePlayfairKeyMatrix(key) {
    key = key.toUpperCase().replace(/J/g, 'I');
    let matrix = [];
    let used = {};
    
    key.split('').forEach(char => {
        if (!used[char] && char.match(/[A-Z]/)) {
            matrix.push(char);
            used[char] = true;
        }
    });

    for (let i = 65; i <= 90; i++) {
        let char = String.fromCharCode(i);
        if (char !== 'J' && !used[char]) {
            matrix.push(char);
            used[char] = true;
        }
    }

    return matrix;
}

function findPosition(matrix, char) {
    let index = matrix.indexOf(char);
    return [Math.floor(index / 5), index % 5];
}

function playfairCipherEncrypt(message, key) {
    let matrix = generatePlayfairKeyMatrix(key);
    message = message.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
    
    let pairs = [];
    for (let i = 0; i < message.length; i += 2) {
        let a = message[i];
        let b = (i + 1 < message.length) ? message[i + 1] : 'X';
        if (a === b) {
            b = 'X';
            i--;
        }
        pairs.push([a, b]);
    }

    return pairs.map(([a, b]) => {
        let [aRow, aCol] = findPosition(matrix, a);
        let [bRow, bCol] = findPosition(matrix, b);

        if (aRow === bRow) {
            return matrix[aRow * 5 + (aCol + 1) % 5] + matrix[bRow * 5 + (bCol + 1) % 5];
        } else if (aCol === bCol) {
            return matrix[((aRow + 1) % 5) * 5 + aCol] + matrix[((bRow + 1) % 5) * 5 + bCol];
        } else {
            return matrix[aRow * 5 + bCol] + matrix[bRow * 5 + aCol];
        }
    }).join('');
}

function playfairCipherDecrypt(message, key) {
    let matrix = generatePlayfairKeyMatrix(key);
    
    let pairs = [];
    for (let i = 0; i < message.length; i += 2) {
        let a = message[i];
        let b = message[i + 1];
        pairs.push([a, b]);
    }

    return pairs.map(([a, b]) => {
        let [aRow, aCol] = findPosition(matrix, a);
        let [bRow, bCol] = findPosition(matrix, b);

        if (aRow === bRow) {
            return matrix[aRow * 5 + (aCol + 4) % 5] + matrix[bRow * 5 + (bCol + 4) % 5];
        } else if (aCol === bCol) {
            return matrix[((aRow + 4) % 5) * 5 + aCol] + matrix[((bRow + 4) % 5) * 5 + bCol];
        } else {
            return matrix[aRow * 5 + bCol] + matrix[bRow * 5 + aCol];
        }
    }).join('');
}

function combinedEncrypt(message, caesarShift, playfairKey) {
    let caesarEncrypted = caesarCipherEncrypt(message, caesarShift);
    let playfairEncrypted = playfairCipherEncrypt(caesarEncrypted, playfairKey);
    return playfairEncrypted;
}

function combinedDecrypt(message, caesarShift, playfairKey) {
    let playfairDecrypted = playfairCipherDecrypt(message, playfairKey);
    let caesarDecrypted = caesarCipherDecrypt(playfairDecrypted, caesarShift);
    return caesarDecrypted;
}


function encryptMessage() {
    let message = document.getElementById("message").value;
    let caesarShift = parseInt(document.getElementById("caesar-shift").value);
    let playfairKey = document.getElementById("playfair-key").value;

    if (!message || isNaN(caesarShift) || !playfairKey) {
        alert("Please fill in all fields.");
        return;
    }

    let encryptedMessage = combinedEncrypt(message, caesarShift, playfairKey);
    document.getElementById("output").value = encryptedMessage;
}

function decryptMessage() {
    let message = document.getElementById("message").value;
    let caesarShift = parseInt(document.getElementById("caesar-shift").value);
    let playfairKey = document.getElementById("playfair-key").value;

    if (!message || isNaN(caesarShift) || !playfairKey) {
        alert("Please fill in all fields.");
        return;
    }

    let decryptedMessage = combinedDecrypt(message, caesarShift, playfairKey);
    document.getElementById("output").value = decryptedMessage;
}

  
  
