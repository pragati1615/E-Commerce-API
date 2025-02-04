const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signup = async (req, res) => {
  const { name, email, password, role_id } = req.body;
  const hashedPassword = await bcrypt.hash(password, 8);

  try {
    const user = await User.create({ name, email, password: hashedPassword, role_id });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.status(201).send({ user, token });
  } catch (err) {
    res.status(400).send({ error: 'Error signing up.' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).send({ error: 'Invalid credentials.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: 'Invalid credentials.' });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.send({ user, token });
  } catch (err) {
    res.status(400).send({ error: 'Error logging in.' });
  }
};

module.exports = { signup, login };
