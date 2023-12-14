const fs = require("fs");
const { getClientIp } = require("request-ip");

// Function to read blocked IPs from a file
function loadBlockedIPs(filePath) {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    const ips = data.trim().split("\n");
    return new Set(ips);
  } catch (error) {
    console.error("Error reading blocked IPs file:", error.message);
    return new Set();
  }
}

module.exports = async (req, res, next) => {
  const clientIP =
    req.ip ||
    req.headers["x-forwarded-for"] ||
    req.headers["x-real-ip"] ||
    getClientIp(req);
  const data = loadBlockedIPs(__dirname + "/../config/data.txt");
  if (data.has(clientIP)) {
    return res.status(404).send("Page not found");
  }
  next();
};
