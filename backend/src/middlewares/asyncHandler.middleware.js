// Line 1: No imports needed – we removed the TypeScript type imports.

// Line 2: Define the asyncHandler function.
// It takes a single argument `controller` (the async route handler function).
const asyncHandler = (controller) =>
  // Line 3: It returns a new async function that Express will call with (req, res, next).
  async (req, res, next) => {
    try {
      // Line 4: Execute the original controller, awaiting its promise.
      await controller(req, res, next);
    } catch (error) {
      // Line 5: If the controller throws an error (or rejects), pass it to Express's error handler via next().
      next(error);
    }
  };

// Line 6: Export the asyncHandler for use in routes/controllers.
module.exports = { asyncHandler };