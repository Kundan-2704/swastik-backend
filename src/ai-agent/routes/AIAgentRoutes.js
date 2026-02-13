const express = require("express");
const router = express.Router();

const AIAgentController = require("../controllers/AIAgentController");

router.post(
  "/ask",
  AIAgentController.ask.bind(AIAgentController)
);

module.exports = router;
