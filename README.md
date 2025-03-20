# Page Summarizer Chrome Extension

A Chrome extension that uses Google's Gemini AI to generate concise summaries of web pages in multiple languages.

## Features

- Summarize any web page in 100-150 words
- Support for multiple languages
- Material Design UI
- Save API key for consecutive use
- Download summaries as text files
- Real-time notifications

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory

## Usage

1. Get a Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)
2. Click the extension icon in your Chrome toolbar
3. Enter your Gemini API key and click the save button
4. Select your preferred language from the dropdown menu
5. Click "Summarize" to generate a summary of the current page
6. Use the "Download" button to save the summary as a text file

## Supported Languages

- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Italian (it)
- Portuguese (pt)
- Russian (ru)
- Chinese (zh)
- Japanese (ja)
- Korean (ko)

## Privacy & Security

- Your Gemini API key is stored securely in Chrome's sync storage
- The extension only processes the current page's content when you click the summarize button
- No data is collected or stored by the extension

## Development

The extension is built using:
- HTML5
- CSS3 (with Material Design)
- JavaScript (ES6+)
- Chrome Extension APIs
- Google Gemini AI API

## License

MIT License - feel free to use this extension for personal or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 