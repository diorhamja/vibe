const express = require('express');
const router = express.Router();
const EventController = require('../controllers/event.controller');
const requireAuth = require('../middleware/requireAuth');
const requireBusiness = require('../middleware/requireBusiness');
const { eventUpload } = require('../middleware/cloudinary');

router.post('/', requireAuth, requireBusiness, eventUpload.single("eventImage"), EventController.createEvent);
router.get('/', EventController.getAllEvents);
router.get('/:id', requireAuth, EventController.getOneEvent);
router.patch('/:id', requireAuth, requireBusiness, eventUpload.single("eventImage"), EventController.updateEvent);
router.delete('/:id', requireAuth, requireBusiness, EventController.deleteEvent);

module.exports = router;