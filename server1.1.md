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

// ##############################
app.get("/", (req, res) => {
  var html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8")
  res.status(200).send(html);
})



// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [hc->cloud]
app.post("/publish/esp32DHT11/temperature", (req, res) => {
  console.log(`Publish to esp32DHT11/temperature with Payload `);
//   companies[req.params.companyId].subscribers++
  console.log(req.body);
  
  set(push(ref(database, 'temp/')), {
    temp: esp32DHT11.temperature
  })
  esp32DHT11.temperature = req.body.temperature;
//   globalVersion++
//   res.status(200).json({"message":`subscribed to company ${req.params.companyId}`})
  set(ref(database, 'temp/now'), {
    temp: esp32DHT11.temperature
  })
  .then(()=>{
    res.status(200).send(JSON.stringify(req.body));
  })
  .catch((e)=>console.log(`(E): ${e}`))

  // globalVersion++;
  // e = 1;
}) 

// ~~~~~~~~~~~~~~~
app.post("/publish/esp32DHT11/humidity", (req, res) => {
  console.log(`Publish to esp32DHT11/humidity with Payload `);
//   companies[req.params.companyId].subscribers++
  console.log(req.body);
  
  set(push(ref(database, 'humi/')), {
    humi: esp32DHT11.humidity
  })
  esp32DHT11.humidity = req.body.humidity;
  set(ref(database, 'humi/now'), {
    humi: esp32DHT11.humidity
  })
  .then(()=>{
    res.status(200).send(JSON.stringify(req.body));
  })
  .catch((e)=>console.log(`(E): ${e}`))

  // globalVersion++;
  // e = 1;
}) 
  
app.post("/publish/state/light/device-1", (req, res) => {
  console.log(`Publish to state/light/device-1 with Payload `);
  console.log(req.body);
  
  // set(push(ref(database, 'state/light/device-1')), {
  //   sate: esp32DHT11.humidity
  // })
  // esp32DHT11.humidity = req.body.humidity;
  set(ref(database, 'state/light/device-1/now'), {
    state: req.body.state
  })
  .then(()=>{
    res.status(200).send(JSON.stringify(req.body));
  })
  .catch((e)=>console.log(`(E): ${e}`))

}) 
// ##############################
app.get("/sse", (req, res) => {
  // var localVersion = 0
  res.set("Content-Type", "text/event-stream")
  res.set("Connection", "keep-alive")
  res.set("Cache-Control", "no-cache")
  res.set("Access-Control-Allow-Origin", "*")
  console.log("client connected to sse")
  // setInterval(function(){
  //   // if(localVersion < globalVersion){
  //   if( e ){
  //     res.status(200).write(`data: ${JSON.stringify(esp32DHT11)}\n\n`);
  //     // localVersion = globalVersion
  //     e = 0;
  //   }
  // }, 100)

  onValue(ref(database, 'control/light/device-1'), (snapshot) => {
    const data = snapshot.val();
    console.log(data);
    if (data) {
        res.status(200).write(`data: ${JSON.stringify(data)}\n\n`);   
    } else {
        console.log("(onValue) No data available");
    }
  })
  // .then(()=>{
  //   // res.status(200).send(JSON.stringify(req.body));
  // })
  // .catch((e)=>console.log(`(E): ${e}`))
})
// ##############################
app.listen(PORT, err => {
  if(err){
    console.log("Server cannot listen..."); 
    return;
  }
  console.log(`Server listening at ${PORT}`);
})