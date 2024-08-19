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
    "You are an expert in generating educational flashcards. For the given keyword, generate a set of flashcards with a question on the front and the correct answer on the back. Each flashcard should consist of one question, three options, and the correct answer."
  );

  const humanMessagePrompt = HumanMessagePromptTemplate.fromTemplate(
    "Create 10 flashcards with questions and three options based on the keyword '{asked_prompt}'. The format should be:\n\n" +
      "Question: [question here]\n" +
      "a) [option 1]\n" +
      "b) [option 2]\n" +
      "c) [option 3]\n" +
      "Answer: [correct answer here, without option letters] (Choose from the options a, b, or c)"
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
      // Match the question, options, and answer parts
      const questionMatch = flashcard.match(/Question:\s*(.*)/i);
      const optionAMatch = flashcard.match(/a\)\s*(.*)/i);
      const optionBMatch = flashcard.match(/b\)\s*(.*)/i);
      const optionCMatch = flashcard.match(/c\)\s*(.*)/i);
      const answerMatch = flashcard.match(/Answer:\s*(.*)/i);

      if (
        questionMatch &&
        optionAMatch &&
        optionBMatch &&
        optionCMatch &&
        answerMatch
      ) {
        acc.push({
          id: index + 1,
          question: questionMatch[1].trim(),
          options: {
            a: optionAMatch[1].trim(),
            b: optionBMatch[1].trim(),
            c: optionCMatch[1].trim(),
          },
          answer: answerMatch[1].trim(),
        });
      }

      return acc;
    }, []);
  } else {
    console.error("Invalid response structure:", response);
    flashcards = [
      {
        id: 1,
        question: "Error",
        options: { a: "", b: "", c: "" },
        answer: "Unable to generate flashcards",
      },
    ];
  }

  return {
    flashcards,
  };
};
