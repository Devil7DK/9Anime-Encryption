function Decrypt(value) {
    const keyString = value.substr(0, 9);
    let encryptedEncodedString = value.substr(9);

    // #region Decoding
    if ((encryptedEncodedString = encryptedEncodedString.replace(/[ \t\n\f\r]/g, "")).length % 4 == 0) {
        encryptedEncodedString = encryptedEncodedString.replace(/==?$/, "");
        if (encryptedEncodedString.length % 4 == 1 || /[^+/0-9A-Za-z]/.test(encryptedEncodedString)) {
            return null;
        }
    }

    let encryptedDecodedString = "";

    let offset = 0;
    for (let index = 0; index < encryptedEncodedString.length; index++) {
        offset <<= 6;

        const charIndex = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(encryptedEncodedString[index]);
        offset |= charIndex < 0 ? undefined : charIndex;

        if (((index + 1) % 4) == 0) {
            encryptedDecodedString += String.fromCharCode((16711680 & offset) >> 16);
            encryptedDecodedString += String.fromCharCode((65280 & offset) >> 8);
            encryptedDecodedString += String.fromCharCode((255 & offset));
            offset = remaining = 0;
        }
        if (index == encryptedEncodedString.length - 1) {
            switch (index % 4) {
                case 1:
                    offset >>= 4;
                    encryptedDecodedString += String.fromCharCode(offset);
                    break;
                case 2:
                    offset >>= 2;
                    encryptedDecodedString += String.fromCharCode((65280 & offset) >> 8);
                    encryptedDecodedString += String.fromCharCode(((255) & offset));
                    break;
            }
        }
    }

    try {
        encryptedDecodedString = decodeURIComponent(encryptedDecodedString)
    } catch (err) {
    }
    // #endregion

    // #region Decryption
    var tmpArray = [...Array(256).keys()];
    var calculatedIndex = 0;

    for (let index = 0; index < 256; index += 1) {
        calculatedIndex = ((calculatedIndex + tmpArray[index] + keyString.charCodeAt(index % keyString.length)) % 256);
        tmpArray[calculatedIndex] = [tmpArray[index], tmpArray[index] = tmpArray[calculatedIndex]][0];
    }

    var decryptedDecodedString = "";
    for (var s = calculatedIndex = index = 0; s < encryptedDecodedString.length; s += 1) {
        calculatedIndex = (calculatedIndex + tmpArray[index = (index + 1) % 256]) % 256;
        tmpArray[calculatedIndex] = [tmpArray[index], tmpArray[index] = tmpArray[calculatedIndex]][0];
        decryptedDecodedString += String.fromCharCode(encryptedDecodedString.charCodeAt(s) ^ tmpArray[(tmpArray[index] + tmpArray[calculatedIndex]) % 256]);
    }
    // #endregion

    return decryptedDecodedString;
}
