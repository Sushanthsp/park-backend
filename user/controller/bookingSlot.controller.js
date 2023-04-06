const jwt = require("jsonwebtoken");
const BookingSchema = require("../models/bookingSlot.model");
const ParkingSlotSchema = require("../models/parkingSlot.model");
const config = require("../../config/config");
const Users = require("../models/users.model");

module.exports.book = async (request, response, next) => {
    try {
        const { vehicleType, dateOfParking, endDateOfParking, vehicleNo, slotNumber, user } = request.body;

        if (dateOfParking === endDateOfParking || new Date(dateOfParking) > new Date(endDateOfParking)) {
            return response.status(400).json({
                status: false,
                message: "There should be difference between start and end time",
                data: null
            });
        }

        // Find the parking slot and populate its bookings
        let existingSlot = await ParkingSlotSchema.findOne({ slotNumber })
            .populate('bookings')
            .exec();

        if (!existingSlot) {
            existingSlot = await ParkingSlotSchema.create({
                slotNumber,
                bookings: [],
            });
        }

        // Check if the slot is available for the given time period
        const isSlotAvailable = existingSlot.bookings.every(booking => {


            const bookingStartDate = new Date(booking.dateOfParking);
            const bookingEndDate = new Date(booking.endDateOfParking);
            const inputStartDate = new Date(dateOfParking);
            const inputEndDate = new Date(endDateOfParking);

            const isBookingOverlapping = (inputStartDate >= bookingStartDate && inputStartDate < bookingEndDate) ||
                (inputEndDate > bookingStartDate && inputEndDate <= bookingEndDate) ||
                (inputStartDate <= bookingStartDate && inputEndDate >= bookingEndDate);
          
            return !isBookingOverlapping;
        });

        if (!isSlotAvailable) {
            return response.status(400).json({
                status: false,
                message: "This parking slot is not available for the given time period",
                data: null
            });
        }

        // Create the booking
        const bookingSlot = await BookingSchema.create({
            user,
            slotNumber,
            vehicleType,
            dateOfParking,
            endDateOfParking,
            vehicleNo,
        });

        // Add the booking to the parking slot's bookings array
        existingSlot.bookings.push(bookingSlot);
        await existingSlot.save();

        // Add the booking to the user's bookings array
        await Users.updateOne(
            { _id: user },
            { $push: { bookings: bookingSlot._id } }
        );

        return response.status(201).json({
            status: true,
            message: "Booking created successfully",
            data: bookingSlot
        });
    } catch (error) {
        console.log(error);
        return response.status(500).json({
            status: false,
            message: "Something went wrong",
            data: null
        });
    }
};


module.exports.updateBooking = async (request, response, next) => {
    try {
        const { bookingId, vehicleType, dateOfParking, endDateOfParking, vehicleNo } = request.body;

        // Find the booking by ID
        const booking = await BookingSchema.findById(bookingId);

        if (!booking) {
            return response.status(404).json({
                status: false,
                message: "Booking not found",
                data: null
            });
        }

        // Check if the new time period is available
        const existingSlot = await ParkingSlotSchema.findOne({ slotNumber: booking.slotNumber })
            .populate('bookings')
            .exec();

        const isSlotAvailable = existingSlot.bookings.every(existingBooking => {
            if (existingBooking._id.toString() === bookingId.toString()) {
                return true; // Skip checking the current booking
            }

            const existingBookingStartDate = new Date(existingBooking.dateOfParking);
            const existingBookingEndDate = new Date(existingBooking.endDateOfParking);
            const newBookingStartDate = new Date(dateOfParking);
            const newBookingEndDate = new Date(endDateOfParking);

            const isBookingOverlapping = (newBookingStartDate >= existingBookingStartDate && newBookingStartDate < existingBookingEndDate) ||
                (newBookingEndDate > existingBookingStartDate && newBookingEndDate <= existingBookingEndDate) ||
                (newBookingStartDate <= existingBookingStartDate && newBookingEndDate >= existingBookingEndDate);

            return !isBookingOverlapping;
        });

        if (!isSlotAvailable) {
            return response.status(400).json({
                status: false,
                message: "This parking slot is not available for the given time period",
                data: null
            });
        }

        // Update the booking
        booking.vehicleType = vehicleType;
        booking.dateOfParking = dateOfParking;
        booking.endDateOfParking = endDateOfParking;
        booking.vehicleNo = vehicleNo;
        await booking.save();

        return response.status(200).json({
            status: true,
            message: "Booking updated successfully",
            data: booking
        });
    } catch (error) {
        console.log(error);
        return response.status(500).json({
            status: false,
            message: "Something went wrong",
            data: null
        });
    }
};

module.exports.deleteBooking = async (request, response, next) => {
    try {
        const { id } = request.params;
        const booking = await BookingSchema.findByIdAndDelete(id);

        if (!booking) {
            return response.status(404).json({
                status: false,
                message: "Booking not found",
                data: null
            });
        }

        // Remove the booking from the parking slot's bookings array
        const parkingSlot = await ParkingSlotSchema.findOneAndUpdate(
            { slotNumber: booking.slotNumber },
            { $pull: { bookings: booking._id } },
            { new: true }
        );

        // Remove the booking from the user's bookings array
        await Users.updateOne(
            { _id: booking.user },
            { $pull: { bookings: booking._id } }
        );

        return response.status(200).json({
            status: true,
            message: "Booking deleted successfully",
            data: booking
        });
    } catch (error) {
        console.log(error);
        return response.status(500).json({
            status: false,
            message: "Something went wrong",
            data: null
        });
    }
};

module.exports.getBookingsBookingSchema = async (request, response, next) => {
    try {
        const { page , limit , startDate, endDate, slotNumber } = request.query;

        let query = { isCancelled: false };
        if (startDate && endDate) {
            query.dateOfParking = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        if (slotNumber) {
            query.slotNumber = slotNumber;
        }

        let bookings = await BookingSchema.find(query)
            .sort({ dateOfParking: 1, timePeriod: 1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        let count = await BookingSchema.countDocuments(query);

        return response.status(200).json({
            status: true,
            message: "Bookings retrieved successfully",
            data: { bookings, totalPages: Math.ceil(count / limit), currentPage: page }
        });
    } catch (error) {
        return next(error);
    }
};

module.exports.getBookings = async (request, response, next) => {
    try {
      const { page, limit, startDate, endDate, slotNumber } = request.query;
  
      // Calculate skip and limit values for pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const parsedLimit = parseInt(limit);
  
      // Define the query object for filtering
      const query = { isCancelled: false };
      if (startDate) query.startTime = { $gte: new Date(startDate) };
      if (endDate) query.endTime = { $lte: new Date(endDate) };
      if (slotNumber) query.slotNumber = slotNumber;
  
      // Use the query object to retrieve bookings that match the criteria with pagination
      const bookings = await BookingSchema.find(query)
        .skip(skip)
        .limit(parsedLimit);
  
      // Return the retrieved bookings
      return response.status(200).json({
        status: true,
        message: "Bookings retrieved successfully",
        data: bookings
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  
  