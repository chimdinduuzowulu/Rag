import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;  // Use import.meta.env for Vite
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
  };
  

export const getFlashcards = async (input) => {
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
};

export const getProgressRecommendations = async (input) => {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(`Give progress recommendations based on this: ${input}`);
    return result.response.text();
  } catch (error) {
    console.error('Error fetching progress recommendations:', error);
    throw error;
  }
};
