const express = require("express")
const app = express()
const fs = require("fs")
const path = require("path")
// ~~~~~~~~~~~~~~~~~~~
const PORT = 8880;
// ##############################
app.use(express.static("public"))
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
app.use(express.json());
// ##############################
var globalVersion = 0
var companies = {
  "aaa":{"subscribers":0},
  "w3certified":{"subscribers":0},
  "bbb":{"subscribers":0},
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var esp32DHT11 = {
  "temperature":{"value":0},
  "humidity":{"value":0},
}

// ##############################
app.get("/", (req, res) => {
  var html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8")
  res.status(200).send(html)
})
// ##############################
app.get("/subscribe/:companyId", (req, res) => {
  console.log(`Subscribed to: ${req.params.companyId}`)
  companies[req.params.companyId].subscribers++
  console.log(companies)
  globalVersion++
  res.status(200).json({"message":`subscribed to company ${req.params.companyId}`})
})
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [hc->cloud]
// app.get("/publish/:deviceId", (req, res) => {
app.post("/publish/esp32DHT11", (req, res) => {
  console.log(`Publish from esp32DHT11 with Payload `);
//   companies[req.params.companyId].subscribers++
  console.log(req.body);
//   globalVersion++
//   res.status(200).json({"message":`subscribed to company ${req.params.companyId}`})
  res.status(200).send(JSON.stringify(req.body));
  globalVersion++;
  
}) 
  
// ##############################
app.get("/sse", (req, res) => {
  var localVersion = 0
  res.set("Content-Type", "text/event-stream")
  res.set("Connection", "keep-alive")
  res.set("Cache-Control", "no-cache")
  res.set("Access-Control-Allow-Origin", "*")
  console.log("client connected to sse")
  setInterval(function(){
    if(localVersion < globalVersion){
      res.status(200).write(`data: ${JSON.stringify(companies)}\n\n`)
      localVersion = globalVersion
    }
  }, 100)
})
// ##############################
app.listen(PORT, err => {
  if(err){console.log("Server cannot listen..."); return}
  console.log("Server listening...")
})