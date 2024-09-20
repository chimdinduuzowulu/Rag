import React from 'react';

const InputForm = ({ input, setInput, onSubmit }) => {
  return (
    <div className="input-form">
      <textarea
        className="w-full p-2 border border-gray-300 rounded mb-4"
        placeholder="Enter your query..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={onSubmit}>
        Submit
      </button>
    </div>
  );
};

export default InputForm;
