# MalagasyTTS

This is a [Plasmo extension](https://docs.plasmo.com/) project bootstrapped with [`plasmo init`](https://www.npmjs.com/package/plasmo).

## How It Works
- **Context Menu**: Right-click on any selected text and choose "MalagasyTTS: Traducir texto seleccionado" from the context menu.
- **Popup**: The extension popup displays the progress of the translation and text-to-speech process, allowing users to copy the translated text or play the generated audio.
- **Background Processing**: The background script handles language detection, translation, and text-to-speech synthesis through requests to the MalagasyTTS server.
- **Options Page**: Allows users to configure the API endpoint used by the extension.

## File Structure
- **popup.tsx**: 
  - Handles the UI for the extension popup.
  - Displays the selected text, detected language, translation, and provides options to copy the translated text or play the generated audio.
  - Communicates with the background script to receive translation and audio data.
- **background.js**: 
  - Manages the core processing of language detection, translation, and text-to-speech synthesis through API requests to the server.
  - Handles API requests and processes multipart responses to extract JSON data and audio files.
  - Communicates with the popup via a persistent connection to send data or error messages.
  - Configures the context menu for the extension and listens for user interactions.
- **options.tsx**: 
  - Provides a settings page where users can configure the API endpoint.
  - Saves the API URL to `chrome.storage.local` and updates the background script dynamically when changes are made.

## Dependencies
- **plasmo**: Plasmo framework for building browser extensions.
- **react** and **react-dom**: For building the popup and options page UI.
- **react-loading-skeleton**: Displays loading placeholders while waiting for data.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/malagasy-tts-alpha.git
   cd malagasy-tts-alpha
2. Install dependencies:
    ```bash
    npm install
3. Build the extension:
    ```bash
    npm run build
4. Load the extension in your browser:
    - Open your browser's extensions page.
    - Enable "Developer mode."
    - Click "Load unpacked" and select the build folder.

## Usage
1. Select text on a webpage.
2. Right-click and choose "MalagasyTTS: Translate selected text."
3. The popup will display the detected language, translation, and options to copy the text or play the audio.

## Configuration
Open the options page by navigating to the extension settings.
Enter the desired API endpoint and save the changes.

## Download the extension
MalagasyTTS is currently available for:
- [Chrome]()