import { initializeApp } from "firebase/app";
import { doc, setDoc, addDoc, collection, getDocs, getFirestore, limit, orderBy, query, updateDoc, where } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCg2kp7_Ircxn0gDLqxZeXvMqBr7nkzekM",
    authDomain: "ai-flashcards-fe531.firebaseapp.com",
    projectId: "ai-flashcards-fe531",
    storageBucket: "ai-flashcards-fe531.appspot.com",
    messagingSenderId: "674893612675",
    appId: "1:674893612675:web:3d305e84f061d37fa73db6",
    measurementId: "G-G585T68TM5",
  };
  const app = initializeApp(firebaseConfig);

const IsUsernameExist = async (username) => {
    const db = getFirestore(app);
    const querySnapshot = await getDocs(query(collection(db, "leaderboard"), where("username", "==", username)));
    return querySnapshot.size > 0;
}

const AddUserInLeaderboard = async (username, score, user) => {
    const db = getFirestore(app);

    try {
        const isUsernameExist = await IsUsernameExist(username);
        const docRef = doc(db, "leaderboard", user.uid);

        if (isUsernameExist) {
            const querySnapshot = await getDocs(query(collection(db, "leaderboard"), where("username", "==", username)));
            for (const docSnapshot of querySnapshot.docs) {
                await updateDoc(docRef, { score: score });
            }
            return true;
        }

        // Create a document with the user.uid as the document ID
        await setDoc(docRef, {
            username: username,
            score: score
        });
        return true;
    } catch (e) {
        console.error("Error adding or updating document: ", e);
    }

    return false;
};

const GetLeaderboard = async () => {
    const db = getFirestore(app);
    const querySnapshot = await getDocs(query(collection(db, "leaderboard"), orderBy("score", "desc"), limit(10)));
    let leaderboard = [];
    querySnapshot.forEach((doc) => {
        leaderboard.push(doc.data());
    });
    return leaderboard;
}

export { AddUserInLeaderboard, GetLeaderboard, IsUsernameExist };