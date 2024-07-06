const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

//DB
const db = require('./database/connectdb');

//USER
const userRoutes = require('./users/user');

// API USER
app.use('/api/users', userRoutes);

//menu
const menuRoutes = require('./menu/menu');
// API menu
app.use('/api/menu', menuRoutes);

//warehouse && Invetory
const warehouseInvetoryRoutes = require('./inventoryManagement/inventoryManagement');
// API menu
app.use('/api/warehouseInvetory', warehouseInvetoryRoutes);


 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
