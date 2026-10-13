import "dotenv/config";
import app from "./src/app.js";
import { createUsersTable } from "./models/auth.model.js";
import { createProductTable } from "./models/product.model.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await createUsersTable();
    await createProductTable();

    app.listen(PORT, () => {
      console.log(`MyStock API is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server could not start:", error.message);
    process.exitCode = 1;
  }
}

startServer();
