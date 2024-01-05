const express = require('express');
const axios = require('axios');
const mongodb = require('mongodb');
const dotenv = require("dotenv");
dotenv.config();


const router = express.Router();

//Get Products from local store DB
router.get('/',  async (req,res) => {
    const products = await loadProductsCollection();
    res.send(await products.find({}).toArray());
});


//Fetch products from Warehouse DB and insert them into local DB

router.post('/', async (req,res) => {
    try {
        const productData = await axios.get(process.env.WAREHOUSE_API);
        const products = await loadProductsCollection();
    try {
        await products.insertMany(productData['data']);
        res.status(201).json({ message: 'Products added successfully!' });
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } catch (error) {
        res.status(500).json({message: "Something went wrong. Could not get productData from Warehouse."})
    }
    
});

//Get individual product qty and update in local DB
router.post('/:id', async(req,res) => {
    try {
        const productData = await axios.get(process.env.WAREHOUSE_API+'/'+req.params.id);
        const products = await loadProductsCollection();
        try {
           const updateResult = await products.updateOne(
                {_id: productData['data']['_id']},
                {$set: {'qty' : productData['data']['qty']}}
            );
            res.status(201).json({message: 'Product qty updated successfully'});
        } catch (error) {
            res.status(500).json({error: 'Internal Server Error'})
        }
    } catch (error) {
        res.status(500).json({message: "Something went wrong. Could not get productData from Warehouse."})
    }
});

//Delete all products from local database

router.delete('/', async (req,res) => {
    const products = await loadProductsCollection();
    try{
       await products.deleteMany({})
        res.status(200).json({message: 'All products have been deleted!'}); 
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'})
    }
    
})

async function loadProductsCollection() {
    const client = await mongodb.MongoClient.connect(process.env.MONGODB_URI);
    return client.db('Store').collection('Products');
}

module.exports = router;