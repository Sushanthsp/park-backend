const express = require("express");
const router = express.Router();
const bookingSlotController = require("../controller/bookingSlot.controller");
const bookingSlotValidation = require("../validator/bookingSlot.validator");
const { verifyJWTToken } = require("../../middleware/jwt.middleware");

router.post("/bookslot", bookingSlotValidation.book,verifyJWTToken, bookingSlotController.book);
router.get("/bookslot", bookingSlotValidation.getBooking, bookingSlotController.getBookings);
router.get("/test", bookingSlotValidation.getBooking, bookingSlotController.getBookingsBookingSchema);


module.exports = router;
