import dotenv from "dotenv";
import { app } from "./app.js";
import connectDb from "./db/connection.js";
dotenv.config({
  path: "./env",
});

const PORT = process.env.PORT || 8000;
connectDb()
  .then(() => {
    app.listen(
      (PORT,
      () => {
        console.log("Server is running in port", PORT);
      })
    );
  })
  .catch((err) =>
    app.on("error", () => {
      console.log("Internal Server Error", err);
      throw err;
    })
  );
