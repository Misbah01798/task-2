// server.js
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const User = require('./models/User');
const Product = require('./models/Product');
const PurchaseHistory = require('./models/PurchaseHistory');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/storeDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// Test route for GET requests (to verify server is running)
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Fetch data from the API and store it in the database
app.get('/generate-report', async (req, res) => {
  try {
    const response = await axios.get('https://raw.githubusercontent.com/Bit-Code-Technologies/mockapi/main/purchase.json');
    const data = response.data;

    for (const item of data) {
      let user = await User.findOne({ email: item.customerEmail });
      if (!user) {
        user = new User({ name: item.customerName, email: item.customerEmail, totalSpent: 0 });
        await user.save();
      }

      let product = await Product.findOne({ productName: item.productName });
      if (!product) {
        product = new Product({ productName: item.productName, price: item.price });
        await product.save();
      }

      const purchase = new PurchaseHistory({
        user: user._id,
        product: product._id,
        quantity: item.quantity,
        total: item.total,
      });
      await purchase.save();

      user.totalSpent += item.total;
      await user.save();
    }

    res.send('Data fetched and stored');
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

// SQL-like report generation with MongoDB
app.get('/report', async (req, res) => {
  const report = await PurchaseHistory.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userDetails',
      },
    },
    { $unwind: '$userDetails' },
    {
      $lookup: {
        from: 'products',
        localField: 'product',
        foreignField: '_id',
        as: 'productDetails',
      },
    },
    { $unwind: '$productDetails' },
    {
      $group: {
        _id: '$user',
        totalSpent: { $sum: '$total' },
        userDetails: { $first: '$userDetails' },
        productDetails: { $first: '$productDetails' },
      },
    },
  ]);
  res.json(report);
});

app.listen(5001, () => {
  console.log('Server is running on port 5001');
});
