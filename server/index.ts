import "dotenv/config"; // loads ANTHROPIC_API_KEY from .env into process.env
import app from "./app.js";
import { aiConfigured } from "./ai.js";
import { PORT } from "./config.js";

// Bound to localhost only; Vite proxies /api here in dev.
app.listen(PORT, "127.0.0.1", () => {
  console.log(`API server on http://127.0.0.1:${PORT} (AI ${aiConfigured() ? "configured" : "NOT configured"})`);
});
