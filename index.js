const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const uri = "mongodb+srv://organicUser:a012345678@cluster0.mkcgo.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.get('/', (req, res) => {
    // res.send('I am working');
    res.sendFile(__dirname + '/index.html');
})

client.connect(err => {
  const collection = client.db("organicdb").collection("products");
  // perform actions on the collection object
  
   //create data
   app.post("/addProduct", (req, res) => {
    const product = req.body;
    // console.log(product);
    collection.insertOne(product)
    .then(result => {
      console.log('Data added successfully');
      // res.send('Success')
      res.redirect('/')
    })
  })

  //read data
  app.get('/products', (req, res) => {
    collection.find({}).limit(7)
    .toArray ( (err, documents) => {
      res.send(documents);
    })
  })

  //delete data
  app.delete('/delete/:id', (req, res) => {
    console.log(req.params.id);
    collection.deleteOne({_id: ObjectId(req.params.id)})
    .then( result => {
        // console.log(result);
        res.send(result.deletedCount > 0);
    })
  })

  //Load single data
  app.get('/product/:id', (req, res) => {
    collection.find({_id: ObjectId(req.params.id)})
    .toArray( (err, documents) => {
      res.send(documents[0]);
    })
  })

  //update data
  app.patch('/update/:id', (req, res) => {
    collection.updateOne({_id: ObjectId(req.params.id)}, 
      {
        $set: {price: req.body.price, quantity: req.body.quantity}
      }
    )
    .then(result => {
      // console.log(result);
      res.send(result.modifiedCount > 0);
    })

  })
  



   // const product = {name: "Honey", price: 25, quantity: 20};
  // collection.insertOne(product)
  // .then(result => {
  //   console.log('One product added');
  // })
  // console.log('database connected');
  // client.close();
});

app.listen(3001);