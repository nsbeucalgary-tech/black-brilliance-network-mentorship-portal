import { useState } from "react";
import { db } from "../../config/firebase";
import { UserController } from "../../services/UserController";
import type { CreateUserPayload } from "../../types/User";

const userController = new UserController(db);

export default function TestUserCreation() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleCreateUser = async () => {
    setLoading(true);
    setError("");
    setResult("");

    try {
      const testPayload: CreateUserPayload = {
        first_name: "Test",
        last_name: "User",
        email: `test-${Date.now()}@example.com`,
        role: "user",
      };

      console.log("Creating user with payload:", testPayload);
      const createdUser = await userController.createUser(testPayload);
      console.log("User created successfully:", createdUser);

      setResult(JSON.stringify(createdUser, null, 2));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Error creating user:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Test User Creation</h1>

      <button
        onClick={handleCreateUser}
        disabled={loading}
        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Test User"}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded">
          <h2 className="font-bold text-red-700">Error:</h2>
          <pre className="text-sm text-red-600 overflow-auto">{error}</pre>
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded">
          <h2 className="font-bold text-green-700">Success! Created User:</h2>
          <pre className="text-sm text-green-600 overflow-auto bg-white p-2 mt-2">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}
