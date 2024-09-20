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

export const getQuizQuestions = async (input) => {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });
    
    const result = await chatSession.sendMessage(input);
    return result.response.text();
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

    const result = await chatSession.sendMessage(input);
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

    const result = await chatSession.sendMessage(input);
    return result.response.text();
  } catch (error) {
    console.error('Error fetching progress recommendations:', error);
    throw error;
  }
};
