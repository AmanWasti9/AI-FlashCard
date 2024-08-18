import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import { GoogleGenerativeAI } from '@google/generative-ai';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PdfTextExtractor = () => {
    const [pdfText, setPdfText] = useState('');
    const [flashcards, setFlashcards] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileReader = new FileReader();
            fileReader.onload = async function () {
                const typedArray = new Uint8Array(this.result);
                const pdf = await pdfjsLib.getDocument(typedArray).promise;
                let extractedText = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map(item => item.str).join(' ');
                    extractedText += pageText + ' ';
                }
                setPdfText(extractedText);
                await generateFlashcards(extractedText); // Call flashcard generation after text extraction
            };
            fileReader.readAsArrayBuffer(file);
        }
    };

    const generateFlashcards = async (text) => {
        setLoading(true);
        try {
            const genAI = new GoogleGenerativeAI(
                "AIzaSyCxBuFSEBJKhPZ6P4JzM46IhfVGzUfnbzU" // Replace with your actual API key
            );

            const model = genAI.getGenerativeModel({
                model: 'gemini-pro',
            });

            const generationConfig = {
                temperature: 1,
                topP: 0.95,
                topK: 64,
                maxOutputTokens: 8192,
                responseMimeType: 'text/plain',
            };

            const prompt = `Create 10 flashcards with questions and three options based on this PDF text: ${text}. The format should be:\n\nQuestion: [question here]\na) [option 1]\nb) [option 2]\nc) [option 3]\nAnswer: [correct answer here]`;

            const response = await model.generateContent(prompt, generationConfig);
            console.log(response);
            console.log(response.response.candidates[0]?.content?.parts[0]?.text);
            const flashcard = response.response.candidates[0]?.content?.parts[0]?.text||"no flashcard generated";
            setFlashcards(flashcard); // Store generated flashcards in state
        } catch (error) {
            console.error('Error generating flashcards:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
            <div>
                <h3>Extracted PDF Text:</h3>
                <textarea value={pdfText} readOnly rows="20" cols="80" />
            </div>
            <div>
                <h3>Generated Flashcards:</h3>
                {loading ? <p>Generating flashcards...</p> : <textarea value={flashcards} readOnly rows="20" cols="80" />}
            </div>
        </div>
    );
};

export default PdfTextExtractor;
