const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = {
  async register(req, res) {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) return res.status(400).json({ error: 'User already exists' });

    const password_hash = await bcrypt.hash(password, 8);
    const user = await User.create({ name, email, password_hash, role });

    return res.json({ id: user.id, name: user.name, email: user.email });
  },

  async login(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Incorrect password' });

    // No login
    const token = jwt.sign(
      { id: user.id, email: user.email, cpf: user.cpf },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    
    return res.json({ user: { id: user.id, name: user.name }, token });
  },
};