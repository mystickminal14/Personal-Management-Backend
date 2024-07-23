import express from 'express';
import { store } from '../controllers/users.controller.js';
import { upload } from '../middleware/multer.middleware.js';
const router = express.Router();
router.route("/register").get(
    upload.single('avatar'),
    store);

export { router };
