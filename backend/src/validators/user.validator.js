// Line 1: Import the Zod library using CommonJS require (replaces "import { z } from "zod"")
import { z } from 'zod';

// Line 2: Define the update user validation schema using Zod.
// This is identical to the original, because Zod works the same in JS.
export const updateUserSchema = z.object({
  name: z.string().trim().min(1).max(255).optional(),
});

// Line 3: (Removed) The original exported a TypeScript type "UpdateUserType".
// In JavaScript, we can't export types, so this line is dropped. 
// The inferred type is used only at compile time, so no runtime replacement needed.

// Line 4: Exported via export const at definition