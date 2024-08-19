import {
  doc,
  setDoc,
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
  limit,
  getDoc,
} from "firebase/firestore";
import { firestore } from "../firebase";

const IsUsernameExist = async (username) => {
  const querySnapshot = await getDocs(
    query(
      collection(firestore, "leaderboard"),
      where("username", "==", username)
    )
  );
  return querySnapshot.size > 0;
};

// const AddUserInLeaderboard = async (
//   username,
//   totalPoints,
//   gamePoints,
//   user
// ) => {
//   const combinedPoints = Number(totalPoints) + Number(gamePoints);

//   try {
//     const isUsernameExist = await IsUsernameExist(username);
//     const docRef = doc(firestore, "leaderboard", user.uid);

//     if (isUsernameExist) {
//       await updateDoc(docRef, { score: combinedPoints });
//     } else {
//       // Create a document with the user.uid as the document ID
//       await setDoc(docRef, {
//         username: username,
//         score: combinedPoints,
//       });
//     }
//     return true;
//   } catch (e) {
//     console.error("Error adding or updating document: ", e);
//     return false;
//   }
// };

const AddUserInLeaderboard = async (username, user) => {
  const pointsDocRef = doc(firestore, "points", user.uid);

  try {
    const pointsDocSnap = await getDoc(pointsDocRef);

    if (pointsDocSnap.exists()) {
      const data = pointsDocSnap.data();
      const totalPoints = data.totalPoints || 0;
      const gamePoints = data.gamePoints || 0;
      const combinedPoints = Number(totalPoints) + Number(gamePoints);

      const docRef = doc(firestore, "leaderboard", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Document exists, compare and update the score if new score is greater
        const existingData = docSnap.data();
        const existingScore = existingData.score || 0;

        if (combinedPoints > existingScore) {
          await updateDoc(docRef, { score: combinedPoints });
        }
      } else {
        // Document does not exist, create a new one
        await setDoc(docRef, {
          username: username,
          score: combinedPoints,
        });
      }
      return true;
    } else {
      console.error("Points document does not exist.");
      return false;
    }
  } catch (e) {
    console.error("Error adding or updating document: ", e);
    return false;
  }
};

const GetLeaderboard = async () => {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(firestore, "leaderboard"),
        orderBy("score", "desc") // Ensure this is sorting by score in descending order
      )
    );

    return querySnapshot.docs.map((doc) => ({
      id: doc.id, // This is the document name (ID)
      ...doc.data(), // This spreads the document data
    }));
  } catch (error) {
    console.error("Error fetching leaderboard: ", error);
    return [];
  }
};

const GetUserRank = async (userId) => {
  try {
    const leaderboard = await GetLeaderboard(); // Ensure this is up-to-date
    const sortedLeaderboard = leaderboard
      .map((entry) => ({ ...entry, score: Number(entry.score) })) // Convert scores to numbers
      .sort((a, b) => b.score - a.score); // Sort by score in descending order

    // Find the user's rank
    const userIndex = sortedLeaderboard.findIndex(
      (entry) => entry.id === userId // Ensure this matches how userId is stored in leaderboard
    );
    // Return rank (index + 1 for 1-based ranking), or null if not found
    return userIndex !== -1 ? userIndex + 1 : null;
  } catch (error) {
    console.error("Error fetching user rank: ", error);
    return null;
  }
};

export { AddUserInLeaderboard, GetLeaderboard, IsUsernameExist, GetUserRank };
