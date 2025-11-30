// vigenere_script.js

document.addEventListener('DOMContentLoaded', () => {
    // Get references to DOM elements
    const inputTextElem = document.getElementById('inputText');
    const keywordElem = document.getElementById('keyword');
    const encodeButton = document.getElementById('encodeButton');
    const decodeButton = document.getElementById('decodeButton');
    const outputTextElem = document.getElementById('outputText');
    const errorMessageElem = document.getElementById('error-message');

    // Alphabet (uppercase)
    const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    /**
     * Processes the keyword:
     * - Converts to uppercase.
     * - Removes non-alphabetic characters.
     * @param {string} rawKey - The raw keyword input.
     * @returns {string} The processed keyword.
     */
    function processKeyword(rawKey) {
        return rawKey.toUpperCase().replace(/[^A-Z]/g, '');
    }

    /**
     * Vigenère cipher core logic.
     * @param {string} text - The input text (plaintext or ciphertext).
     * @param {string} key - The processed keyword.
     * @param {boolean} isEncoding - True for encoding, false for decoding.
     * @returns {string} The processed text (ciphertext or plaintext).
     */
    function vigenereCipher(text, key, isEncoding) {
        let result = "";
        let keyIndex = 0;
        const textUpper = text.toUpperCase(); // Process text as uppercase

        for (let i = 0; i < textUpper.length; i++) {
            const char = textUpper[i];
            const charIndexInAlphabet = ALPHABET.indexOf(char);

            if (charIndexInAlphabet !== -1) { // Character is in the alphabet
                const keyChar = key[keyIndex % key.length];
                const keyCharIndexInAlphabet = ALPHABET.indexOf(keyChar);

                let shiftedIndex;
                if (isEncoding) {
                    shiftedIndex = (charIndexInAlphabet + keyCharIndexInAlphabet) % ALPHABET.length;
                } else { // Decoding
                    shiftedIndex = (charIndexInAlphabet - keyCharIndexInAlphabet + ALPHABET.length) % ALPHABET.length;
                }
                // Preserve original case if possible (simple check for lowercase)
                if (text[i] === text[i].toLowerCase() && text[i] !== text[i].toUpperCase()) {
                    result += ALPHABET[shiftedIndex].toLowerCase();
                } else {
                    result += ALPHABET[shiftedIndex];
                }
                keyIndex++; // Move to the next character in the key only for alphabetic characters
            } else {
                // Character is not in the alphabet (e.g., space, punctuation), so keep it as is
                result += text[i];
            }
        }
        return result;
    }

    /**
     * Displays an error message.
     * @param {string} message - The error message to display.
     */
    function showError(message) {
        errorMessageElem.textContent = message;
        errorMessageElem.style.display = 'block';
    }

    /**
     * Clears any existing error message.
     */
    function clearError() {
        errorMessageElem.textContent = '';
        errorMessageElem.style.display = 'none';
    }

    // Event listener for the Encode button
    encodeButton.addEventListener('click', () => {
        clearError();
        const text = inputTextElem.value;
        const rawKey = keywordElem.value;
        const processedKey = processKeyword(rawKey);

        if (!text) {
            showError("Please enter some text to encode.");
            return;
        }
        if (!processedKey) {
            showError("Please enter a valid keyword (letters only).");
            return;
        }

        outputTextElem.value = vigenereCipher(text, processedKey, true);
    });

    // Event listener for the Decode button
    decodeButton.addEventListener('click', () => {
        clearError();
        const text = inputTextElem.value;
        const rawKey = keywordElem.value;
        const processedKey = processKeyword(rawKey);

        if (!text) {
            showError("Please enter some text to decode.");
            return;
        }
        if (!processedKey) {
            showError("Please enter a valid keyword (letters only).");
            return;
        }

        outputTextElem.value = vigenereCipher(text, processedKey, false);
    });
});