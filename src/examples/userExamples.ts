/**
 * Example: User Schema and Database Operations
 * This file demonstrates how to use the User type and UserController
 */

import { db } from "../config/firebase";
import { UserController } from "../services/UserController";
import { type User, type CreateUserPayload, UserRole } from "../types/User";

// Initialize the User controller with Firestore instance
const userController = new UserController(db);

/**
 * Example 1: Create a new user
 */
export async function exampleCreateUser() {
  const newUserPayload: CreateUserPayload = {
    full_name: "John Doe",
    email: "john.doe@example.com",
    password_hash: "hashed_password_here", // In real app, use bcrypt or similar
    affiliation: "Harvard University",
    role: UserRole.MENTOR,
    admin_status: false,
  };

  try {
    const createdUser = await userController.createUser(newUserPayload);
    console.log("User created:", createdUser);
    return createdUser;
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

/**
 * Example 2: Get user by ID
 */
export async function exampleGetUserById(userId: string) {
  try {
    const user = await userController.getUserById(userId);
    if (user) {
      console.log("User found:", user);
      return user;
    } else {
      console.log("User not found");
    }
  } catch (error) {
    console.error("Error getting user:", error);
  }
}

/**
 * Example 3: Get user by email
 */
export async function exampleGetUserByEmail(email: string) {
  try {
    const user = await userController.getUserByEmail(email);
    if (user) {
      console.log("User found:", user);
      return user;
    } else {
      console.log("User not found");
    }
  } catch (error) {
    console.error("Error getting user:", error);
  }
}

/**
 * Example 4: Get all users
 */
export async function exampleGetAllUsers() {
  try {
    const users = await userController.getAllUsers();
    console.log("All users:", users);
    return users;
  } catch (error) {
    console.error("Error getting all users:", error);
  }
}

/**
 * Example 5: Get users by role
 */
export async function exampleGetUsersByRole(role: UserRole) {
  try {
    const users = await userController.getUsersByRole(role);
    console.log(`Users with role ${role}:`, users);
    return users;
  } catch (error) {
    console.error("Error getting users by role:", error);
  }
}

/**
 * Example 6: Update user
 */
export async function exampleUpdateUser(userId: string) {
  try {
    const updatedUser = await userController.updateUser(userId, {
      full_name: "Jane Doe",
      role: UserRole.MENTEE,
      admin_status: true,
    });
    console.log("User updated:", updatedUser);
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
  }
}

/**
 * Example 7: Delete user
 */
export async function exampleDeleteUser(userId: string) {
  try {
    await userController.deleteUser(userId);
    console.log("User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}

/**
 * Example 8: Check if user exists
 */
export async function exampleUserExists(userId: string) {
  try {
    const exists = await userController.userExists(userId);
    console.log(`User exists: ${exists}`);
    return exists;
  } catch (error) {
    console.error("Error checking user existence:", error);
  }
}

/**
 * Example 9: Check if email exists
 */
export async function exampleEmailExists(email: string) {
  try {
    const exists = await userController.emailExists(email);
    console.log(`Email exists: ${exists}`);
    return exists;
  } catch (error) {
    console.error("Error checking email existence:", error);
  }
}

/**
 * Example 10: Type casting - Working with User type
 */
export function exampleTypeCasting() {
  // Create a user object with proper typing
  const user: User = {
    user_id: "user123",
    full_name: "Alice Smith",
    email: "alice.smith@example.com",
    password_hash: "hashed_password",
    affiliation: "MIT",
    role: UserRole.MENTOR,
    admin_status: true,
    created_at: new Date(),
  };

  // TypeScript will enforce correct property types
  console.log(`User: ${user.full_name} (${user.email})`);
  console.log(`Role: ${user.role}`);
  console.log(`Created: ${user.created_at.toISOString()}`);

  return user;
}
