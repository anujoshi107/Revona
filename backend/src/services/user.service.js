// Line 1: Import the User model using CommonJS require
import UserModel from '../models/user.model.js';

// Line 2: Import the NotFoundException custom error class
import { NotFoundException } from '../utils/error.js';

// Line 3: (Removed) The original imported a TypeScript type `UpdateUserType` – we don't need it in JS

// Line 4: Define and export the findByIdUserService function
// Original: `export const findByIdUserService = async (userId: string) => { ... };`
const findByIdUserService = async (userId) => {
  // Line 5: Call Mongoose's findById to retrieve the user
  const user = await UserModel.findById(userId);
  // Line 6: Return the user object without the password field
  // `?.omitPassword()` uses optional chaining: if `user` is null/undefined, return undefined safely
  return user?.omitPassword();
};

// Line 7: Define and export the updateUserService function
// Original had type annotations: `userId: string`, `body: UpdateUserType`, `profilePic?: Express.Multer.File`
const updateUserService = async (userId, body, profilePic) => {
  // Line 8: Fetch the existing user from the database
  const user = await UserModel.findById(userId);
  // Line 9: If no user found, throw a NotFoundException (custom error with 404 status)
  if (!user) throw new NotFoundException('User not found');

  // Line 10: If a profile picture file was uploaded, set the user's profilePicture to the file path (or URL)
  if (profilePic) {
    user.profilePicture = profilePic.path;
  }

  // Line 11: Update the user's name from the validated body (only name is updated here, per the original)
  user.set({
    name: body.name,
  });

  // Line 12: Save the updated user document to the database
  await user.save();

  // Line 13: Return the user object (without the password) after successful update
  return user.omitPassword();
};

// Line 14: Export both service functions
export {
  findByIdUserService,
  updateUserService,
};