// user/user.js
const express = require('express');
const db = require('../database/connectdb');
const router = express.Router();

router.get('/get-all', (req, res) => {
  db.query('SELECT * FROM user', (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// Update user
router.put('/update/:id', (req, res) => {
  const userId = req.params.id;
  const { username,name, email, level } = req.body;

  db.query(
    'UPDATE user SET username= ?,name = ?, email = ?, level = ? WHERE id = ?',
    [username,name, email, level, userId],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (results.affectedRows === 0) {
        return res.status(404).send({ message: 'User not found' });
      }
      res.send({ message: 'User updated successfully' });
    }
  );
});


// Add new user
router.post('/add', (req, res) => {
  const { username, name, email, level, password } = req.body;

  db.query(
    'INSERT INTO user (username, name, email, level, password) VALUES (?, ?, ?, ?, ?)',
    [username, name, email, level, password],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.send({ message: 'User added successfully', userId: results.insertId });
    }
  );
});

// Delete user by ID
router.delete('/delete/:id', (req, res) => {
  const userId = req.params.id;

  db.query(
    'DELETE FROM user WHERE id = ?',
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (results.affectedRows === 0) {
        return res.status(404).send({ message: 'User not found' });
      }
      res.send({ message: 'User deleted successfully' });
    }
  );
});

router.get('/search', (req, res) => {
  const keyword = req.query.keyword;
  const query = `SELECT * FROM user WHERE (username LIKE '%${keyword}%' OR name LIKE '%${keyword}%') AND level != 1`;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

router.get('/get-all-account', (req, res) => {
  db.query('SELECT * FROM user WHERE level <> 1', (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

module.exports = router;
