const express = require("express");
const router = express.Router();
const TaskController = require("../controllers/TaskController");

router.get("/", (req, res) => TaskController.getAll(req, res));
router.get("/:id", (req, res) => TaskController.read(req, res));
router.post("/", (req, res) => TaskController.create(req, res));
router.put("/:id", (req, res) => TaskController.update(req, res));
router.delete("/:id", (req, res) => TaskController.delete(req, res));

module.exports = router;
