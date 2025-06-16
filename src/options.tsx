import React from 'react';
import { useState, useEffect } from "react";
import Alert from '@mui/material/Alert';
import extensionIcon from '../assets/icon.png';
import './options.css';

const config = {
  apiUrl: "https://esalab-big.taild1b22.ts.net",
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
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
   const [fadeOut, setFadeOut] = useState(false);

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

  useEffect(() => {
    if (showSuccess) {
      setFadeOut(false);
      const fadeTimer = setTimeout(() => setFadeOut(true), 1500); // empieza a desvanecer después de 2.5s
      const hideTimer = setTimeout(() => setShowSuccess(false), 3500); // oculta después de 3.5s
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [showSuccess]);

  /**
   * Saves the values `chrome.storage.local`.
   * Displays an alert to the user indicating that the changes have been saved successfully.
   */
  const handleSave = async () => {
    if (apiUrl && apiUrl !== config.apiUrl) {
      const error = await validateForm(apiUrl);
      setError(error);
      if (error) return;
    }
    setError("");
    chrome.storage.local.set({ apiUrl, detModel, transModel, narrModel }, () => {
      setShowSuccess(true);
    });
  };

interface ValidateForm {
  (endpoint: string): Promise<string>;
}

const validateForm: ValidateForm = async (endpoint) => {
  let error: string = "";

  try {
    const response: Response = await fetch(endpoint, { method: "GET" });
    const text: string = await response.text();
    if (!text.includes("<h2>MalagasyTTS Server is running.</h2>")) {
      error = "Error: Endpoint API tsy mety na mpizara tsy misy";
    }
  } catch (e) {
    error = "Error: Endpoint API tsy mety na mpizara tsy misy";
  }

  return error;
};

  return (
    <div>
      <div className="options-header">
        <img
          src={extensionIcon}
          alt="Extension Icon"
          style={{ width: "32px", height: "32px" }}
        />
        <h1 className="options-title">Safidy</h1>
      </div>
      <hr className="options-hr" />
      <div className="options-form">
      <div className="options-group">
        <h2>API endpoint</h2>
        <input
          type="text"
          placeholder={apiUrl ? apiUrl : config.apiUrl}
          onChange={(e) => {
            setApiUrl(e.target.value)
          }}
          className={`options-input${error ? " options-input-error" : ""}`}
        />
        {error && (
                        <span className="error-message">
                            {error}
                        </span>
                    )}
      </div>
      <div className="options-group">
        <h2>Modely famantarana</h2>
        <input
          type="text"
          placeholder={detModel ? detModel : config.detModel}
          onChange={(e) => setDetModel(e.target.value)}
          className="options-input"
        />
      </div>
      <div className="options-group">
        <h2>Modely fandikana</h2>
        <input
          type="text"
          placeholder={transModel ? transModel : config.transModel}
          onChange={(e) => setTransModel(e.target.value)}
          className="options-input"
        />
      </div>
      <div className="options-group">
        <h2>Modely fitantarana</h2>
        <input
          type="text"
          placeholder={narrModel ? narrModel : config.narrModel}
          onChange={(e) => setNarrModel(e.target.value)}
          className="options-input"
        />
      </div>
    </div>
      <button
        onClick={handleSave}
        className="options-save-btn"
      >
        Tahiry fanovana
      </button>
       {showSuccess && (
        <div
          className={`options-alert-overlay${fadeOut ? " fade-out" : ""}`}
        >
          <Alert severity="success">
            Angona voatahiry tsara!
          </Alert>
        </div>
      )}
    </div>
  )
}

export default OptionsIndex