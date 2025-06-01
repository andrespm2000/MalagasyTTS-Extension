/**
 * URL for the server API endpoint and model URIs.
 * Can be overwritten with a value stored in `chrome.storage.local`.
 */
const config = {
  apiUrl: "http://prodiasv21.fis.usal.es:8000",
  detModel: "papluca/xlm-roberta-base-language-detection",
  transModel: "facebook/nllb-200-distilled-600M",
  narrModel: "facebook/mms-tts-mlg"
}

/**
 * Header for the API requests.
 */
const apiHeader = {
  "Content-Type": "application/x-www-form-urlencoded"
};

/**
 * Retrieves the data stored in `chrome.storage.local` and overwrites it if it exists.
 */
chrome.storage.local.get(["apiUrl","detModel","transModel","narrModel"], (result) => {
  config.apiUrl = result.apiUrl && result.apiUrl.trim() ? result.apiUrl : config.apiUrl;
  config.detModel = result.detModel && result.detModel.trim() ? result.detModel : config.detModel;
  config.transModel = result.transModel && result.transModel.trim() ? result.transModel : config.transModel;
  config.narrModel = result.narrModel && result.narrModel.trim() ? result.narrModel : config.narrModel;
});

/**
 * Listens for changes in `chrome.storage` and updates the API URL if it changes.
 */
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.apiUrl) config.apiUrl = changes.apiUrl.newValue; 
  if (changes.detModel) config.detModel = changes.detModel.newValue; 
  if (changes.transModel) config.transModel = changes.transModel.newValue; 
  if (changes.narrModel) config.narrModel = changes.narrModel.newValue; 
});

console.log(config);

/**
 * Communication port with the popup.
 * Initialized as `null` and updated when connecting with the popup.
 */
let port = null;

/**
 * Listens for connections from the popup and handles disconnection.
 */
chrome.runtime.onConnect.addListener((p) => {
  port = p;
  port.onDisconnect.addListener(() => {
    port = null;
  });
});

/**
 * Pauses execution for a specific number of milliseconds
 * @param ms - Time in milliseconds to pause.
 * @returns A promise that resolves after the specified time.
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Splits a `Buffer` into parts using a delimiter.
 * @param delimiter - The delimiter used to split the `Buffer`.
 * @returns An array of `Buffer` split by the delimiter.
 */
Buffer.prototype.split = function (delimiter) {
  const result = [];
  let start = 0;
  let index;
  while ((index = this.indexOf(delimiter, start)) !== -1) {
    result.push(this.slice(start, index));
    start = index + delimiter.length;
  }
  result.push(this.slice(start));
  return result;
};

/**
 * Processes the selected text by sending it to the API and handling the response.
 * @param selectionText - Selected text to be sent to the API.
 */
async function speakProcess(selectionText){

  let requestData = new URLSearchParams({
    "input": selectionText,
    "detModel": config.detModel,
    "transModel": config.transModel,
    "narrModel": config.narrModel
  });


  fetch(config.apiUrl+"/models", {
    method: 'POST',
    headers: apiHeader,
    body: requestData
  })
  .then(async (response) => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const boundary = "boundary123";
    let responseBuffer = Buffer.from(await response.arrayBuffer());
    let boundaryBuffer = Buffer.from(`--${boundary}`, 'utf-8');
    let parts = responseBuffer.split(boundaryBuffer);
    let jsonData = null;
    let audioBuffer = null;

    // Processes the response parts to extract JSON and audio
    parts.forEach(part => {
      let headerEndIndex = part.indexOf('\r\n\r\n');
      if (headerEndIndex !== -1) {
        let headers = part.slice(0, headerEndIndex).toString('utf-8');
        let body = part.slice(headerEndIndex + 4);

        if (headers.includes("Content-Type: application/json")) {
          // Extract JSON
          jsonData = JSON.parse(body.toString('utf-8').trim());
        } else if (headers.includes("Content-Type: audio/wav")) {
          // Extract audio file
          audioBuffer = body;
        }
      }
    });

    if (jsonData && audioBuffer) {
      
      const audioBlob = new Blob([audioBuffer], { type: 'audio/wav' });
      const base64Blob = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Data = reader.result;
          resolve(base64Data);
        };
      });
      // Send a message to the popup with the data
      if (port) {
        port.postMessage({ type: "RESPONSE_DATA", data: {
          json: jsonData,
          base64Blob: base64Blob
        }});
      }
    }
  })
  .catch(error => {
    // Error handling: send message to the popup
    if (port) {
      port.postMessage({ type: "ERROR", message: error.message });
    }
  });
}

/**
 * Sets up the context menu when the extension is installed.
 */
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "plasmo-show-text",
    title: "MalagasyTTS: Translate selected text",
    contexts: ["selection"]
  });
  chrome.storage.local.get(["apiUrl", "detModel", "transModel", "narrModel"], (result) => {
    const defaults = {};
    if (!result.apiUrl) defaults.apiUrl = config.apiUrl;
    if (!result.detModel) defaults.detModel = config.detModel;
    if (!result.transModel) defaults.transModel = config.transModel;
    if (!result.narrModel) defaults.narrModel = config.narrModel;
    if (Object.keys(defaults).length > 0) {
      chrome.storage.local.set(defaults);
    }
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "plasmo-show-text" && info.selectionText) {
    chrome.storage.local.set({ selectedText: info.selectionText });
    chrome.action.openPopup();
    
    setTimeout(() => {
      if (port) {
        port.postMessage({ type: "GET_SELECTED_TEXT", text: info.selectionText });
      }
    }, 1000);

    speakProcess(info.selectionText);
  }
});