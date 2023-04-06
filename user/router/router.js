const express = require("express");
const router = express.Router();

const authRouter = require("./auth.route");
const bookingSlotRouter = require("./bookingSlot.route");

router.use("/", authRouter);
router.use("/book", bookingSlotRouter);

module.exports = router;

