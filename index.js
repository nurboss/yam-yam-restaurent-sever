const { MongoClient } = require('mongodb');
const express = require('express');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mgtwv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.get('/', (req, res) => {
    res.send('This is Server for SCIC Group Assinment.')
})

async function run() {
    try {
        await client.connect();
        console.log('database connected');
        const database = client.db("Services");
        const servicesCollection = database.collection("Service");

        //Load API 
        app.get('/services', async (req, res) => {
            const result = await servicesCollection.find({}).toArray();
            res.send(result);
        })

        //Load Single API 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await servicesCollection.findOne(query);
            res.send(result);
        })

        // add order
        app.post('/order', async (req, res) => {
            const orders = req.body;
            const result = await orderCollection.insertOne(orders);
            res.send(result);
        })

        // get my orders
        app.get('/myorder/:email', async (req, res) => {
            const email = req.params.email;
            const result = await orderCollection.find({ email: email }).toArray();
            res.send(result);
        })

        // delete order
        app.delete('/deleteOrde/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query);
            res.send(result);
        })


    }
    finally {
        // await client.close();
    }

} run().catch(console.dir);


app.listen(port, () => {
    console.log('Running the Server on Port', port);
})