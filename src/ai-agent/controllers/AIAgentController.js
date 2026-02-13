const AIAgentService = require("../services/AIAgentService");

class AIAgentController {
  async ask(req, res) {
      console.log("🔥 AI AGENT ASK HIT", req.body);
    try {
      const { query } = req.body;

      if (!query || query.trim().length < 2) {
        return res.status(400).json({
          message: "Query is required"
        });
      }

      const result = await AIAgentService.handleQuery(query);

      return res.status(200).json(result);
    } catch (error) {
      console.error("AI AGENT ERROR:", error);
      return res.status(500).json({
        message: "AI Agent failed"
      });
    }
  }
}

module.exports = new AIAgentController();
