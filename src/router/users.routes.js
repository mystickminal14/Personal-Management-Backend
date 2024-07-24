import express from 'express';
import { store,login } from '../controllers/users.controller.js';
import { upload } from '../middleware/multer.middleware.js';
const router = express.Router();
router.route("/register").post(
    upload.single('avatar'),
    store);
router.route("/login").post(login)
export { router };
