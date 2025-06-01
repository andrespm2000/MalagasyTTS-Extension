import { useState, useEffect } from "react";
import extensionIcon from '../assets/icon.png';

const config = {
  apiUrl: "http://prodiasv21.fis.usal.es:8000",
  detModel: "papluca/xlm-roberta-base-language-detection",
  transModel: "facebook/nllb-200-distilled-600M",
  narrModel: "facebook/mms-tts-mlg"
}

/**
 * Main component of the extension's options page.
 * Allows the user to configure the API endpoint and models used by the extension.
 */
function OptionsIndex() {
  /** State that stores the API URL and models configured by the user. */
  const [apiUrl, setApiUrl] = useState("");
  const [detModel, setDetModel] = useState("");
  const [transModel, setTransModel] = useState("");
  const [narrModel, setNarrModel] = useState("");

  /**
   * Effect that loads the initial values from `chrome.storage.local`.
   */
  useEffect(() => {
  chrome.storage.local.get(["apiUrl", "detModel", "transModel", "narrModel"], (result) => {
    setApiUrl(result.apiUrl ?? config.apiUrl);
    setDetModel(result.detModel ?? config.detModel);
    setTransModel(result.transModel ?? config.transModel);
    setNarrModel(result.narrModel ?? config.narrModel);
  });
}, []);

  /**
   * Saves the values `chrome.storage.local`.
   * Displays an alert to the user indicating that the changes have been saved successfully.
   */
  const handleSave = () => {
    chrome.storage.local.set({ apiUrl, detModel, transModel, narrModel }, () => {
      alert("Data saved correctly!");
    });
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img
          src={extensionIcon}
          alt="Extension Icon"
          style={{ width: "32px", height: "32px" }}
        />
        <h1 style={{ margin: 0 }}>Options</h1>
      </div>
      <hr style={{ margin: "10px 0", border: "1px solid #ccc" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "20px" }}>
      <div>
        <h2 style={{ margin: "0 0 5px 0" }}>API endpoint</h2>
        <input
          type="text"
          placeholder={apiUrl ? apiUrl : config.apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
          style={{
            width: "400px",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </div>
      <div>
        <h2 style={{ margin: "0 0 5px 0" }}>Detection model</h2>
        <input
          type="text"
          placeholder={detModel ? detModel : config.detModel}
          onChange={(e) => setDetModel(e.target.value)}
          style={{
            width: "400px",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </div>
      <div>
        <h2 style={{ margin: "0 0 5px 0" }}>Translation model</h2>
        <input
          type="text"
          placeholder={transModel ? transModel : config.transModel}
          onChange={(e) => setTransModel(e.target.value)}
          style={{
            width: "400px",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </div>
      <div>
        <h2 style={{ margin: "0 0 5px 0" }}>Narration model</h2>
        <input
          type="text"
          placeholder={narrModel ? narrModel : config.narrModel}
          onChange={(e) => setNarrModel(e.target.value)}
          style={{
            width: "400px",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </div>
    </div>
      <button
        onClick={handleSave}
        style={{
          padding: "10px 20px",
          backgroundColor: "#00843D",
          color: "#FFFFFF",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Save changes
      </button>
    </div>
  )
}

export default OptionsIndex