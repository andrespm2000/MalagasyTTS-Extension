import { useState, useEffect } from "react";
import extensionIcon from './assets/icon.png';

/**
 * Main component of the extension's options page.
 * Allows the user to configure the API endpoint used by the extension.
 */
function OptionsIndex() {
  /** State that stores the API URL configured by the user. */
  const [apiUrl, setApiUrl] = useState("")

  /**
   * Effect that loads the initial value of `apiUrl` from `chrome.storage.local`.
   */
  useEffect(() => {
    chrome.storage.local.get("apiUrl", (result) => {
      if (result.apiUrl) {
        setApiUrl(result.apiUrl);
      }
    });
  }, []);

  /**
   * Saves the value of `apiUrl` in `chrome.storage.local`.
   * Displays an alert to the user indicating that the changes have been saved successfully.
   */
  const handleSave = () => {
    chrome.storage.local.set({ apiUrl }, () => {
      alert("API URL guardado correctamente.");
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
        <h1 style={{ margin: 0 }}>Opciones</h1>
      </div>
      <hr style={{ margin: "10px 0", border: "1px solid #ccc" }} />
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
        <h2 style={{ margin: 0 }}>API endpoint</h2>
        <input
          type="text"
          placeholder="API endpoint"
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
          style={{
            width: "400px",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
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
        Guardar cambios
      </button>
    </div>
  )
}

export default OptionsIndex