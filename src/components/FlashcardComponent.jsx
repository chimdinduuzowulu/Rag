import React, { useState } from "react";

const FlashcardComponent = ({ flashcards, addFlashcard }) => {
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  const handleAddFlashcard = () => {
    if (newQuestion && newAnswer) {
      addFlashcard(newQuestion, newAnswer);
      setNewQuestion("");
      setNewAnswer("");
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold">Flashcards</h2>

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
        <button
          onClick={handleAddFlashcard}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Flashcard
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {flashcards.length === 0 ? (
          <p>No flashcards available. Add some to get started!</p>
        ) : (
          flashcards.map((flashcard, index) => (
            <div
              key={index}
              className="relative w-full h-60 border p-4 hover:shadow-lg transition-shadow duration-300 group mb-6"
              style={{ perspective: "1000px" }}
            >
              <div
                className="relative w-full h-full transition-transform duration-500 transform-style-preserve-3d hover:rotate-y-180"
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                {/* front */}
                <div
                  className="absolute inset-0 flex items-center justify-center bg-white border p-4 overflow-hidden hover:cursor-pointer hover:rotate-y-180"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(0deg)",
                  }}
                >
                  <p className="text-center">{flashcard.question}</p>
                </div>

                {/* back */}
                <div
                  className="absolute inset-0 flex items-center justify-center bg-blue-100 border p-4 overflow-hidden hover:cursor-pointer hover:rotate-y-180"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <p className="text-center">{flashcard.answer}</p>
                </div>
              </div>

              {/* Buttons for marking learned */}
              {/* <div className="mt-4">
                {!flashcard.learned ? (
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() => markFlashcardAsLearned(index)}
                  >
                    Mark as Learned
                  </button>
                ) : (
                  <span className="text-green-500 font-bold">Learned</span>
                )}
              </div> */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FlashcardComponent;
