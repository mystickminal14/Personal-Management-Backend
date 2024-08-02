import express from 'express';
import { store, login,logOut,refreshAccessToken,getCurrentUser,updateAccount,updatePassword ,updateAvatar} from '../controllers/users.controller.js';
import { upload } from '../middleware/multer.middleware.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
const router = express.Router();
router.route("/register").post(
    upload.single('avatar'),
    store);
router.route("/login").post(login)
router.route("/users").get(verifyJWT,getCurrentUser)
router.route("/update").post(verifyJWT,updateAccount)
router.route("/update-password").post(verifyJWT,updatePassword)
router.route("/update-avatar").post( upload.single('avatar'),verifyJWT,updateAvatar)

//PROTECTEDA
router.route("/logout").post(verifyJWT,logOut)
router.route("/refresh-token").post(refreshAccessToken)
export { router };
