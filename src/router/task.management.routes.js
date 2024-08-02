import express from "express";
import {
  create,
  drop,
  retrieve,
  singleView,
  update,
  updateBackground,
} from "../controllers/board.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import {
  store,
  viewTask,
  retrieveTask,
  dropTask,
  updateTask,
  createStatus ,updateStatus,deleteStatus
} from "../controllers/tasks.controller.js";
import {
  createSubTask,
  dropSubTask,
  editSubTask,
  viewSubTask,
  retireveSubTask,
} from "../controllers/subtask.controller.js";

const taskRouter = express.Router();

taskRouter.route("/boards/create").post(verifyJWT, upload.single("background"), create);
taskRouter.route("/boards").get(verifyJWT, retrieve);
taskRouter.route("/boards/:id").get(verifyJWT, singleView);
taskRouter.route("/boards/edit/:id").post(verifyJWT, update);
taskRouter.route("/boards/delete/:id").get(verifyJWT, drop);
taskRouter .route("/boards/update-background/:id").post(upload.single("background"), verifyJWT, updateBackground);


// TASK ROUTES
taskRouter.route("/boards/tasks/create").post(verifyJWT, store);
taskRouter.route("/boards/tasks/delete/:id").delete(verifyJWT, dropTask);
taskRouter.route("/boards/tasks/edit/:id").put(verifyJWT, updateTask);
taskRouter.route("/boards/tasks/view/:id").get(verifyJWT, viewTask);
taskRouter.route("/boards/tasks/:id").get(verifyJWT, retrieveTask);
taskRouter.route("/boards/tasks/status/:id").post(verifyJWT, createStatus);
taskRouter.route("/boards/tasks/status/edit/:id/:statusId").put(verifyJWT, updateStatus);
taskRouter.route("/boards/tasks/status/drop/:id/:statusId").delete(verifyJWT, deleteStatus);


//  SUBTASKS ROUTES
taskRouter.route("/boards/tasks/subtasks/create").post(verifyJWT, createSubTask);
taskRouter.route("/boards/tasks/subtasks/delete/:id").delete(verifyJWT, dropSubTask);
taskRouter.route("/boards/tasks/subtasks/edit/:id").put(verifyJWT, editSubTask);
taskRouter.route("/boards/tasks/subtasks/view/:id").get(verifyJWT, viewSubTask);
taskRouter.route("/boards/tasks/subtasks/:id").get(verifyJWT, retireveSubTask);

export { taskRouter };
