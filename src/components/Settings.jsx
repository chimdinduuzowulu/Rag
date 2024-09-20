import React, { useState } from 'react';

const Settings = () => {
  const [learningStyle, setLearningStyle] = useState('visual');
  const [difficulty, setDifficulty] = useState('easy');

  return (
    <div className="settings-container bg-gray-100 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Settings</h2>
      <div>
        <label className="block mb-2">Learning Style:</label>
        <select value={learningStyle} onChange={(e) => setLearningStyle(e.target.value)} className="p-2 border rounded-md">
          <option value="visual">Visual</option>
          <option value="auditory">Auditory</option>
          <option value="kinesthetic">Kinesthetic</option>
        </select>
      </div>
      <div className="mt-4">
        <label className="block mb-2">Difficulty:</label>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="p-2 border rounded-md">
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
    </div>
  );
};

export default Settings;
