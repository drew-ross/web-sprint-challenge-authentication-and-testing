const router = require('express').Router();
const bcrypt = require('bcryptjs');
const usersDb = require('./usersModel');

router.post('/register', (req, res) => {
  const { username, password } = req.body;
  const hash = bcrypt.hashSync(password, 12);

  usersDb.register({ username, hash })
    .then(newUser => {
      if (newUser) {
        res.status(201).json({ message: 'Account created', username: newUser.username });
      } else {
        res.status(400).json({ message: 'An account with that username already exists.' });
      }
    })
    .catch(err => res.status(500).json({ message: err.message }));
});

router.post('/login', (req, res) => {
  // implement login
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
