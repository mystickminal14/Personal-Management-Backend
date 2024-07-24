import express from 'express';
import { store,login,logOut ,refreshAccessToken} from '../controllers/users.controller.js';
import { upload } from '../middleware/multer.middleware.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
const router = express.Router();
router.route("/register").post(
    upload.single('avatar'),
    store);
router.route("/login").post(login)

//PROTECTED
router.route("/logout").post(verifyJWT,logOut)
router.route("/refresh-token").post(refreshAccessToken)
export { router };
