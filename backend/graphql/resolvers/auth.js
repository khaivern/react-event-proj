const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

module.exports = {
  createUser: async args => {
    try {
      const existingUser = await User.findOne({
        email: args.userInput.email,
      });
      if (existingUser) {
        throw new Error('User exists already');
      }

      const hashedPW = await bcrypt.hash(args.userInput.password, 12);
      const user = new User({
        email: args.userInput.email,
        password: hashedPW,
      });
      const result = await user.save();
      return { ...result._doc, password: null };
    } catch (err) {
      console.log(err.message || 'Something went wrong');
      throw err;
    }
  },
  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Email does not exist!');
      }

      const doMatch = await bcrypt.compare(password, user.password);
      if (!doMatch) {
        throw new Error('Passwords do not match');
      }

      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
        },
        'secretkey',
        { expiresIn: '1h' }
      );

      return {
        userId: user.id,
        token: token,
        tokenExpiration: 1,
      };
    } catch (error) {
      throw error;
    }
  },
};
