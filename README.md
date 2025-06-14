<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]

<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="assets/icon.png" alt="Logo" width="80" height="80">
  </a>

  <h1 align="center">MalagasyTTS</h1>

  <p align="center">
    Translate and listen to any text in Malagasy!
    <br />
    <a href="https://github.com/andrespm2000/MalagasyTTS-Extension"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/andrespm2000/MalagasyTTS-Extension/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/andrespm2000/MalagasyTTS-Extension/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

## About The Project

![Demo GIF][extension-demo-gif]
![Options GIF][options-demo-gif]

MalagasyTTS allows you to select any text on the webpage for translating to Malagasy, along with a TTS narration.
<br/> 
You can also easily configure the server endpoint and models used for language detection, translation and narration for a more personalized experience.
<br/>
You can find the MalagasyTTS server repo [here](https://github.com/andrespm2000/MalagasyTTS-Server).

## Getting the extension
MalagasyTTS is available for:

[![Chrome][chrome-logo]](https://chromewebstore.google.com/detail/malagasytts/bnonpijfncbepeemidcinfbepdhjcacp)
[![Firefox][firefox-logo]](https://addons.mozilla.org/en-US/firefox/addon/malagasytts/)

## How to use it
1. Select text on a webpage.
2. Right-click and choose "MalagasyTTS: Translate selected text"
3. The popup will display the detected language, translation, and options to copy the text or play the audio.
4. For configuring the extension, open the options page by navigating to the extension settings.
Enter the desired API endpoint and/or models and save the changes.

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
  - Provides a settings page where users can configure the API endpoint and models.
  - Saves the API and models URL to `chrome.storage.local` and updates the background script dynamically when changes are made.

## Built with
<a href="https://www.plasmo.com/"><img src="assets/plasmo.png" alt="Uvicorn" width="90" style="vertical-align:middle" /></a>
[![React][react-logo]][react-url]

## Installation
1. Make sure to have the latest version of npm:
  ```bash
  npm install npm@latest -g
  ```
2. Clone the repository:
  ```bash
   git clone https://github.com/your-repo/MalagasyTTS-Extension.git
   cd MalagasyTTS-Extension
  ```
3. Install dependencies:
  ```bash
    npm install
  ```
4. Make a developer build:
  ```bash
    npm run dev
  ```
  or
  ```bash
    plasmo dev
  ```
5. Load the extension in Chrome:
    - Open Chrome's extensions page.
    - Enable "Developer mode."
    - Click "Load unpacked" and select the build folder.
6. Build and package the extension:
  ```bash
    plasmo build
    plasmo package
  ```
  or, for Firefox:
  ```bash
    plasmo build --target=firefox-mv3
    plasmo package --target=firefox-mv3
  ```
## Contact

Andrés Perdomo Martínez - [![LinkedIn][linkedin-shield]][linkedin-url] - andresperdomo737@gmail.com

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[contributors-shield]: https://img.shields.io/github/contributors/andrespm2000/MalagasyTTS-Extension.svg?style=for-the-badge
[contributors-url]: https://github.com/andrespm2000/MalagasyTTS-Extension/graphs/contributors

[forks-shield]: https://img.shields.io/github/forks/andrespm2000/MalagasyTTS-Extension.svg?style=for-the-badge
[forks-url]: https://github.com/andrespm2000/MalagasyTTS-Extension/network/members

[stars-shield]: https://img.shields.io/github/stars/andrespm2000/MalagasyTTS-Extension.svg?style=for-the-badge
[stars-url]: https://github.com/andrespm2000/MalagasyTTS-Extension/stargazers

[issues-shield]: https://img.shields.io/github/issues/andrespm2000/MalagasyTTS-Extension.svg?style=for-the-badge
[issues-url]: https://github.com/andrespm2000/MalagasyTTS-Extension/issues

[linkedin-shield]: https://custom-icon-badges.demolab.com/badge/LinkedIn-0A66C2?logo=linkedin-white&logoColor=fff
[linkedin-url]: https://www.linkedin.com/in/andres-perdomo-12bb3b1ba/

[extension-demo-gif]: assets/gif-translation.gif
[options-demo-gif]: assets/gif-options.gif

[chrome-logo]: https://img.shields.io/badge/Google_chrome-4285F4?style=for-the-badge&logo=Google-chrome&logoColor=white
[firefox-logo]: https://img.shields.io/badge/Firefox_Browser-FF7139?style=for-the-badge&logo=Firefox-Browser&logoColor=white

[react-logo]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[react-url]: https://reactjs.org/
