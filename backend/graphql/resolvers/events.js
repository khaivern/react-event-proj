const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');
const { transformEvent } = require('./merge');

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => transformEvent(event));
    } catch (err) {
      return console.log(err);
    }
  },
  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('UnAuthenticated');
    }
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: dateToString(args.eventInput.date),
      creator: req.userId,
    });
    try {
      await event.save();
      const fetchedUser = await User.findById(event.creator);
      if (!fetchedUser) {
        throw new Error('User not found!');
      }
      fetchedUser.createdEvents.push(event);
      await fetchedUser.save();
      return transformEvent(event);
    } catch (error) {
      console.log(error.message || 'Database Failed');
      throw error;
    }
  },
};
