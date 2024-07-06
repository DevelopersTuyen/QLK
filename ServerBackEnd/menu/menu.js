// menu/menu.js
const express = require('express');
const db = require('../database/connectdb');
const router = express.Router();

router.get('/get-all', (req, res) => {
  db.query('SELECT * FROM menu', (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});
 
module.exports = router;
