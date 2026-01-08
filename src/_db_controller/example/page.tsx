import { useEffect, useState } from "react";
import { getData } from "./getData";
import { addUser } from "./addData";
import { removeData } from "./removeData";
import { updateData } from "./updateData";

interface Item {
    id: string;
    name: string;
    year: number;
    type: string;
}

interface NewItem {
    name: string;
    year: number;
    type: string;
}

export default function ExamplePage() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState<NewItem>({
        name: "",
        year: new Date().getFullYear(),
        type: "",
    });

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<NewItem>({
        name: "",
        year: new Date().getFullYear(),
        type: "",
    });

    useEffect(() => {
        let mounted = true;

        async function loadItems() {
            const data = await getData();
            if (mounted) {
                setItems(data);
                setLoading(false);
            }
        }

        loadItems();
        return () => {
            mounted = false;
        };
    }, []);

    async function refresh() {
        const data = await getData();
        setItems(data);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        await addUser(form);
        setForm({ name: "", year: new Date().getFullYear(), type: "" });
        refresh();
    }

    async function handleDelete(id: string) {
        if (!window.confirm("Delete this item?")) return;
        await removeData(id);
        refresh();
    }

    async function handleUpdate(id: string) {
        await updateData(id, editForm);
        setEditingId(null);
        refresh();
    }

    return (
        <main className="min-h-screen bg-gray-100 p-6 flex justify-center">
            <div className="w-full max-w-3xl space-y-8">
                <h1 className="text-2xl font-bold text-center">Example Page To See Backend CRUD</h1>

                {/* Add Form */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Add New Item</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            placeholder="Name"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            className="w-full border rounded-lg px-3 py-2"
                        />

                        <input
                            type="number"
                            placeholder="Year"
                            value={form.year}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    year: Number(e.target.value),
                                })
                            }
                            className="w-full border rounded-lg px-3 py-2"
                        />

                        <input
                            placeholder="Type"
                            value={form.type}
                            onChange={(e) =>
                                setForm({ ...form, type: e.target.value })
                            }
                            className="w-full border rounded-lg px-3 py-2"
                        />

                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                            Add Item
                        </button>
                    </form>
                </div>

                {/* List */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Items</h2>

                    {loading && <p>Loading...</p>}

                    <ul className="space-y-3">
                        {items.map((item) => (
                            <li
                                key={item.id}
                                className="border rounded-lg p-4 bg-gray-50"
                            >
                                {editingId === item.id ? (
                                    <div className="space-y-2">
                                        <input
                                            value={editForm.name}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    name: e.target.value,
                                                })
                                            }
                                            className="w-full border rounded px-2 py-1"
                                        />
                                        <input
                                            type="number"
                                            value={editForm.year}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    year: Number(
                                                        e.target.value
                                                    ),
                                                })
                                            }
                                            className="w-full border rounded px-2 py-1"
                                        />
                                        <input
                                            value={editForm.type}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    type: e.target.value,
                                                })
                                            }
                                            className="w-full border rounded px-2 py-1"
                                        />

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() =>
                                                    handleUpdate(item.id)
                                                }
                                                className="text-green-600 font-medium"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setEditingId(null)
                                                }
                                                className="text-gray-500"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold">
                                                {item.name}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {item.type} • {item.year}
                                            </p>
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => {
                                                    setEditingId(item.id);
                                                    setEditForm({
                                                        name: item.name,
                                                        year: item.year,
                                                        type: item.type,
                                                    });
                                                }}
                                                className="text-blue-600 font-medium"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(item.id)
                                                }
                                                className="text-red-600 font-medium"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </main>
    );
}
