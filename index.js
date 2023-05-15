const express = require('express')
const app = express()
const port = process.env.PORT || 4650;
var cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
app.use(cors())
app.use(express.json())


const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ioy1chb.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("emajohn");
    const movies = database.collection("products");

app.get('/product',async(req,res)=>{
    //for send data
    const { page, itemsPerPage } = req.query;
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(itemsPerPage);
  
    //for send data end
    console.log(req.query);
    const cursor =await movies.find().skip((parsedPage - 1) * parsedLimit).limit(parsedLimit).toArray();
    
res.send(cursor);
    console.log(cursor);
})
app.post('/productIds',async(req,res)=>{
    const productids = req.body;
    console.log(productids);
    const allids=productids.map(index=> new ObjectId(index));
    console.log(allids);
    const query={ _id: { $in:  allids } };
    const products =await movies.find(query).toArray()
    console.log(products);
    res.send(products);
})
app.get('/collectionCount',async(req, res) => {
    const count =await movies.estimatedDocumentCount();
    res.send({Collectioncount: count});
  });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})