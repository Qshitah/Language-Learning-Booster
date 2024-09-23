let originalText = '';
let selectionRange = null;

document.addEventListener('mouseup', async function () {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        chrome.storage.sync.get(['isActive', 'targetLanguage'], async (result) => {
            if (result.isActive) {
                originalText = selectedText; // Save the original text
                selectionRange = window.getSelection().getRangeAt(0); // Save the selection range
                const translation = await translateText(selectedText, result.targetLanguage);
                replaceSelectedText(translation);
            }
        });
    } else if (originalText && selectionRange) {
        restoreOriginalText();
        originalText = ''; // Clear original text after restoring
        selectionRange = null; // Clear the stored range
    }
});

async function translateText(text, targetLanguage) {
    if (targetLanguage === undefined) {
        targetLanguage = 'es';
    }
    const pageLang = document.documentElement.lang || 'en'; // Default to English if no lang attribute
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${pageLang}|${targetLanguage}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.responseData.translatedText;
}

function replaceSelectedText(translated) {
    if (selectionRange) {
        selectionRange.deleteContents(); // Remove the selected text
        selectionRange.insertNode(document.createTextNode(translated)); // Insert the translated text
        window.getSelection().removeAllRanges(); // Clear the selection
    }
}

function restoreOriginalText() {
    if (selectionRange) {
        selectionRange.deleteContents(); // Remove the translated text
        selectionRange.insertNode(document.createTextNode(originalText)); // Insert the original text
        window.getSelection().removeAllRanges(); // Clear the selection
    }
}

// Function to fetch word definition
async function fetchDefinition(word) {
    const targetLanguage = document.documentElement.lang.split('-')[0]; // Fetch the target language
    const url = `https://api.dictionaryapi.dev/api/v2/entries/${targetLanguage}/${word}`;
    const response = await fetch(url);
    if (response.ok) {
        const data = await response.json();
        return data[0].meanings[0].definitions[0].definition; // Adjust based on the API response structure
    }
    return null;
}



// Add event listener for clicks to get word definition
document.addEventListener('click', async function (event) {
    const word = getWordAtMousePosition(event);
    if (word) {
        const definition = await fetchDefinition(word);
        if (definition) {
            showDefinitionPopup(event.pageX, event.pageY, definition);
        }
    }
});

// Get the word at the mouse position
function getWordAtMousePosition(event) {
    const range = document.createRange();
    range.setStart(event.target, 0);
    range.setEnd(event.target, 0);

    const text = window.getSelection().toString().trim();
    return text || ''; // Return the selected text or an empty string
}

// Function to show the definition in a popup
function showDefinitionPopup(x, y, definition) {
    const popup = document.createElement('div');
    popup.style.position = 'absolute';
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
    popup.style.backgroundColor = '#f9f9f9';
    popup.style.border = '1px solid #ccc';
    popup.style.borderRadius = '8px';
    popup.style.padding = '10px';
    popup.style.zIndex = '1000';
    popup.style.color = 'black';
    popup.innerHTML = `<strong>Definition:</strong> ${definition}`;
    document.body.appendChild(popup);

    // Remove popup on mouseout
    const mouseOutHandler = () => {
        popup.remove();
        document.removeEventListener('mouseout', mouseOutHandler);
    };
    document.addEventListener('mouseout', mouseOutHandler);
}
