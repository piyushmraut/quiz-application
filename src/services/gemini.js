import axios from 'axios';

const GEMINI_API_KEY = 'AIzaSyCQ4k7EaEs7ptKInMK_qE_YMv2pCLDhIGw';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export const generateQuizWithAI = async (quizDetails) => {
  try {
    const prompt = `
      Generate a quiz with the following details:
      - Title: ${quizDetails.title}
      - Description: ${quizDetails.description}
      - Number of questions: ${quizDetails.numQuestions}
      - Time limit: ${quizDetails.timeLimit} minutes
      
      The quiz should have multiple choice questions with 4 options each (a, b, c, d) and exactly one correct answer.
      Format the response as a JSON object with the following structure:
      {
        "title": "Quiz Title",
        "description": "Quiz Description",
        "timeLimit": 10,
        "questions": [
          {
            "text": "Question text",
            "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "correctAnswer": 0
          }
        ]
      }
    `;

    const response = await axios.post(GEMINI_API_URL, {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Extract the JSON response from Gemini
    const responseText = response.data.candidates[0].content.parts[0].text;
    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}') + 1;
    const jsonString = responseText.substring(jsonStart, jsonEnd);
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error generating quiz with AI:', error);
    throw error;
  }
};