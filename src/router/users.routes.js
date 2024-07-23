import express from 'express';
import { store } from '../controllers/users.controller.js';

const router = express.Router();
router.route("/register").get(store);

export { router };
