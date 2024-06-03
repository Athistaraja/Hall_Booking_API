import express from "express"
import { MongoClient } from "mongodb"


import * as dotenv from 'dotenv'
dotenv.config()

const app = express()
const PORT = 5000

app.use(express.json())

 

const MONGO_URL = process.env.MONGO_URL
// 'mongodb://127.0.0.1:27017'
//'mongodb://localhost:27017';

async function createConnection() {
    const client = new MongoClient(MONGO_URL);
    await client.connect()
    console.log("Mongodb is connected")
    return client
}

export const client = await createConnection()

app.get('/', (req, res) => {
    res.send('Welcome to Hall Booking API')
})

// -------------------------------------------------------------------------------------
//  Hall details
app.get("/hallDetails", async function (req, res) {
  const result = await client
    .db("B53WD")
    .collection("hallData")
    .find({})
    .toArray();
  res.send(result);
});
// -------------------------------------------------------------------------------------
// Creating new hall
app.post("/createHall", async function (req, res) {
  const data = req.body;
  const result = await client
    .db("B53WD")
    .collection("hallData")
    .insertMany(data);
  res.send(result);
});
// --------------------------------------------------------------------------------------
// Booking a room
app.put("/hallBooking/:id", async function (req, res) {
  const { id } = req.params;
  const data = req.body;
  const hall = await client
    .db("B53WD")
    .collection("hallData")
    .findOne({ _id: new ObjectId(id) })
  console.log(hall);
  if (hall.ifBooked === "true") {
    res.send({ message: "Hall already booked" });
  } else {
    const result = await client
      .db("B53WD")
      .collection("hallData")
      .updateOne({ _id: new ObjectId(id) }, { $set: data });
    res.send(result);
  }
});
// ---------------------------------------------------------------------------------------
// List all rooms with booked data
app.get("/bookedHalls", async function (req, res) {
  const result = await client
    .db("B53WD")
    .collection("hallData")
    .find({ ifBooked: "true" })
    .project({
      id: 1,
      roomId: 1,
      roomName: 1,
      customerName: 1,
      amenities: 1,
      noOfSeats: 1,
      price: 1,
      bookingStatus: 1,
    })
    .toArray();
  res.send(result);
});
// ---------------------------------------------------------------------------------------
// List all customers with booked data
app.get("/bookedCustomers", async function (req, res) {
  const result = await client
    .db("B53WD")
    .collection("hallData")
    .find({ ifBooked: "true" })
    .project({
      id: 1,
      customerName: 1,
      roomName: 1,
      date: 1,
      startTime: 1,
      endTime: 1,
    })
    .toArray();
  res.send(result);
});
// ---------------------------------------------------------------------------------------
// List how many times a customer has booked the room
app.get("/noOfTimes", async function (req, res) {
  const result = await client
    .db("B53WD")
    .collection("hallData")
    .aggregate([
      { $group: { _id: "$customerName", count: { $sum: 1 } } },
      { $match: { _id: { $ne: null }, count: { $gt: 1 } } },
    ])
    .toArray();
  console.log(result);
  const finalResult = await client
    .db("B53WD")
    .collection("hallData")
    .find({ customerName: result[0]._id })
    .project({
      id: 1,
      customerName: 1,
      roomName: 1,
      date: 1,
      startTime: 1,
      endTime: 1,
      bookingStatus: 1,
    })
    .toArray();
  res.send(finalResult);
});




app.listen(PORT, () => console.log(`Server started on the PORT, ${PORT}`))