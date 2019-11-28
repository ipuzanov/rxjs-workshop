const path = require('path');
const express = require('express');

const data = require('./data');

const app = express();


app.get('/api/search', (req, res) => {
  const { search } = req.query;
  console.log(search);
  if (!search) {
    res.json([]);
  } else {
    setTimeout(() => {
      res.json(data.filter(di => new RegExp(search, 'gi').test(di)));
    }, Math.ceil(Math.random() * 2000));
  }
});

app.use('/', express.static(path.join(__dirname)));

app.listen(3000, () => { console.log('Running on http://localhost:3000') });
