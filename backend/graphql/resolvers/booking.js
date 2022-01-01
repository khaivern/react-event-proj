const Booking = require('../../models/booking');
const Event = require('../../models/event');
const { transformBooking, singleEvent } = require('./merge');

module.exports = {
  bookings: async (_, req) => {
    if (!req.isAuth) {
      throw new Error('UnAuthenticated');
    }
    try {
      const bookings = await Booking.find({ user: req.userId });
      return bookings.map(book => transformBooking(book));
    } catch (error) {
      throw error;
    }
  },
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('UnAuthenticated');
    }
    try {
      const event = await Event.findOne({ _id: args.eventId });
      if (!event) {
        throw new Error('Event does not exist!');
      }
      const book = new Booking({
        event: event,
        user: req.userId,
      });
      const result = await book.save();
      return transformBooking(result);
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('UnAuthenticated');
    }
    try {
      const booking = await Booking.findById(args.bookingId);
      if (!booking) {
        throw new Error('Booking does not exist!');
      }
      const event = await singleEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (error) {
      throw error;
    }
  },
};
