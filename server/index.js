const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const products = require('./routes/api/products');

app.use('/api/products',products);

if(process.env.NODE_ENV === 'production') {
  const publicPath = path.join(__dirname, '../public');
   app.use(express.static(publicPath));
  
   app.get(/.*/, (req,res) => {
     const indexPath = path.join(publicPath, 'index.html')
     res.sendFile(indexPath)
   });
}

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server running on ${port}`));