import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  Divider,
  IconButton,
  Popover,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { IoMdCloseCircle } from "react-icons/io";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navigation from "../components/navigation";
import GenerateCard from "./generateCard";
import Profile from "./profile";
import Flashcards from "./flashcards";
import Flashcard from "./flashcard";
import Cards from "../components/Cards";
import { getAuth } from "firebase/auth";
import { TbLogout2 } from "react-icons/tb";
import { GeminiBtn } from "../components/buttons";
import ReactMarkdown from "react-markdown";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { getDoc, updateDoc, doc, collection, setDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import PdfTextExtractor from "./pdf-reader";
import { MdFeedback } from "react-icons/md";

export default function Dashboard() {
  const auth = getAuth(); // Initialize Firebase Auth
  const user = auth.currentUser; // Get current user
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  // Gemini Start
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [theme, setTheme] = useState("light");
  const [chat, setChat] = useState(null);
  const [error, setError] = useState("");
  const [data, setData] = useState({});
  const [chatInitialized, setChatInitialized] = useState(false); // New state
  const [open1, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState("");

  const API_KEY = "AIzaSyDYmligr0eUjKVNQqXJRKfFacWbWSiaPN0";
  const genAI = new GoogleGenerativeAI(API_KEY);

  const handleOpen1 = () => {
    setOpen(true);
  };
  const handleClose1 = () => {
    setOpen(false);
  };

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/api/data");
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        console.log("Fetched data:", result);
        console.log("User id", user?.uid);

        setData(result);
      } catch (err) {
        console.error("Failed to load data:", err);
        setError("Failed to load data.");
      }
    };
    loadData();
  }, []);

  const retrieveInformation = (userInput) => {
    const file1Data = Array.isArray(data.file1) ? data.file1 : [];
    const file2Data = Array.isArray(data.file2) ? data.file2 : [];
    const combinedData = [...file1Data, ...file2Data];

    console.log("Combined Data:", combinedData);

    const lowerCaseInput = userInput.toLowerCase();
    console.log("User Input (lowercase):", lowerCaseInput);

    const filteredData = combinedData.filter((item) => {
      const text = item.name ? item.name.toLowerCase() : "";
      console.log("Item Text (lowercase):", text);
      return text.includes(lowerCaseInput);
    });

    console.log("Filtered Data:", filteredData);

    return filteredData;
  };

  async function updateChatHistory(newMessages) {
    if (!user || !user.uid) {
      console.error("User is not authenticated or UID is missing");
      return;
    }

    try {
      const docRef = doc(collection(firestore, "UsersHistory"), user.uid);

      // Fetch the existing chat history
      const docSnap = await getDoc(docRef);
      let historyArray = [];

      if (docSnap.exists()) {
        historyArray = docSnap.data().history || [];
      }

      // Create a Map to filter out old messages
      const existingMessagesMap = new Map(
        historyArray.map((msg) => [
          `${msg.timestamp.toDate().getTime()}-${msg.text}`,
          msg,
        ])
      );

      // Append only the latest new messages
      const uniqueMessages = newMessages.filter((newMsg) => {
        const key = `${newMsg.timestamp.getTime()}-${newMsg.text}`;
        return !existingMessagesMap.has(key);
      });

      if (uniqueMessages.length > 0) {
        historyArray = [...historyArray, ...uniqueMessages];
        await setDoc(docRef, { history: historyArray });
        console.log("Chat history successfully updated!");
      }
    } catch (e) {
      console.error("Error updating chat history: ", e);
    }
  }

  const handleSendMessage = async () => {
    try {
      const userMessage = {
        text: userInput,
        role: "user",
        timestamp: new Date(),
      };

      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setUserInput("");

      const retrievedData = retrieveInformation(userInput);
      console.log("Retrieved Data", retrievedData);

      const context = retrievedData
        .map((item) => {
          const { name, price, rpm, noise_level } = item;
          return `name: ${name}, price: ${price}, rpm= ${rpm}, noise_level= ${noise_level}`;
        })
        .join("\n");

      console.log("Context:", context);

      if (chat) {
        const contextMessages = newMessages.map((msg) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text || "" }],
        }));

        const result = await chat.sendMessage(userInput, {
          context,
          history: contextMessages,
        });
        const botMessage = {
          text: result.response.text(),
          role: "model",
          timestamp: new Date(),
        };

        const updatedMessages = [...newMessages, botMessage];
        setMessages(updatedMessages);

        // Update Firebase with both user and bot messages
        await updateChatHistory([userMessage, botMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
    }
  };

  useEffect(() => {
    const initChat = async () => {
      if (!user || !user.uid || chatInitialized) {
        return;
      }

      try {
        const docRef = doc(collection(firestore, "UsersHistory"), user.uid);
        const docSnap = await getDoc(docRef);

        let historyarray = docSnap.exists() ? docSnap.data().history || [] : [];

        const chatHistory = historyarray.map((msg) => ({
          role: msg.role === "bot" ? "model" : msg.role,
          parts: [{ text: msg.text || "" }],
        }));

        console.log("Chat history being sent:", chatHistory);

        const newChat = await model.startChat({
          history: chatHistory,
          generationConfig,
          safetySettings,
        });

        setChat(newChat);
        setChatInitialized(true); // Set chat as initialized
      } catch (error) {
        console.error("Failed to initialize chat:", error);
        setError("Failed to initialize chat. Please try again.");
      }
    };

    initChat();
  }, [user, chatInitialized]); // Use chatInitialized as a dependency
  // Gemini End

  const handleLogOut = async () => {
    // console.log("Logout button clicked"); // Add this line to check if the function is being called
    try {
      await auth.signOut();
      // console.log("User logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const getThemeColors = () => {
    switch (theme) {
      case "light":
        return {
          primary: "bg-white",
          secondary: "bg-gray-100",
          accent: "bg-blue-500",
          text: "text-gray-800",
        };
      case "dark":
        return {
          primary: "bg-gray-900",
          secondary: "bg-gray-800",
          accent: "bg-yellow-500",
          text: "text-gray-100",
        };
      default:
        return {
          primary: "bg-white",
          secondary: "bg-gray-100",
          accent: "bg-blue-500",
          text: "text-gray-800",
        };
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage(); // Ensure this function is called on Enter key press
    }
  };

  const { primary, secondary, accent, text } = getThemeColors();

  // Handle form submission
  const handleSubmitFeedback = async (e) => {
    e.preventDefault(); // Prevent page reload on form submission

    if (!user) return; // Ensure user is logged in

    try {
      // Create a feedback document
      const feedbackDocRef = doc(collection(firestore, "feedback"), user.uid);
      await setDoc(feedbackDocRef, {
        userId: user.uid,
        name: name,
        feedback: feedback,
        timestamp: new Date(),
      });

      console.log("Feedback submitted successfully");
      setName(""); // Clear the form fields
      setFeedback(""); // Clear the form fields
      handleClose1(); // Close the dialog
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        boxShadow: "0 8px 32px 0 rgba(0,0,0,0.37)",
        overflowX: "hidden",
      }}
    >
      <Box>
        <Button
          variant="standard"
          onClick={handleLogOut}
          sx={{
            color: "white",
          }}
        >
          <TbLogout2
            style={{
              fontSize: "2.5rem",
              color: "white",
            }}
          />
          LogOut
        </Button>
        <Button
          onClick={handleClick}
          style={{
            position: "fixed",
            bottom: 15,
            left: 26,
            borderRadius: "50%",
            width: "100px",
            height: "100px",
            cursor: "pointer",
            color: "white",
          }}
        >
          <GeminiBtn />
        </Button>

        <Button
          onClick={handleOpen1}
          style={{
            position: "fixed",
            bottom: 15,
            right: 26,
            borderRadius: "50%",
            width: "100px",
            height: "100px",
            cursor: "pointer",
            color: "white",
          }}
        >
          <MdFeedback />
        </Button>
      </Box>
      <Box
        sx={{
          padding: "0px 20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Navigation />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          padding: 1,
        }}
      >
        <Routes>
          <Route path="/" element={<GenerateCard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="flashcards" element={<Flashcards />} />
          <Route path="flashcard/:id" element={<Flashcard />} />
          <Route path="game" element={<Cards />} />
          <Route path="pdf" element={<PdfTextExtractor />} />
        </Routes>

        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            sx: {
              width: {
                xs: "80vw",
                sm: "40vw",
                md: "30vw",
              },
              height: "80vh",
              display: "flex",
              flexDirection: "column",
              background: "white",
              color: "black",
            },
          }}
        >
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
            }}
          >
            <IoMdCloseCircle />
          </IconButton>
          <Box
            sx={{
              padding: 2,
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <Typography variant="h6" sx={{ textAlign: "center" }}>
              Ask your question
            </Typography>
            <Divider
              sx={{
                background: "white",
              }}
            />
            <Box sx={{ flex: 1, padding: 2 }}>
              <Stack>
                {/* <pre className={styles.pre}>{parseBoldText(recipe)}</pre> */}
                {/* <div
                  // className="flex-1 overflow-y-auto p-2"

                  style={{
                    overflowY: "auto",
                    // backgroundColor: `${secondary}`,
                  }}
                >
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      style={{
                        display: "inline-block",
                        paddingTop: "0.5rem",
                        paddingBottom: "0.5rem",
                        paddingLeft: "1rem",
                        paddingRight: "1rem",
                        marginBottom: "0.5rem",
                        borderRadius: "0.5rem",
                        backgroundColor:
                          msg.role === "user" ? "#3B82F6" : "#6B7280",
                      }}
                    >
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  ))}
                </div> */}
                <div
                  // className="flex-1 overflow-y-auto p-2"

                  style={{
                    overflowY: "auto",
                    // backgroundColor: `${secondary}`,
                  }}
                >
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      style={{
                        marginBottom: "1rem",
                        textAlign: msg.role === "user" ? "right" : "left",
                      }}
                    >
                      <ReactMarkdown
                        style={{
                          display: "inline-block",
                          padding: "0.5rem",
                          borderRadius: "0.5rem",
                          backgroundColor:
                            msg.role === "user" ? "violet" : "grey",
                          color: msg.role === "user" ? "white" : "white",
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: text,
                          marginTop: "0.25rem",
                        }}
                      >
                        {msg.role === "bot" ? "Bot" : "You"} -{" "}
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              </Stack>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TextField
                fullWidth
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyPress}
                style={{
                  color: "black",
                }}
              />
              <Button>Send</Button>
            </Box>
          </Box>
        </Popover>

        <Dialog
          open={open1}
          onClose={handleClose1}
          PaperProps={{
            style: {
              backgroundColor: "transparent", // Set the background color to transparent
              boxShadow: "none", // Optional: remove the default box shadow
            },
          }}
        >
          <div className="form-container">
            <form className="form" onSubmit={handleSubmitFeedback}>
              <div className="form-group">
                <label for="email">Your Name</label>
                <input type="text" id="email" name="email" required="" />
              </div>
              <div className="form-group">
                <label for="textarea">How can we improve?</label>
                <textarea
                  name="textarea"
                  id="textarea"
                  rows="10"
                  cols="50"
                  required=""
                >
                  {" "}
                </textarea>
              </div>
              <button className="form-submit-btn" type="submit">
                Submit
              </button>
            </form>
          </div>
        </Dialog>
      </Box>
    </Box>
  );
}
