import React, { useState } from 'react';

const FlashcardComponent = ({ flashcards, setFlashcardsLearned, markFlashcardAsLearned, addFlashcard }) => {
  const [showBack, setShowBack] = useState({}); // State to toggle showing the back of flashcards
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  const toggleShowBack = (index) => {
    setShowBack((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleAddFlashcard = () => {
    if (newQuestion && newAnswer) {
      addFlashcard(newQuestion, newAnswer);
      setNewQuestion('');
      setNewAnswer('');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Flashcards</h2>

      {/* Form to add new flashcard */}
      <div className="my-4">
        <input
          type="text"
          placeholder="Enter question"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          className="border px-2 py-1 mr-2"
        />
        <input
          type="text"
          placeholder="Enter answer"
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          className="border px-2 py-1 mr-2"
        />
        <button onClick={handleAddFlashcard} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Flashcard
        </button>
      </div>

      {/* Displaying flashcards */}
      <div>
        {flashcards.length === 0 ? (
          <p>No flashcards available. Add some to get started!</p>
        ) : (
          flashcards.map((flashcard, index) => (
            <div key={index} className="border p-4 mb-2">
              <div>
                {/* Toggle front (question) and back (answer) */}
                {/* <p onClick={() => toggleShowBack(index)} className="cursor-pointer">
                  {showBack[index] ? flashcard.answer : flashcard.question}
                </p> */}

                 {/* Toggle front (question) and back (answer) with animation */}
                 <p
                    onClick={() => toggleShowBack(index)}
                    className={`cursor-pointer transition-transform duration-300 transform ${showBack[index] ? ' text-blue-600' : 'font-normal'}`}
                    style={{ display: 'inline-block' }}
                  >
                    {showBack[index] ? flashcard.answer : flashcard.question}
                  </p>


                <small className="block text-gray-500">Click to flip</small>
              </div>

              {/* Buttons for marking learned/review later */}
              <div className="mt-2">
                {!flashcard.learned ? (
                  <>
                    <button
                      className="bg-green-500 text-white px-4 py-2 mr-2 rounded"
                      onClick={() => markFlashcardAsLearned(index)}
                    >
                      Mark as Learned
                    </button>
                    <button
                      className="bg-yellow-500 text-white px-4 py-2 rounded"
                      onClick={() => alert('Review later functionality here')}
                    >
                      Review Later
                    </button>
                  </>
                ) : (
                  <span className="text-green-500 font-bold">Learned</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FlashcardComponent;
