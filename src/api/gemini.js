import { GoogleGenerativeAI } from '@google/generative-ai';

// const apiKey = import.meta.env.VITE_GEMINI_API_KEY;  // Use import.meta.env for Vite
const apiKey = 'AIzaSyAkqLjnnT3q5mGmwPGnQnxBorWmnK-BkpA';
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  systemInstruction: `
    Create a personalized online learning assistant that generates quizzes, flashcards, and tracks progress based on user interactions.
    Generate personalized quizzes, provide flashcards for key concepts, track user progress, and offer customization options.
  `,
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain',
};

/* export const getQuizQuestions = async (input) => {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });
    
    const result = await chatSession.sendMessage(`Generate quiz with mixed question types: ${input}`);
    return result.response.text();
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    throw error;
  }
}; */
/* 
export const getQuizQuestions = async (input) => {
    try {
      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });
  
      // Update the prompt to request a well-structured JSON format for the quiz
      const result = await chatSession.sendMessage(`Generate a quiz on the topic: ${input} with multiple-choice, true/false, and fill-in-the-blank questions. Format the response as a JSON array where each question has the format: {"question": "Question text", "type": "multiple-choice/true-false/fill-in-the-blank", "options": ["option1", "option2", "option3", "option4"], "correct": "correct answer"}`);
      
      // Parse the response as JSON to ensure it's structured correctly
      const parsedQuestions = JSON.parse(result.response.text());
      
      return parsedQuestions;
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      throw error;
    }
  }; */
  
  
/* export const getQuizQuestions = async (input) => {
    try {
      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });
  
      // Update the prompt to request a well-structured JSON format for the quiz
      const result = await chatSession.sendMessage(`Generate a quiz on the topic: ${input} with multiple-choice, true/false, and fill-in-the-blank questions. Format the response as a JSON array where each question has the format: {"question": "Question text", "type": "multiple-choice/true-false/fill-in-the-blank", "options": ["option1", "option2", "option3", "option4"], "correct": "correct answer"}`);
      
      // Remove any Markdown backticks or other characters around the JSON data
     // const cleanedResult = result.response.text().replace(/```json|```/g, '').trim();

      // Extract and clean the response text, removing backticks or extra text
    let cleanedResult = result.response.text().replace(/```json|```/g, '').trim();

    // Attempt to extract JSON by finding the first opening brace
    const jsonStartIndex = cleanedResult.indexOf('[');
    if (jsonStartIndex !== -1) {
      cleanedResult = cleanedResult.slice(jsonStartIndex); //Remove anything before the json array
    }
      // Parse the cleaned response as JSON
      const parsedQuestions = JSON.parse(cleanedResult);
      
      return parsedQuestions;
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      throw error;
    }
  }; */


  export const getQuizQuestions = async (input) => {
    try {
      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });
  
      // Send message to generate a quiz and expect JSON in return
      const result = await chatSession.sendMessage(`Generate a quiz on the topic: ${input} with multiple-choice, true/false, and fill-in-the-blank questions. Format the response as a JSON array where each question has the format: {"question": "Question text", "type": "multiple-choice/true-false/fill-in-the-blank", "options": ["option1", "option2", "option3", "option4"], "correct": "correct answer"}`);
  
      // Extract and clean the response text, removing backticks or extra text
      let cleanedResult = result.response.text().replace(/```json|```/g, '').trim();
  
      // Attempt to extract JSON by finding the first opening brace
      const jsonStartIndex = cleanedResult.indexOf('[');
      if (jsonStartIndex !== -1) {
        cleanedResult = cleanedResult.slice(jsonStartIndex);  // Remove anything before the JSON array
      }
  
      // Parse the cleaned result as JSON
      const parsedQuestions = JSON.parse(cleanedResult);
      
      return parsedQuestions;
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      throw error;
    }
  };
  

/* export const getFlashcards = async (input) => {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(`Generate flashcards for: ${input}`);
    return result.response.text();
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    throw error;
  }
}; */

export const getFlashcards = async (input) => {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    // Generate flashcards for the input topic and expect a JSON array
    const result = await chatSession.sendMessage(`Generate flashcards on the topic: ${input}. Format as a JSON array where each flashcard has {"question": "Question text", "answer": "Answer text"}`);

    // Clean the result to remove unwanted text
    let cleanedResult = result.response.text().replace(/```json|```/g, '').trim();

    // Try to extract the JSON array by finding the first '[' character
    const jsonStartIndex = cleanedResult.indexOf('[');
    if (jsonStartIndex !== -1) {
      cleanedResult = cleanedResult.slice(jsonStartIndex);  // Remove text before the array
    }

    // Parse the cleaned response as JSON
    const flashcards = JSON.parse(cleanedResult);

    // Check if it's an array before returning it
    if (Array.isArray(flashcards)) {
      return flashcards; // Return the parsed flashcards
    } else {
      throw new Error('Flashcards response is not a valid array');
    }
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    throw error;
  }
};


export const getProgressRecommendations = async (input) => {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(`Give progress recommendations based on this: ${input}.also, display the number of flashcards, total quizes completed. Also, give the user a nice motivational quote based on his performance`);
    return result.response.text();
  } catch (error) {
    console.error('Error fetching progress recommendations:', error);
    throw error;
  }
};
