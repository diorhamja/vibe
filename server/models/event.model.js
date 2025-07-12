const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true,
        minlength: [5, 'Title must be at least 5 characters'],
        maxlength: [100, 'Title cant exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Event description is required'],
        minlength: [20, 'Description must be at least 20 characters'],
        maxlength: [1000, 'Description cant exceed 1000 characters']
    },
    date: {
        type: Date,
        required: [true, 'Event date is required'],
        validate: {
            validator: function(value) {
            return value >= new Date();
            },
            message: 'Event date must be in the future'
        }
    },
    time: {
        type: String,
        required: [true, 'Event time is required in 24 hour format'],
    },
    capacity: {
        type: Number,
        required: [true, 'Capacity is required'],
        min: [1, 'Capacity must be at least 1'],
        max: [500, 'Capacity cannot exceed 500']
    },
    spotsLeft: {
        type: Number,
    },
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Business ref is required']
    },
    image: {
        type: String,
        default: '',
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);