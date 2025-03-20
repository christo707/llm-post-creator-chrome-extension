document.addEventListener('DOMContentLoaded', function() {
    const apiKeyInput = document.getElementById('apiKey');
    const saveApiKeyButton = document.getElementById('saveApiKey');
    const languageSelect = document.getElementById('language');
    const summarizeButton = document.getElementById('summarize');
    const downloadButton = document.getElementById('download');
    const loadingElement = document.getElementById('loading');
    const resultElement = document.getElementById('result');
    const summaryTextElement = document.getElementById('summaryText');

    // Load saved API key
    chrome.storage.sync.get(['geminiApiKey'], function(result) {
        if (result.geminiApiKey) {
            apiKeyInput.value = result.geminiApiKey;
        }
    });

    // Save API key
    saveApiKeyButton.addEventListener('click', function() {
        const apiKey = apiKeyInput.value.trim();
        if (apiKey) {
            chrome.storage.sync.set({ geminiApiKey: apiKey }, function() {
                showNotification('API key saved successfully!');
            });
        } else {
            showNotification('Please enter a valid API key', 'error');
        }
    });

    // Summarize button click handler
    summarizeButton.addEventListener('click', async function() {
        const apiKey = apiKeyInput.value.trim();
        if (!apiKey) {
            showNotification('Please enter your Gemini API key', 'error');
            return;
        }

        loadingElement.classList.remove('hidden');
        resultElement.classList.add('hidden');

        try {
            // Get current tab content
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            const result = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: () => {
                    return document.body.innerText;
                }
            });

            const pageContent = result[0].result;
            const selectedLanguage = languageSelect.value;
            
            // Prepare prompt for Gemini AI
            const prompt = `Please provide a concise summary of the following text in ${getLanguageName(selectedLanguage)}. The summary should be between 100-150 words and capture the main points:\n\n${pageContent}`;

            // Call Gemini API
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            });

            const data = await response.json();
            
            if (data.candidates && data.candidates[0].content.parts[0].text) {
                const summary = data.candidates[0].content.parts[0].text;
                summaryTextElement.textContent = summary;
                resultElement.classList.remove('hidden');
            } else {
                throw new Error('Invalid response from Gemini API');
            }
        } catch (error) {
            showNotification('Error generating summary: ' + error.message, 'error');
        } finally {
            loadingElement.classList.add('hidden');
        }
    });

    // Download button click handler
    downloadButton.addEventListener('click', function() {
        const summary = summaryTextElement.textContent;
        const blob = new Blob([summary], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        
        chrome.downloads.download({
            url: url,
            filename: `page-summary-${timestamp}.txt`,
            saveAs: true
        });
    });

    // Helper function to get language name
    function getLanguageName(code) {
        const languages = {
            'en': 'English',
            'es': 'Spanish',
            'fr': 'French',
            'de': 'German',
            'it': 'Italian',
            'pt': 'Portuguese',
            'ru': 'Russian',
            'zh': 'Chinese',
            'ja': 'Japanese',
            'ko': 'Korean'
        };
        return languages[code] || 'English';
    }

    // Helper function to show notifications
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}); 