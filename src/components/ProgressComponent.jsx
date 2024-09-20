import React from 'react';

const ProgressComponent = ({ recommendations }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold">Progress Recommendations</h2>
      <div dangerouslySetInnerHTML={{ __html: recommendations }} />
    </div>
  );
};

export default ProgressComponent;
