const replies = require("../constants/agentReplies");

module.exports = function getReply(key) {
  const list = replies[key] || replies.fallback;
  return list[Math.floor(Math.random() * list.length)];
};
