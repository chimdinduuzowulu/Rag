import React from 'react';

const InputForm = ({ input, setInput }) => (
  <div>
    <label htmlFor="input" className="block text-sm font-medium text-gray-700">Enter Topic:</label>
    <input
      id="input"
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      className="mt-1 p-2 border border-gray-300 rounded w-full"
    />
  </div>
);

export default InputForm;
