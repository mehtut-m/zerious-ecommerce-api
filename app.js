// import to use .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

const authRoute = require('./routes/authRoutes');
const userRoute = require('./routes/userRoutes');
const brandRoute = require('./routes/brandRoutes');
const categoryRoute = require('./routes/categoryRoutes');
const subCategoryRoute = require('./routes/subCategoryRoutes');
const productRoute = require('./routes/productRoutes');
const orderRoute = require('./routes/orderRoutes');
const checkOutRoute = require('./routes/checkOutRoutes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('static', express.static('public/'));

app.use('/auth/', authRoute);
app.use('/user/', userRoute);

app.use('/brand/', brandRoute);
app.use('/category/', categoryRoute);
app.use('/sub-category/', subCategoryRoute);
app.use('/product/', productRoute);
app.use('/order/', orderRoute);
app.use('/checkout', checkOutRoute);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(process.env.PORT || 5000, () =>
  console.log(`server is runnig on port ${process.env.PORT || 5000}`)
);
