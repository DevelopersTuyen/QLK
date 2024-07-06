// user/user.js
const express = require('express');
const db = require('../database/connectdb');
const router = express.Router();

router.get('/get-all-warehouse', (req, res) => {
  db.query('SELECT * FROM warehouse', (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// Update warehouse
router.put('/update-warehouse/:id', (req, res) => {
  const warehouseId = req.params.id;
  const { name,location,capacity,product_code,created_by } = req.body;

  db.query(
    'UPDATE warehouse SET name= ?,location = ?, capacity = ?,product_code =?,created_by =? WHERE id = ?',
    [name,location,capacity ,product_code,created_by, warehouseId],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (results.affectedRows === 0) {
        return res.status(404).send({ message: 'warehouse not found' });
      }
      res.send({ message: 'warehouse updated successfully' });
    }
  );
});



// Add new warehouse
router.post('/add-warehouse', (req, res) => {
  const {name,location,capacity,product_code,created_by} = req.body;

  db.query(
    'INSERT INTO warehouse (name,location,capacity,product_code,created_by) VALUES (?, ?, ?, ?, ?)',
    [name,location,capacity,product_code,created_by],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.send({ message: 'warehouse added successfully', warehouse: results.insertId });
    }
  );
});

// Delete warehouse by ID
router.delete('/delete-warehouse/:id', (req, res) => {
  const warehouseId = req.params.id;

  db.query(
    'DELETE FROM warehouse WHERE id = ?',
    [warehouseId],
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

router.get('/search-warehouse', (req, res) => {
  const keyword = req.query.keyword;
  const query = `SELECT * FROM warehouse WHERE name LIKE '%${keyword}%' OR location LIKE '%${keyword}%' OR created_by LIKE '%${keyword}%'`;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  }); 

});

// Add new product
router.post('/add-products', (req, res) => {
  const {name,description,import_price,selling_price,category,warehouse_id,created_by} = req.body;

  db.query(
    'INSERT INTO products (name,description,import_price,selling_price,category,warehouse_id,created_by) VALUES (?, ?, ?, ?, ?,?, ?)',
    [name,description,import_price,selling_price,category,warehouse_id,created_by],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.send({ message: 'products added successfully', products: results.insertId });
    }
  );
});

//lấy danh sách sản phẩm
router.get('/get-all-product', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// Update product
router.put('/update-product/:id', (req, res) => {
  const productId = req.params.id;
  const { name,description,import_price,selling_price,category,warehouse_id,created_by } = req.body;

  db.query(
    'UPDATE products SET name= ?,description = ?, import_price = ?,selling_price =?,category =?,warehouse_id =?,created_by =? WHERE id = ?',
    [ name,description,import_price,selling_price,category,warehouse_id,created_by, productId],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (results.affectedRows === 0) {
        return res.status(404).send({ message: 'product not found' });
      }
      res.send({ message: 'product updated successfully' });
    }
  );
});

// Delete product by ID
router.delete('/delete-product/:id', (req, res) => {
  const productId = req.params.id;

  db.query(
    'DELETE FROM products WHERE id = ?',
    [productId],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (results.affectedRows === 0) {
        return res.status(404).send({ message: 'product not found' });
      }
      res.send({ message: 'product deleted successfully' });
    }
  );
});

router.get('/search-product', (req, res) => {
  const keyword = req.query.keyword;
  const query = `SELECT * FROM products WHERE name LIKE '%${keyword}%' OR created_by LIKE '%${keyword}%'`;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  }); 

});

// Update product to warehouse
router.put('/update-product-add-warehouse/:id', (req, res) => {
  const warehouseId = req.params.id;
  const { product_code} = req.body;

  db.query(
    'UPDATE warehouse SET product_code =? WHERE id = ?',
    [product_code,warehouseId],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (results.affectedRows === 0) {
        return res.status(404).send({ message: 'warehouse not found' });
      }
      res.send({ message: 'warehouse updated successfully' });
    }
  );
});

router.post('/addProductToWarehouses', (req, res) => {
  const warehouseProductEntries = req.body;

  const values = warehouseProductEntries.map(entry => [entry.product_id, entry.warehouse_id]);

  db.query(
    'INSERT INTO warehouse (product_id, warehouse_id) VALUES ?',
    [values],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.send({ message: 'New warehouse_product entries added successfully' });
    }
  );
});

router.get('/getWarehouseById/:id', (req, res) => {
  const warehouseId = req.params.id;

  db.query(
    'SELECT * FROM warehouse WHERE id = ?',
    [warehouseId],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (results.length === 0) {
        return res.status(404).send({ message: 'Warehouse not found' });
      }
      res.send(results[0]);
    }
  );
});

// Update product by warehouse
router.put('/update-product-by-warehouse/:id', (req, res) => {
  const productId = req.params.id;
  const { warehouse_id} = req.body;

  db.query(
    'UPDATE products SET warehouse_id =? WHERE id = ?',
    [warehouse_id,productId],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (results.affectedRows === 0) {
        return res.status(404).send({ message: 'products not found' });
      }
      res.send({ message: 'products updated successfully' });
    }
  );
});

router.get('/getProductById/:id', (req, res) => {
  const productId = req.params.id;

  db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (results.length === 0) {
        return res.status(404).send({ message: 'products not found' });
      }
      res.send(results[0]);
    }
  );
});

module.exports = router;
