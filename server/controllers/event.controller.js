const Event = require('../models/event.model');
const Reservation = require('../models/reservation.model');

module.exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('business', '-password');
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.getOneEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('business', '-password');
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports.createEvent = async (req, res) => {
    try {
        const imageUrl = req.file ? req.file.path : '';

        console.log('Request body:', req.body);
        console.log('Uploaded file:', req.file);

        const event = await Event.create({
            ...req.body,
            spotsLeft: req.body.capacity,
            image: imageUrl,
            business: req.userId
        });

        res.status(201).json(event);
    } catch (err) {
        console.error('Create event error:', err);
        res.status(400).json({ error: err.message });
    }
};

module.exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        if (event.business.toString() !== req.userId.toString()) {
            return res.status(403).json({ message: 'Unauthorized to update this event' });
        }

        const updateData = {
            ...req.body,
        };

        if (req.file) {
            updateData.image = req.file.path;
        }

        console.log('Update data:', updateData);
        console.log('Uploaded file:', req.file);

        const updated = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(updated);
    } catch (err) {
        console.error('Update event error:', err);
        res.status(400).json({ error: err.message });
    }
};

module.exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        if (event.business.toString() !== req.userId.toString()) {
            return res.status(403).json({ message: 'Unauthorized to delete this event' });
        }

        await Reservation.deleteMany({ event: event._id });

        await Event.findByIdAndDelete(req.params.id);

        res.json({ message: 'Event and associated reservations deleted successfully' });
    } catch (err) {
        console.error('Delete event error:', err);
        res.status(400).json({ error: err.message });
    }
};

