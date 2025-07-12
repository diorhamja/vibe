const express = require('express');
const router = express.Router();
const ReservationController = require('../controllers/reservation.controller');
const requireAuth = require('../middleware/requireAuth');

router.post('/', requireAuth, ReservationController.createReservation);
router.get('/', requireAuth, ReservationController.getAllReservations);
router.get('/user', requireAuth, ReservationController.getUserReservedEvents);
router.get('/:id', requireAuth, ReservationController.getOneReservation);
router.patch('/:id', requireAuth, ReservationController.updateReservation);
router.delete('/:id', requireAuth, ReservationController.deleteReservation);

module.exports = router;
