import { collection, addDoc } from "firebase/firestore";
import { db } from "../init";
export async function addUser(form: { name: string; year: number; type: string }) {
    console.log("Adding user to database...");
    try {
        const docRef = await addDoc(collection(db, "example"), {
            name: form.name,
            year: form.year,
            type: form.type,
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}
