// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import {
//   ChatPromptTemplate,
//   SystemMessagePromptTemplate,
//   HumanMessagePromptTemplate,
// } from "@langchain/core/prompts";

// export const PromptService = async (inputValue) => {
//   const SECRET_KEY = "AIzaSyCxBuFSEBJKhPZ6P4JzM46IhfVGzUfnbzU"; // Replace with your actual API key

//   const chat = new ChatGoogleGenerativeAI({ apiKey: SECRET_KEY });

//   // Define your prompt templates
//   const systemMessagePrompt = SystemMessagePromptTemplate.fromTemplate(
//     "You are an expert in generating educational flashcards. For the given keyword, generate a set of multiple-choice questions (MCQs) with four options each, and provide the correct answer. Additionally, include a brief explanation or context for each question to enhance understanding. Each flashcard should consist of one question with four possible answers, clearly indicating the correct one, and an explanation."
//   );

//   const humanMessagePrompt = HumanMessagePromptTemplate.fromTemplate(
//     "Create MCQs with four options and the correct answer, along with a brief explanation for each question based on the keyword '{asked_prompt}'."
//   );

//   const chatPrompt = ChatPromptTemplate.fromMessages([
//     systemMessagePrompt,
//     humanMessagePrompt,
//   ]);

//   const formattedChatPrompt = await chatPrompt.formatMessages({
//     asked_prompt: inputValue,
//   });

//   const response = await chat.invoke(formattedChatPrompt);

//   return {
//     flashcards: response.content,
//   };
// };

// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import {
//   ChatPromptTemplate,
//   SystemMessagePromptTemplate,
//   HumanMessagePromptTemplate,
// } from "@langchain/core/prompts";

// export const PromptService = async (inputValue) => {
//   const SECRET_KEY = "AIzaSyCxBuFSEBJKhPZ6P4JzM46IhfVGzUfnbzU"; // Replace with your actual API key

//   const chat = new ChatGoogleGenerativeAI({ apiKey: SECRET_KEY });

//   // Define your prompt templates
//   const systemMessagePrompt = SystemMessagePromptTemplate.fromTemplate(
//     "You are an expert in generating educational flashcards. For the given keyword, generate a set of flashcards with a question on the front and the correct answer on the back. Each flashcard should consist of one question and one answer."
//   );

//   const humanMessagePrompt = HumanMessagePromptTemplate.fromTemplate(
//     "Create 10 flashcards with questions and their corresponding answers based on the keyword '{asked_prompt}'."
//   );

//   const chatPrompt = ChatPromptTemplate.fromMessages([
//     systemMessagePrompt,
//     humanMessagePrompt,
//   ]);

//   const formattedChatPrompt = await chatPrompt.formatMessages({
//     asked_prompt: inputValue,
//   });

//   const response = await chat.invoke(formattedChatPrompt);

//   // Assuming the response is a string, you can split it into individual flashcards
//   const flashcards = response.content.split("\n\n").map((flashcard, index) => {
//     const [question, answer] = flashcard.split("\nAnswer: ");
//     return { id: index + 1, question: question.trim(), answer: answer.trim() };
//   });

//   return {
//     flashcards,
//   };
// };

// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import {
//   ChatPromptTemplate,
//   SystemMessagePromptTemplate,
//   HumanMessagePromptTemplate,
// } from "@langchain/core/prompts";

// export const PromptService = async (inputValue) => {
//   const SECRET_KEY = "AIzaSyCxBuFSEBJKhPZ6P4JzM46IhfVGzUfnbzU"; // Replace with your actual API key

//   const chat = new ChatGoogleGenerativeAI({ apiKey: SECRET_KEY });

//   // Define your prompt templates
//   const systemMessagePrompt = SystemMessagePromptTemplate.fromTemplate(
//     "You are an expert in generating educational flashcards. For the given keyword, generate a set of flashcards with a question on the front and the correct answer on the back. Each flashcard should consist of one question and one answer."
//   );

//   const humanMessagePrompt = HumanMessagePromptTemplate.fromTemplate(
//     "Create 10 flashcards with questions and their corresponding answers based on the keyword '{asked_prompt}'."
//   );

//   const chatPrompt = ChatPromptTemplate.fromMessages([
//     systemMessagePrompt,
//     humanMessagePrompt,
//   ]);

//   const formattedChatPrompt = await chatPrompt.formatMessages({
//     asked_prompt: inputValue,
//   });

//   const response = await chat.invoke(formattedChatPrompt);

//   // Handle the response safely
//   let flashcards = [];

//   if (response && response.content) {
//     const rawFlashcards = response.content.split("\n\n");

//     flashcards = rawFlashcards.map((flashcard, index) => {
//       const [question, answer] = flashcard.split("\nAnswer: ");

//       // Handle cases where answer might be undefined
//       return {
//         id: index + 1,
//         question: question ? question.trim() : `Question ${index + 1}`,
//         answer: answer ? answer.trim() : "Answer not provided",
//       };
//     });
//   } else {
//     console.error("Invalid response structure:", response);
//     flashcards = [
//       { id: 1, question: "Error", answer: "Unable to generate flashcards" },
//     ];
//   }

//   return {
//     flashcards,
//   };
// };

// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import {
//   ChatPromptTemplate,
//   SystemMessagePromptTemplate,
//   HumanMessagePromptTemplate,
// } from "@langchain/core/prompts";

// export const PromptService = async (inputValue) => {
//   const SECRET_KEY = "AIzaSyCxBuFSEBJKhPZ6P4JzM46IhfVGzUfnbzU"; // Replace with your actual API key

//   const chat = new ChatGoogleGenerativeAI({ apiKey: SECRET_KEY });

//   // Define your prompt templates
//   const systemMessagePrompt = SystemMessagePromptTemplate.fromTemplate(
//     "You are an expert in generating educational flashcards. For the given keyword, generate a set of flashcards with a question on the front and the correct answer on the back. Each flashcard should consist of one question and one answer."
//   );

//   const humanMessagePrompt = HumanMessagePromptTemplate.fromTemplate(
//     "Create 10 flashcards with questions and their corresponding answers based on the keyword '{asked_prompt}'. The format should be 'Question: [question here]' and 'Answer: [answer here]', separated by a line break."
//   );

//   const chatPrompt = ChatPromptTemplate.fromMessages([
//     systemMessagePrompt,
//     humanMessagePrompt,
//   ]);

//   const formattedChatPrompt = await chatPrompt.formatMessages({
//     asked_prompt: inputValue,
//   });

//   const response = await chat.invoke(formattedChatPrompt);

//   // Handle the response safely
//   let flashcards = [];

//   if (response && response.content) {
//     const rawFlashcards = response.content.split("\n\n");

//     flashcards = rawFlashcards.reduce((acc, flashcard, index) => {
//       const questionMatch = flashcard.match(/Question:\s*(.*)/i);
//       const answerMatch = flashcard.match(/Answer:\s*(.*)/i);

//       if (questionMatch && answerMatch) {
//         acc.push({
//           id: index + 1,
//           question: questionMatch[1].trim(),
//           answer: answerMatch[1].trim(),
//         });
//       }

//       return acc;
//     }, []);
//   } else {
//     console.error("Invalid response structure:", response);
//     flashcards = [
//       { id: 1, question: "Error", answer: "Unable to generate flashcards" },
//     ];
//   }

//   return {
//     flashcards,
//   };
// };
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";

export const PromptService = async (inputValue) => {
  const SECRET_KEY = "AIzaSyCxBuFSEBJKhPZ6P4JzM46IhfVGzUfnbzU"; // Replace with your actual API key

  const chat = new ChatGoogleGenerativeAI({ apiKey: SECRET_KEY });

  const systemMessagePrompt = SystemMessagePromptTemplate.fromTemplate(
    "You are an expert in generating educational flashcards. For the given keyword, generate a set of flashcards with a question on the front and the correct answer on the back. Each flashcard should consist of one question and one answer."
  );

  const humanMessagePrompt = HumanMessagePromptTemplate.fromTemplate(
    "Create 10 flashcards with questions and their corresponding answers based on the keyword '{asked_prompt}'. The format should be 'Question: [question here]' followed by a line break and 'Answer: [answer here]'. Ensure that the answer appears on a new line."
  );

  const chatPrompt = ChatPromptTemplate.fromMessages([
    systemMessagePrompt,
    humanMessagePrompt,
  ]);

  const formattedChatPrompt = await chatPrompt.formatMessages({
    asked_prompt: inputValue,
  });

  const response = await chat.invoke(formattedChatPrompt);

  let flashcards = [];

  if (response && response.content) {
    // Split by double line breaks to separate each flashcard
    const rawFlashcards = response.content.split("\n\n");

    flashcards = rawFlashcards.reduce((acc, flashcard, index) => {
      // Match the question and answer parts
      const questionMatch = flashcard.match(/Question:\s*(.*)/i);
      const answerMatch = flashcard.match(/Answer:\s*(.*)/i);

      if (questionMatch && answerMatch) {
        acc.push({
          id: index + 1,
          question: questionMatch[1].trim(),
          answer: answerMatch[1].trim(),
        });
      }

      return acc;
    }, []);
  } else {
    console.error("Invalid response structure:", response);
    flashcards = [
      { id: 1, question: "Error", answer: "Unable to generate flashcards" },
    ];
  }

  return {
    flashcards,
  };
};
