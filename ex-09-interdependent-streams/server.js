const path = require('path');
const express = require('express');

const data = require('./products');

const app = express();

const checkName = (item, name) => new RegExp(name, 'gi').test(item.name);

const testProduct = ({ name, inStock, category }, item) =>
  checkName(item, name) &&
  (inStock ? item.inStock : true) &&
  item.category.some(c => c === category);

app.get('/api/search', (req, res) => {
  const { name, inStock: inStockRaw, category, page: pageRaw, size: pageSizeRaw } = req.query;
  const page = +pageRaw;
  const pageSize = +pageSizeRaw;

  const inStock = inStockRaw && inStockRaw === '1' ? true : false;
  const products = data.filter(testProduct.bind(null, { name, inStock, category }));

  res.json({
    data: products.slice((page - 1) * pageSize, page * pageSize),
    count: products.length,
  });
});

app.use('/', express.static(path.join(__dirname)));

app.listen(3000, () => {
  console.log('Running on http://localhost:3000');
});
