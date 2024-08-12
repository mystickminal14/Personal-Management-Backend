import express from "express";
import {
  create,
  drop,
  retrieve,
  view,
  deleted,
  update,

  updateBackground,getLatestBoard,createStatus
} from "../controllers/board.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import {
  store,
  viewTask,
  retrieveTask,
  dropTask,
  updateTask,
  
  updateStatus,
  deleteStatus,
} from "../controllers/tasks.controller.js";
import {
  createSubTask,
  dropSubTask,
  editSubTask,
  viewSubTask,
  retireveSubTask,
  countData,
} from "../controllers/subtask.controller.js";

const taskRouter = express.Router();

taskRouter
  .route("/boards/create")
  .post(verifyJWT, upload.single("background"), create);
taskRouter.route("/boards").get(verifyJWT, retrieve);
taskRouter.route("/boards/latest").get(verifyJWT, getLatestBoard);
taskRouter.route("/boards/edit/:id").put(verifyJWT, update);
taskRouter.route("/boards/delete/:id").delete(verifyJWT, drop);
taskRouter.route("/boards/status/:id").post(verifyJWT, createStatus);
taskRouter.route("/boards/deleted").get(verifyJWT, deleted);
taskRouter.route("/boards/:id").get(verifyJWT, view);
taskRouter
  .route("/boards/update-background/:id")
  .post(upload.single("background"), verifyJWT, updateBackground);

// TASK ROUTES
taskRouter.route("/boards/tasks/create").post(verifyJWT, store);
taskRouter.route("/boards/tasks/delete/:id").delete(verifyJWT, dropTask);
taskRouter.route("/boards/tasks/edit/:id").put(verifyJWT, updateTask);
taskRouter.route("/boards/tasks/view/:id").get(verifyJWT, viewTask);
taskRouter.route("/boards/tasks/:id").get(verifyJWT, retrieveTask);
taskRouter
  .route("/boards/tasks/status/edit/:id/:statusId")
  .put(verifyJWT, updateStatus);
taskRouter
  .route("/boards/tasks/status/drop/:id/:statusId")
  .delete(verifyJWT, deleteStatus);

//  SUBTASKS ROUTES
taskRouter
  .route("/boards/tasks/subtasks/create")
  .post(verifyJWT, createSubTask);
taskRouter
  .route("/boards/tasks/subtasks/delete/:id")
  .delete(verifyJWT, dropSubTask);
taskRouter.route("/boards/tasks/subtasks/edit/:id").put(verifyJWT, editSubTask);
taskRouter.route("/boards/tasks/subtasks/view/:id").get(verifyJWT, viewSubTask);
taskRouter.route("/boards/tasks/subtasks/:id").get(verifyJWT, retireveSubTask);
taskRouter.route("/boards/tasks/subtasks-count/:id").get(verifyJWT, countData);

export { taskRouter };
