const express = require("express")
const app = express()
const fs = require("fs")
const path = require("path")
// ~~~~~~~~~~~~~~~~~~~
const database = require('./config/db/db_config')
const {ref, set, onValue, child, get , push} = require("firebase/database");

const PORT = 8880;

app.use(express.static("public"))

app.use(express.json());
app.use(express.urlencoded({extended: true}));
var e = 0;
var esp32DHT11 = {
  "temperature":{"value":0},
  "humidity":{"value":0}
}

// xử lí khi có request POST tới
app.post("/publish/livingroom/sensordht11/temp", (req, res) => {
  console.log(`Publish to esp32DHT11/temperature with Payload `);
  console.log(req.body);
  
  set(push(ref(database, 'livingroom/sensordht11/temp/')), { // lưu giá trị cũ vào firabase (khác /now)
    temp: esp32DHT11.temperature
  })
  esp32DHT11.temperature = req.body.temperature;
  set(ref(database, 'livingroom/sensordht11/temp/now'), { // lưu giá trị mới vào firabase (tại /now)
    temp: esp32DHT11.temperature
  })
  .then(()=>{
    res.status(200).send(JSON.stringify(req.body));
  })
  .catch((e)=>console.log(`(E): ${e}`))

  // globalVersion++;
  // e = 1;
}) 

app.post("/publish/livingroom/sensordht11/humi", (req, res) => {
  console.log(`Publish to esp32DHT11/humidity with Payload `);
//   companies[req.params.companyId].subscribers++
  console.log(req.body);
  
  set(push(ref(database, 'livingroom/sensordht11/humi/')), {
    humi: esp32DHT11.humidity
  })
  esp32DHT11.humidity = req.body.humidity;
  set(ref(database, 'livingroom/sensordht11/humi/now'), {
    humi: esp32DHT11.humidity
  })
  .then(()=>{
    res.status(200).send(JSON.stringify(req.body));
  })
  .catch((e)=>console.log(`(E): ${e}`))

  // globalVersion++;
  // e = 1;
}) 
  
app.post("/publish/livingroom/lamp1", (req, res) => {
  console.log(`Publish to state/light/device-1 with Payload `);
  console.log(req.body);
  
  set(ref(database, 'livingroom/lamp1/now'), {
    state: req.body.state
  })
  .then(()=>{
    res.status(200).send(JSON.stringify(req.body));
  })
  .catch((e)=>console.log(`(E): ${e}`))

}) 

app.post("/publish/bedroom/lamp1", (req, res) => {
  console.log(`Publish to state/light/device-2 with Payload `);
  console.log(req.body);

  set(ref(database, 'bedroom/lamp1/now'), {
    state: req.body.state
  })
  .then(()=>{
    res.status(200).send(JSON.stringify(req.body));
  })
  .catch((e)=>console.log(`(E): ${e}`))

})

app.post("/publish/kitchen/lamp1", (req, res) => {
  console.log(`Publish to state/light/device-3 with Payload `);
  console.log(req.body);
  set(ref(database, 'kitchen/lamp1/now'), {
    state: req.body.state
  })
  .then(()=>{
    res.status(200).send(JSON.stringify(req.body));
  })
  .catch((e)=>console.log(`(E): ${e}`))

})

// Xử lí requset connect SSE
app.get("/sse", (req, res) => {
  res.set("Content-Type", "text/event-stream")
  res.set("Connection", "keep-alive")
  res.set("Cache-Control", "no-cache")
  res.set("Access-Control-Allow-Origin", "*")
  console.log("client connected to sse")

  // bắt sự thay đổi của tín hiệu điều khiển đèn 1 phòng khách trên firebase
  onValue(ref(database, 'control/livingroom/lamp1'), (snapshot) => {
    const data = snapshot.val();
    data.device = 1; // device lamp1 livingroom
    console.log(data);
    if (data) {
        res.status(200).write(`data: ${JSON.stringify(data)}\n\n`);   
    } else {
        console.log("(onValue) No data available");
    }
  })

  // bắt sự thay đổi của tín hiệu điều khiển đèn 1 phòng ngủ trên firebase
  onValue(ref(database, 'control/bedroom/lamp1'), (snapshot) => {
    const data = snapshot.val();
    data.device = 2;
    console.log(data);
    if (data) {
        res.status(200).write(`data: ${JSON.stringify(data)}\n\n`);   
    } else {
        console.log("(onValue) No data available");
    }
  })

  // bắt sự thay đổi của tín hiệu điều khiển đèn 1 phòng bếp trên firebase
  onValue(ref(database, 'control/kitchen/lamp1'), (snapshot) => {
    const data = snapshot.val();
    if (data.signal != 'rst') {
        data.device = 3;
        console.log(data);
        res.status(200).write(`data: ${JSON.stringify(data)}\n\n`);   
    } else {
        console.log("(onValue) No data available");
    }
  })
})

// khởi tao server lắng nghe cổng `PORT`
app.listen(PORT, err => {
  if(err){
    console.log("Server cannot listen..."); 
    return;
  }
  console.log(`Server listening at ${PORT}`);
})