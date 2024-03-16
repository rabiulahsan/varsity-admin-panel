const express = require("express");
const app = express();
const cors = require("cors");
// const jwt = require('jsonwebtoken');
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

//database api
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9ylecqg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //database collection
    const studentsCollection = client
      .db("varsity-admin")
      .collection("students");
    const adminsCollection = client.db("varsity-admin").collection("admins");
    const departmentsCollection = client
      .db("varsity-admin")
      .collection("departments");

    //get all students
    app.get("/students", async (req, res) => {
      const result = await studentsCollection.find().toArray();
      res.send(result);
    });

    // get a student
    app.get("/students/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await studentsCollection.findOne(query);
      res.send(result);
    });

    //post  a student
    app.post("/students", async (req, res) => {
      const newStudent = req.body;
      const result = await studentsCollection.insertOne(newStudent);
      res.send(result);
    });

    // delete a student
    app.delete("/students/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await studentsCollection.deleteOne(query);
      res.send(result);
    });

    //get all admins
    app.get("/admins", async (req, res) => {
      const result = await adminsCollection.find().toArray();
      res.send(result);
    });

    // post a admin
    app.post("/admins", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const exist = await adminsCollection.findOne(query);

      if (exist) {
        return res.send({ message: "admin already exists" });
      }

      const result = await adminsCollection.insertOne(user);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//test
app.get("/", (req, res) => {
  res.send("Running");
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
