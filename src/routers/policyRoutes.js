const express = require("express");
const router = express.Router();

router.get("/policies", (req, res) => {
  res.json({
    status: "testing",
    message: "Policies will be updated before production launch",
  });
});

module.exports = router;
