const router = require('express').Router();
const bcrypt = require('bcryptjs');
const usersDb = require('./usersModel');
const jwt = require('jsonwebtoken');

router.post('/register', (req, res) => {
  const { username, password } = req.body;
  const hash = bcrypt.hashSync(password, 12);

  usersDb.register({ username, password: hash })
    .then(newUser => {
      if (newUser) {
        res.status(201).json({ message: 'Account created' });
      } else {
        res.status(400).json({ message: 'An account with that username already exists.' });
      }
    })
    .catch(err => res.status(500).json({ message: 'There was a problem with the server.', error: err.message }));
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  usersDb.findBy({ username })
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = signToken(user);
        res.status(200).json({ message: `Welcome ${username}.`, token });
      } else {
        res.status(401).json({ message: 'Incorrect login info.' });
      }
    })
    .catch(err => res.status(500).json({ message: 'There was a problem with the server.', error: err.message }));
});

function signToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const secret = 'px%3aE!jHA7RWqx';
  const options = {
    expiresIn: '1d'
  };
  return jwt.sign(payload, secret, options);
}

module.exports = router;
