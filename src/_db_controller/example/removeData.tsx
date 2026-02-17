import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../init";

export async function removeData(id: string) {
    console.log("Removing document from database...");
    try {
        await deleteDoc(doc(db, "example", id));
        console.log("Document successfully deleted!");
    } catch (e) {
        console.error("Error removing document: ", e);
    }
}