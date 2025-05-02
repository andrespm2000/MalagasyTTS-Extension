import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import './translator.css';
import audioIcon from './assets/audio-icon.png';
import copyIcon from './assets/copy-icon.png';
import extensionIcon from './assets/icon.png';

/**
 * Main component of the extension's popup.
 * Displays the selected text, its translation, and allows playing the audio or copying the translated text.
 */
const Popup = () => {
  
  /**
   * Interface for the JSON data received from the backend.
   */
  interface JsonData {
    /** Language detected in the selected text. */
    detected_lang: string;
    /** Translated text. */
    translated_text: string;
  }

  /**
   * Map of language codes to names in Malagasy.
   */
  const languages = {
    "ar": "Arabo",
    "bg": "Bologara",
    "de": "Alemà",
    "el": "Grika",
    "en": "Anglisy",
    "es": "Espaniola",
    "fr": "Frantsay",
    "hi": "Hindi",
    "it": "Italiana",
    "ja": "Japoney",
    "nl": "Holandey",
    "pl": "Poloney",
    "pt": "Portogey",
    "ru": "Rosiana",
    "sw": "Soahily",
    "th": "Thai",
    "tr": "Tiorka",
    "ur": "Ordò",
    "vi": "Vietnamiana",
    "zh": "Sinoa"
  }

  /** Text selected by the user. */
  const [selectedText, setSelectedText] = useState("");
  /** JSON data received from the backend. */
  const [jsonData, setJsonData] = useState<JsonData | null>(null);
  /** URL of the generated audio. */
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  /** Error message in case of failure. */
  const [error, setError] = useState<string | null>(null);
  /** Audio playback state. */
  const [isPlaying, setIsPlaying] = useState(false);

  /**
   * Effect that establishes the connection with the background script and handles received messages.
   */
  useEffect(() => {
    const port = chrome.runtime.connect();

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
    type Message = ResponseDataMessage | ErrorMessage | GetSelectedTextMessage;

    /**
     * Handles messages received from the background script.
     * @param message - Received message.
     */
    const handleMessage = (message: Message) => {
      if (message.type === "GET_SELECTED_TEXT") {
        setSelectedText(message.text);
      } else if (message.type === "RESPONSE_DATA") {
      setJsonData(message.data.json);
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
  if (jsonData?.translated_text) {
    navigator.clipboard.writeText(jsonData.translated_text)
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
      <div className={`input-group ${!selectedText ? "skeleton-active" : ""}`}>
        {selectedText ? <p className="selected-text">{selectedText}</p> 
        : (<Skeleton height={60} width="100%" baseColor="#151C12" highlightColor="#F9423A"/>)}
      </div>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      <div className="detected-lang">
        {jsonData && jsonData.detected_lang in languages ? <p><strong>Detectado:</strong> {languages[jsonData.detected_lang as keyof typeof languages]}</p> : (<Skeleton height={20} width="100%" baseColor="#151C12" highlightColor="#F9423A"/>)}
      </div>
      <div className={`translation-box ${!jsonData ? "skeleton-active" : ""}`}>
      {jsonData ? (
        <>
          <p className="translated-text">{jsonData.translated_text}</p>
          <div className="button-group">
            <button onClick={handleCopyText} className="copy-button" title="Copiar texto traducido">
                <img src={copyIcon} alt="Copy" className="copy-icon" />
            </button>
          {audioUrl && (
            <button
                  onClick={handlePlayAudio}
                  disabled={isPlaying}
                  className="audio-button"
                  title={isPlaying ? "Reproduciendo..." : "Reproducir audio"}
                >
                  <img src={audioIcon} alt="Listen" className="audio-icon" />
            </button>
          )}
          </div>
        </>
      ) : (
        <Skeleton height={80} width="100%" baseColor="#151C12" highlightColor="#F9423A"/>
      )}
    </div>
    </div>
  )
}

export default Popup
