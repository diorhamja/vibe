const Reservation = require('../models/reservation.model');
const Event = require('../models/event.model');
const { sendReservationEmail } = require('../utils/email.js');

module.exports.findExistingReservation = async (req, res) => {
    try {
        const { event, user } = req.body;
    
        const foundEvent = await Event.findById(event);
        if (!foundEvent)
            return res.status(404).json({ message: "Event not found" });
    
        const existingReservation = await Reservation.findOne({ event, user })
            .populate("event")
            .populate("user", "-password");
    
        if (existingReservation) {
            return res.status(200).json({
            hasReservation: true,
            reservation: existingReservation,
            });
        }
    
        res.status(200).json({ hasReservation: false });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

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

    if (populatedReservation) {
        await sendReservationEmail(
            populatedReservation.user.email,
            populatedReservation.user.name,
            populatedReservation.event,
            populatedReservation._id.toString(),
            populatedReservation.noReservations,
        );
    }
    
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

module.exports.getBusinessReservations = async (req, res) => {
    try {
        const businessId = req.user._id;
    
        const events = await Event.find({ business: businessId });
    
        const eventsWithReservations = await Promise.all(
            events.map(async (event) => {
            const reservations = await Reservation.find({ event: event._id })
                .populate("user", "name email profilePicture")
                .lean();
    
            return {
                _id: event._id,
                title: event.title,
                date: event.date,
                time: event.time,
                reservations,
            };
            })
        );
    
        res.status(200).json(eventsWithReservations);
        } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch reservations" });
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
