import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";
import { TOTAL_QUESTIONS, AI_TOPICS } from "../constants";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateQuestions = async (): Promise<Question[]> => {
  // Shuffle topics to ensure distinct questions on every load
  const shuffled = [...AI_TOPICS].sort(() => 0.5 - Math.random());
  const selectedTopics = shuffled.slice(0, TOTAL_QUESTIONS);

  // Request simple, random questions based on selected topics
  const prompt = `
    Generate exactly ${TOTAL_QUESTIONS} simple, fun, and random multiple-choice questions about Artificial Intelligence.
    
    To ensure variety, focus on these specific topics (one question per topic):
    ${selectedTopics.map(t => `- ${t}`).join('\n')}
    
    Constraints:
    - Questions must be beginner-friendly (easy difficulty).
    - Ensure randomness every time. Do not repeat standard default questions.
    
    Each question must have 4 options and exactly one correct answer.
    The output must be a JSON array.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a friendly quiz master. Create easy and engaging trivia questions.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: {
                type: Type.STRING,
                description: "The question text."
              },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Exactly 4 options."
              },
              correctAnswerIndex: {
                type: Type.INTEGER,
                description: "The zero-based index of the correct option (0-3)."
              }
            },
            required: ["text", "options", "correctAnswerIndex"],
            propertyOrdering: ["text", "options", "correctAnswerIndex"]
          }
        }
      }
    });

    let rawData = response.text;
    if (!rawData) throw new Error("No data returned from Gemini");

    // Clean up potential markdown code blocks which can break JSON.parse
    rawData = rawData.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsedData = JSON.parse(rawData);
    
    // Map to our internal type and add IDs
    return parsedData.map((q: any, index: number) => ({
      id: `q-${Date.now()}-${index}`,
      text: q.text,
      options: q.options,
      correctAnswerIndex: q.correctAnswerIndex
    }));

  } catch (error) {
    console.error("Failed to generate questions:", error);
    // Simple Fallback questions
    return [
      {
        id: 'fallback-1',
        text: "What does 'AI' stand for?",
        options: [
          "Automated Interface",
          "Artificial Intelligence",
          "Apple Intelligence",
          "Advanced Internet"
        ],
        correctAnswerIndex: 1
      },
      {
        id: 'fallback-2',
        text: "Which of these is a famous AI chatbot developed by OpenAI?",
        options: [
          "Siri",
          "Alexa",
          "ChatGPT",
          "Cortana"
        ],
        correctAnswerIndex: 2
      },
      {
        id: 'fallback-3',
        text: "What is the text you type into an AI model called?",
        options: [
          "A command",
          "A prompt",
          "A script",
          "A code"
        ],
        correctAnswerIndex: 1
      }
    ];
  }
};