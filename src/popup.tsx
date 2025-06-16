import React from 'react';
import { useEffect, useState, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import './translator.css';
import audioIcon from '../assets/audio-icon.png';
import copyIcon from '../assets/copy-icon.png';
import extensionIcon from '../assets/icon.png';

/**
 * Main component of the extension's popup.
 * Displays the selected text, its translation, and allows playing the audio or copying the translated text.
 */
const Popup = () => {

  /**
   * Map of language codes to names in Malagasy.
   */
  const languages = {
    "ar": "Arabo",
    "bg": "Bolgara",
    "de": "Alemana",
    "el": "Grika",
    "en": "Anglisy",
    "es": "Espaniôla",
    "fr": "Frantsay",
    "hi": "Hindi",
    "it": "Italiana",
    "ja": "Japoney",
    "nl": "Holandey",
    "pl": "Poloney",
    "pt": "Portogey",
    "ru": "Rosiana",
    "sw": "Swahili",
    "th": "Taỳ",
    "tr": "Tiorka",
    "ur": "Urdu",
    "vi": "Vietnamiana",
    "zh": "Sinoa"
  }

  /** Text selected by the user. */
  const [selectedText, setSelectedText] = useState("");
  /** Detected language of the selected text. */
  const [detectedLang, setDetectedLang] = useState<string | null>(null);
  /** Translated text. */
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  /** URL of the generated audio. */
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  /** Error message in case of failure. */
  const [error, setError] = useState<string | null>(null);
  /** Audio playback state. */
  const [isPlaying, setIsPlaying] = useState(false);

  const portRef = useRef<chrome.runtime.Port | null>(null);

  /**
   * Effect that establishes the connection with the background script and handles received messages.
   */
  useEffect(() => {
    const port = chrome.runtime.connect();
    portRef.current = port;

    /**
     * Interface for the response data message.
     */
    interface ResponseDataMessage {
      type: "RESPONSE_DATA";
      data: {
      json: any;
      base64Blob: string;
      };
    }

    /**
     * Interface for the response data retry message.
     */
    interface ResponseDataRetryMessage {
    type: "RESPONSE_DATA_RETRY";
    data: {
      json: any;
      base64Blob: string;
    };
    }

    /**
     * Interface for the error message.
     */
    interface ErrorMessage {
      type: "ERROR";
      message: string;
    }

    /**
     * Interface for the selected text message.
     */
    interface GetSelectedTextMessage {
      type: "GET_SELECTED_TEXT";
      text: string;
    }

    /**
     * Type that groups all possible received messages.
     */
    type Message = ResponseDataMessage | ResponseDataRetryMessage | ErrorMessage | GetSelectedTextMessage;

    /**
     * Handles messages received from the background script.
     * @param message - Received message.
     */
    const handleMessage = (message: Message) => {
      if (message.type === "GET_SELECTED_TEXT") {
        setSelectedText(message.text);
      } else if (message.type === "RESPONSE_DATA" || message.type === "RESPONSE_DATA_RETRY") {
      if (message.type === "RESPONSE_DATA") setDetectedLang(message.data.json.detected_lang);
      setTranslatedText(message.data.json.translated_text);
       // Decodes the audio in base64 and generates a Blob URL
      const byteCharacters = atob(message.data.base64Blob.split(',')[1]);
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
    
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
    
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      const audioBlob = new Blob(byteArrays, { type: "audio/wav" });
      const blobUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(blobUrl);

      setError(null);
      } else if (message.type === "ERROR") {
      setError(message.message);
      }
    };

    port.onMessage.addListener(handleMessage);

    return () => {
      port.onMessage.removeListener(handleMessage);
      port.disconnect();
      portRef.current = null;
    };
  }, [])

  /**
   * Handles playback of the generated audio.
   */
  const handlePlayAudio = async () => {
    if (!audioUrl) {
      console.error("Audio URL es null/undefined");
      return;
    }
      try {
        setIsPlaying(true);
        let ttsAudio = new Audio(audioUrl);
        ttsAudio.onerror = (e) => {
          console.error("Audio error:", e);
          setIsPlaying(false);
        };
        await ttsAudio.play();
  
        ttsAudio.onended = () => setIsPlaying(false);

      } catch (error) {
        console.error("Error playing audio:", error);
        setIsPlaying(false);
      }
};

  /**
   * Copies the translated text to the clipboard.
   */
const handleCopyText = () => {
  if (translatedText) {
    navigator.clipboard.writeText(translatedText)
      .catch((error) => {
        console.error("Error al copiar el texto:", error);
      });
  }
};

  return (
    <div className="container">
      <div className="header">
      <img src={extensionIcon} alt="Extension Icon" className="extension-icon" />
      <h1>
        Malagasy<span style={{ color: "#FFFFFF" }}>T</span>
        <span style={{ color: "#F9423A" }}>T</span>
        <span style={{ color: "#00843D" }}>S</span>
      </h1>
    </div>
    <hr className="divider" />
    {selectedText && !error ? (
      <div>
        <div className={`input-group ${!selectedText ? "skeleton-active" : ""}`}>
          <p className="selected-text">{selectedText}</p>
        </div>
        <div className="detected-lang">
          {detectedLang && detectedLang in languages ? (
            <p>
              <strong>Fiteny hita:</strong> {languages[detectedLang as keyof typeof languages]}
            </p>
          ) : (
            <Skeleton height={20} width="100%" baseColor="#151C12" highlightColor="#F9423A" />
          )}
        </div>
        <div className="detected-lang">
          {detectedLang && detectedLang in languages ? (
            <>
              <label htmlFor="language-select" style={{ color: "#fff", marginRight: 8 }}><strong>Mifidy fiteny:</strong></label>
              <select
                id="language-select"
                onChange={async (e) => {
                  const langCode = e.target.value;
                  if (!langCode) return;
                  setTranslatedText(null);
                  if (portRef.current) {
                    portRef.current.postMessage({
                      type: "TRANSLATE_RETRY",
                      langCode,
                      text: selectedText,
                    });
                  }
                }}
                defaultValue=""
                style={{ padding: "2px 4px", borderRadius: 4, fontSize: "0.75em", width: "auto", minWidth: 80, maxWidth: 160, background: "#151C12",color: "#FFFFFF",border: "1px solid #E0E0E0"}}
              >
                <option value="" disabled>Fiteny</option>
                {Object.entries(languages).map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
            </>
          ) : (
            <Skeleton height={20} width="100%" baseColor="#151C12" highlightColor="#F9423A" />
          )}
        </div>
        <div className={`translation-box ${!translatedText ? "skeleton-active" : ""}`}>
          {translatedText ? (
            <>
              <p className="translated-text">{translatedText}</p>
              <div className="button-group">
                <button onClick={handleCopyText} className="copy-button" title="Kopia lahatsoratra nadika">
                  <img src={copyIcon} alt="Kopia" className="copy-icon" />
                </button>
                {audioUrl && (
                  <button
                    onClick={handlePlayAudio}
                    disabled={isPlaying}
                    className="audio-button"
                    title={isPlaying ? "Mamerina ny feo..." : "Mameno feo"}
                  >
                    <img src={audioIcon} alt="Henoy" className="audio-icon" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <Skeleton height={80} width="100%" baseColor="#151C12" highlightColor="#F9423A" />
          )}
        </div>
      </div>
    ) : (
      <div className="no-selection">
        {error ? (
          <div>
            <p style={{ color: "red", textAlign: "center" }}>
              Error: {error}
            </p>
          </div>
        ) : (
          <div>
            <p style={{ color: "#FFFFFF", textAlign: "center" }}>
              Misafidiana lahatsoratra handikana azafady.
            </p>
          </div>
        )}
      </div>
    )}
    </div>
  )
}

export default Popup
