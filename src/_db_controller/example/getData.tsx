import { collection, getDocs } from "firebase/firestore";
import { db } from "../init";

export interface Item {
    id: string;
    name: string;
    year: number;
    type: string;
}

export async function getData(): Promise<Item[]> {
    const querySnapshot = await getDocs(collection(db, "example"));

    const items: Item[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Item, "id">),
    }));

    return items;
}
