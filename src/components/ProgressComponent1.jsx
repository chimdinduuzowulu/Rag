import React from 'react';

const ProgressComponent = ({ recommendations }) => {
  return (
    <div className="progress-container">
      <h2 className="text-2xl font-bold mb-4">Progress Recommendations</h2>
      <p>{recommendations}</p>
    </div>
  );
};

export default ProgressComponent;
