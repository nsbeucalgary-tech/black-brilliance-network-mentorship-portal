import { doc, updateDoc } from "firebase/firestore";
import { db } from "../init";

export async function updateData(id: string, updatedData: { name?: string; year?: number; type?: string }) {
    console.log("Updating document in database...");
    try {
        const docRef = doc(db, "example", id);
        await updateDoc(docRef, updatedData);
        console.log("Document successfully updated!");
    } catch (e) {
        console.error("Error updating document: ", e);
    }
}
