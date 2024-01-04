 const express = require('express');
 const bodyParser = require('body-parser');
 const cors = require('cors');

 const app = express();

 app.use(bodyParser.json());
 app.use(cors());

 const products = require('./routes/api/products');

 app.use('/api/products',products);
 const port = process.env.PORT || 5001;

 app.listen(port, () => console.log(`Server running on ${port}`));