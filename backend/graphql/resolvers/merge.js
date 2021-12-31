const User = require('../../models/user');
const Event = require('../../models/event');

const { dateToString } = require('../../helpers/date');

const singleEvent = async eventId => {
  try {
    const event = await Event.findById(eventId);
    return transformEvent(event);
  } catch (error) {
    throw error;
  }
};

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map(event => {
      return transformEvent(event);
    });
  } catch (error) {
    throw error;
  }
};

const user = async userId => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found!');
    }

    return {
      ...user._doc,
      createdEvents: events.bind(this, user.createdEvents),
    };
  } catch (error) {
    throw error;
  }
};

const transformEvent = event => {
  return {
    ...event._doc,
    creator: user.bind(this, event.creator),
    date: dateToString(event.date),
  };
};

const transformBooking = booking => {
  return {
    ...booking._doc,
    user: user(booking.user),
    event: singleEvent(booking.event),
    createdAt: dateToString(booking.createdAt),
    updatedAt: dateToString(booking.updatedAt),
  };
};

exports.transformBooking = transformBooking;
exports.transformEvent = transformEvent;
exports.singleEvent = singleEvent;
// exports.events = events;
// exports.user = user;
