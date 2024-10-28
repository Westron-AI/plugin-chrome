


function replaceSelectedText(translatedText) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return; 

    const range = selection.getRangeAt(0); 
    range.deleteContents(); 


    const newNode = document.createTextNode(translatedText);
    range.insertNode(newNode);


    selection.removeAllRanges();
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "replaceText") {
        replaceSelectedText(request.translatedText);
    }
});
