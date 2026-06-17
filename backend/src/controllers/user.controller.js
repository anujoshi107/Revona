// Line 1: Import the asyncHandler middleware using CommonJS require.
// The original TypeScript used `import { asyncHandler } from "../middlewares/asyncHandler.middlerware";`
import { asyncHandler } from '../middlewares/asyncHandler.middleware.js';

// Line 2: Import the two user service functions.
import {
  findByIdUserService,
  updateUserService,
} from '../services/user.service.js';

// Line 3: Import the HTTP status codes constant object.
import { HTTPSTATUS } from '../config/http.config.js';

// Line 4: Import the Zod update user schema (validator).
import { updateUserSchema } from '../validators/user.validator.js';

// Line 5: Define the getCurrentUserController.
// It wraps an async function inside asyncHandler to catch errors automatically.
// Original: `export const getCurrentUserController = asyncHandler(async (req: Request, res: Response) => { ... });`
const getCurrentUserController = asyncHandler(async (req, res) => {
  // Line 6: Extract the user ID from the request object.
  // `req.user` is set by authentication middleware (e.g., Passport/JWT).
  // The `?._id` uses optional chaining to safely access `_id` even if `req.user` is null/undefined.
  const userId = req.user?._id;

  // Line 7: Call the service to find the user by ID.
  const user = await findByIdUserService(userId);

  // Line 8: Send a JSON response with status 200 (OK).
  // The response includes a success message and the user object.
  return res.status(HTTPSTATUS.OK).json({
    message: 'User fetched successfully',
    user,
  });
});

// Line 9: Define the updateUserController.
const updateUserController = asyncHandler(async (req, res) => {
  // Line 10: Validate and parse the request body using the Zod schema.
  // `updateUserSchema.parse(req.body)` will throw an error if validation fails,
  // which asyncHandler will catch and forward to the error handler.
  const body = updateUserSchema.parse(req.body);

  // Line 11: Get the user ID from the authenticated request.
  const userId = req.user?._id;

  // Line 12: Extract the uploaded file from the request (e.g., profile picture).
  // `req.file` is populated by Multer middleware.
  const profilePic = req.file;

  // Line 13: Call the service to update the user with the validated body and optional file.
  const user = await updateUserService(userId, body, profilePic);

  // Line 14: Return a successful response with the updated user data.
  return res.status(HTTPSTATUS.OK).json({
    message: 'User profile updated successfully',
    data: user,
  });
});

// Line 15: Export both controller functions so they can be used in routes.
export {
  getCurrentUserController,
  updateUserController,
};