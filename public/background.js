chrome.runtime.onInstalled.addListener(() => {
    console.log('Language Learning Booster Extension installed');
  });
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'saveWord') {
      chrome.storage.sync.get(['translatedWords'], (result) => {
        const words = result.translatedWords || [];
        words.push(request.word);
        chrome.storage.sync.set({ translatedWords: words });
      });
    }
  });
  