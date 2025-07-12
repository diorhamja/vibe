const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    event: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Event', 
        required: [true, "Event reference is required"] 
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: [true, "User reference is required"] 
    },
    noReservations: {
        type: Number,
        required: [true, "Must specify how many to reserve"]
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'accepted',
    },
}, { timestamps: true });

module.exports = mongoose.model('Reservation', ReservationSchema);