import { db } from "./firebase";
import { doc, setDoc, getDoc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";

// Save a new signature configuration or update existing to the AEGIS vault
// Utilizing the userId as the document ID for O(1) reads and simplicity.
export const saveSignature = async (userId, signatureData) => {
    try {
        const sigRef = doc(db, "signatures", userId);
        await setDoc(sigRef, {
            userId,
            config: signatureData,
            updatedAt: new Date().toISOString()
        }, { merge: true });
        return userId;
    } catch (error) {
        console.error("Error saving signature:", error);
        throw error;
    }
};

// Fetch a single signature by ID
export const getSignature = async (userId) => {
    try {
        const sigRef = doc(db, "signatures", userId);
        const sigSnap = await getDoc(sigRef);
        if (sigSnap.exists()) {
            return { id: sigSnap.id, ...sigSnap.data() };
        }
        return null;
    } catch (error) {
        console.error("Error fetching signature:", error);
        throw error;
    }
};

// Delete a signature
export const deleteSignature = async (userId) => {
    try {
        const sigRef = doc(db, "signatures", userId);
        await deleteDoc(sigRef);
    } catch (error) {
        console.error("Error deleting signature:", error);
        throw error;
    }
};
