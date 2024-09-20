import React, { useEffect, useState } from 'react';
import { getProgressRecommendations } from '../api/gemini';

const Progress = () => {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await getProgressRecommendations('Give me progress recommendations.');
        setProgress(response);
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };
    fetchProgress();
  }, []);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Progress Dashboard</h2>
      {progress ? <p>{progress}</p> : <p className="text-lg">Loading progress...</p>}
    </div>
  );
};

export default Progress;
