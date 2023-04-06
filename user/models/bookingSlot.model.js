const mongoose = require("mongoose");
const { Schema } = mongoose;
const mongoosePaginate = require("mongoose-paginate-v2");
require("@mongoosejs/double");

const BookingSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'Users',
            required: true,
        },
        slotNumber: {
            type: Number,
            required: true,
        },
        vehicleType: {
            type: String,
            enum: ["car", "bike", "truck"],
            required: true,
        },
        dateOfParking: {
            type: Date,
            required: true,
        },
        endDateOfParking: {
            type: Date,
            required: true,
        },
        vehicleNo: {
            type: String,
            required: true,
        },
        isCancelled: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);


BookingSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("BookingSchema", BookingSchema);
