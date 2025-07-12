const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
require('dotenv').config();

app.use(cors({credentials: true, origin: 'http://localhost:5173'}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

require('./config/mongoose.config');

const userRoutes = require('./routes/user.route');
const eventRoutes = require('./routes/event.route');
const reservationRoutes = require('./routes/reservation.route');

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/reservations', reservationRoutes);

app.listen(8000, () => {
    console.log("Listening at Port 8000")
})

