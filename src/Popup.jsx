import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'flag-icons/css/flag-icons.min.css'; // Import flag icons CSS

const Popup = () => {
  const [targetLanguage, setTargetLanguage] = useState('es'); // Default target language
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get(['isActive', 'targetLanguage'], (result) => {
      setIsActive(result.isActive || false);
      setTargetLanguage(result.targetLanguage || 'es'); // Default to 'es' if not set
    });
  }, []);

  const toggleActive = () => {
    const newState = !isActive;
    setIsActive(newState);
    chrome.storage.sync.set({ isActive: newState });
  };

  const updateTargetLanguage = (language) => {
    setTargetLanguage(language);
    chrome.storage.sync.set({ targetLanguage: language }); // Save the selected language
  };

  return (
    <div className="container p-4">
      <h3 className="mb-3 text-center">Language Learning Booster</h3>
      <div className="mb-3">
        <select
          value={targetLanguage}
          onChange={(e) => updateTargetLanguage(e.target.value)}
          className="form-select"
        >
          <option value="en">🇬🇧 English</option>
          <option value="es">🇪🇸 Spanish</option>
          <option value="fr">🇫🇷 French</option>
          <option value="de">🇩🇪 German</option>
          <option value="ar">🇸🇦 Arabic</option>
          <option value="it">🇮🇹 Italian</option>
          <option value="zh">🇨🇳 Chinese</option>
        </select>
      </div>
      <label className="form-check-label mb-3">
        <input type="checkbox" checked={isActive} onChange={toggleActive} className="form-check-input me-2" />
        Auto-translate
      </label>
    </div>
  );
};

export default Popup;
