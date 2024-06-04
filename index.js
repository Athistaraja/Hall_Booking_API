import express from 'express';
import dotenv from 'dotenv';


dotenv.config();
const PORT = 8000;
const app = express()
app.use(express.json())



let rooms = [{
 "name": "Classroom",
 "seats": "50", 
 "amenities": "air conditioning, 10 tables, 40 chairs, whiteboard, projector",
 "pricefor1hr": "$300",
 "roomID": "1",
 "bookedData": [{
  "customerName": "Athistaraja", 
  "date": "26/06/2023",
  "startTime": "09:30", 
  "endTime": "10:30", 
  "bookingID": "1",
  "bookingdate":"20/06/2023",
  "bookingStatus":"booked"
 }]
},
 {
  "name": "Function Hall", 
  "seats": "200", 
  "amenities": "stage,air conditioning,10 round tables, 150 chairs", 
  "pricefor1hr": "$1000",
  "roomID": "2",
  "bookedData": [{
   "customerName": "jeyaram", 
   "date": "25/06/2023",
   "startTime": "11:30", 
   "endTime": "14:30", 
   "roomID": "2",
   "bookingID": "1",
   "bookingdate":"20/06/2023",
   "bookingStatus":"completed",
  }]
 }, {
  "name": "Movie Theater", 
  "seats": "100", 
  "amenities": "big screen, air conditioning, popcorn, projecter, premium seats",
  "pricefor1hr": "$500",
   "roomID": "3",
  "bookedData": [{
   "customerName": "Raja",
   "date": "24/06/2023",
   "startTime": "19:30", 
   "endTime": "22:30", 
   "roomID": "3",
   "bookingID": "1",
   "bookingdate":"02/06/2023",
   "bookingStatus":"booked",
  }]
}, {
    "name": "conference hall", 
    "seats": "100", 
    "amenities": " air conditioning, projecter, Round Table",
    "pricefor1hr": "$500",
     "roomID": "4",
    "bookedData": [{
     "customerName": "Lucky",
     "date": "24/06/2024",
     "startTime": "19:30", 
     "endTime": "22:30", 
     "roomID": "4",
     "bookingID": "1",
     "bookingdate":"02/06/2024",
     "bookingStatus":"booked",
    }]
},
    {
    "name": "conference hall", 
    "seats": "100", 
    "amenities": " air conditioning, projecter, Round Table",
    "pricefor1hr": "$500",
     "roomID": "4",
    "bookedData": [{
     "customerName": "Lucky",
     "date": "24/06/2024",
     "startTime": "19:30", 
     "endTime": "22:30", 
     "roomID": "4",
     "bookingID": "1",
     "bookingdate":"02/06/2024",
     "bookingStatus":"booked",
    }]
 }]

 app.get("/", (req , res)=> {
  res.status(400).send("welcome to Hall Booking API")
 })


// 1 Creating a room with 'number of seats','amenities in room', 'Price for 1 hr'
app.post("/makeroom", (req, res) => {

    const newroom = {
        name: req.body.name, 
        seats: req.body.seats, 
        amenities: req.body.amenities, 
        price: req.body.price, 
        roomID: req.body.roomID,
        bookedData:[]
    }
rooms = [...rooms, newroom]
res.send({message:"Room has been created",created:true})

})


// 2 Booking a room with ...
app.post("/bookroom",(req, res)=> {

    let bookedData = {
        customerName: req.body.customerName, 
        date: req.body.date, 
        startTime: req.body.startTime, 
        endTime: req.body.endTime, 
        roomID: req.body.roomID,
        bookingdata:req.body.bookingdate,
        bookingStatus:req.body.bookingStatus,
    }

 for (let i = 0; i < rooms.length;i++) {
     if (rooms[i].roomID === bookedData.roomID) {
        bookedData.bookingID = rooms[i].bookedData.length + 1;
        rooms[i].bookedData.push(bookedData)
        return res.send({ message: "Booking has been confirmed", booked:true})
        }
    }
 })

//3 List all rooms with booked data with ...    
app.get("/roomswithBookedData",(req,res)=>{
let bookedrooms = []
rooms.map((room)=>{
    if(room.bookedData.length !== 0){
        bookedrooms.push(room)
    }
})

res.send(bookedrooms)
})


// 4 List all customers with booked data(room name included)
app.get("/customerswithBookedData", (req, res) => {

 let customers = []
 
 rooms.map((room) => {
  if(room.bookedData.length != 0){
    room.bookedData.map((data)=>{
        let customer = {
            customerName:data.customerName,
            roomName: room.name,
            date: data.date,
            startTime: data.startTime,
            endTime: data.endTime,
            }
        customers.push(customer)
    })
  }
 })
res.send(customers)
})


// 5 List how many times a specifc customer has booked a specific room with details ...

app.get("/customerHowmanytimes", (req, res) => {

    const customerName = req.body.customerName
    const roomName = req.body.roomName

    let details = []
    
    rooms.map((room) => {
     if(room.name == roomName){
        room.bookedData.map((data)=>{
            if(data.customerName == customerName){
                let customer = {
                    customerName:customerName,
                    roomName: roomName,
                    date: data.date,
                    startTime: data.startTime,
                    endTime: data.endTime,
                    bookingID: data.bookingID,
                    bookingdata: data.bookingdate,
                    bookingStatus: data.bookingStatus,
                    }
                customers.push(customer)
            }
        })
     }
    })
   res.send(customers)
   })
   


app.listen(PORT,()=>{
    console.log(`Server is running ${PORT}`)})
