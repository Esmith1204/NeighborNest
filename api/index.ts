// Vercel serverless entry: every /api/* request is rewritten here (vercel.json) and handled by the
// same Express app used locally. Set ANTHROPIC_API_KEY in the Vercel project's environment variables.
import app from "../server/app.js";

export default app;
