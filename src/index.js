import dotenv from "dotenv";
import { app } from "./app.js";
import connectDb from "./db/connection.js";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 8000;

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is running on port", PORT);
    });
  })
  .catch((err) => {
    console.error("Internal Server Error", err);
    process.exit(1);
  });
