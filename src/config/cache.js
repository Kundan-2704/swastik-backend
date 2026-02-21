const apicache = require("apicache");

const cache = apicache.middleware;
const cacheInstance = apicache;

module.exports = {
  cache,
  cacheInstance,
};