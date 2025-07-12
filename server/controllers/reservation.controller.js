const Reservation = require('../models/reservation.model');
const Event = require('../models/event.model');

module.exports.createReservation = async (req, res) => {
    try {
    const { event, user, noReservations } = req.body;
    
    const foundEvent = await Event.findById(event);
    if (!foundEvent) return res.status(404).json({ message: 'Event not found' });
    
    if (foundEvent.spotsLeft <= 0 || foundEvent.spotsLeft <= noReservations) {
        return res.status(400).json({ message: 'Event is full or not enough spots to accomodate request' });
    }
    
    const existingReservation = await Reservation.findOne({ event, user });
    if (existingReservation) {
        return res.status(400).json({ message: 'You already have a reservation for this event' });
    }
    
    const createdReservation = await Reservation.create(req.body);
    
    await Event.findByIdAndUpdate(event, {
        $inc: { spotsLeft: -noReservations }
    });
    
    const populatedReservation = await Reservation.findById(createdReservation._id)
        .populate('user', '-password')
        .populate('event');
    
    res.status(201).json(populatedReservation);
    } catch (err) {
    res.status(400).json({ error: err.message });
    }
};

module.exports.getUserReservedEvents = async (req, res) => {
    try {
        const userId = req.userId;
        
        const reservations = await Reservation.find({ user: userId })
            .populate({
            path: 'event',
            populate: {
                path: 'business',
                select: '-password'
            }
            })
            .populate('user', '-password')
            .sort({ createdAt: -1 });
        
        const events = reservations.map(reservation => ({
            ...reservation.event.toObject(),
            reservationId: reservation._id,
            reservationDate: reservation.createdAt
        }));

        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find()
            .populate('user', '-password')
            .populate('event');
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.getOneReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id)
            .populate('user', '-password')
            .populate('event');
        if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
        res.json(reservation);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports.updateReservation = async (req, res) => {
    try {
        const updated = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Reservation not found' });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports.deleteReservation = async (req, res) => {
    try {
        const deleted = await Reservation.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Reservation not found' });
        res.json({ message: 'Reservation deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
