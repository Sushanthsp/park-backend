const mongoose = require("mongoose");
const { Schema } = mongoose;
const mongoosePaginate = require("mongoose-paginate-v2");


const ParkingSlotSchema = new Schema({
    slotNumber: {
        type: Number,
        required: true,
        min: 1,
        max: 200
    },
    bookings: [
        {
            type: Schema.Types.ObjectId,
            ref: 'BookingSchema',
        }
    ]
});

module.exports = mongoose.model("ParkingSlot", ParkingSlotSchema);
