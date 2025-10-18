
import { GoogleGenAI, Type } from '@google/genai';
import type { Task } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const taskSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: 'A short, concise title for the task (e.g., "Team Meeting").',
        },
        description: {
            type: Type.STRING,
            description: 'A brief description of the task (e.g., "Discuss Q3 roadmap").',
        },
        date: {
            type: Type.STRING,
            description: "The date for the task in strict 'YYYY-MM-DD' format.",
        },
        color: {
            type: Type.STRING,
            description: "A color for the task category. Choose one of: 'red', 'blue', 'green', 'yellow', 'purple', 'indigo', 'pink'.",
            enum: ['red', 'blue', 'green', 'yellow', 'purple', 'indigo', 'pink'],
        },
    },
    required: ['title', 'description', 'date', 'color'],
};

export const generateTasksFromPrompt = async (prompt: string, currentDate: Date): Promise<Omit<Task, 'id'>[]> => {
    const model = 'gemini-2.5-flash';

    const fullPrompt = `
        You are an intelligent task scheduling assistant. Based on the user's request, generate a list of tasks.
        The current date is ${currentDate.toISOString().split('T')[0]}.
        Analyze the request for recurring events (e.g., "every Monday," "daily for a week") and create a separate task object for each occurrence within a reasonable future timeframe (e.g., the next 2-3 months).
        Adhere strictly to the provided JSON schema for the output. The date for each task must be in 'YYYY-MM-DD' format.
        
        User Request: "${prompt}"
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: fullPrompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: taskSchema,
                },
            },
        });

        const jsonText = response.text.trim();
        const generatedTasks = JSON.parse(jsonText) as Omit<Task, 'id'>[];
        return generatedTasks;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to parse tasks from AI response.");
    }
};
