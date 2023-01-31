const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const port = 8881;

const database = require('./config/db/db_config')
const {ref, set, onValue, child, get } = require("firebase/database");


const io = new Server(server); // websocket instane on server


app.get('/', (req, res) => {
    res.send('<h1>LET\'S LOGIN</h1>');
    // res.sendFile(__dirname + '/index.html');
});

app.get('/app', (req, res) => {
    // res.send('Hello World 2');
    res.sendFile(__dirname + '/app.html');
});

io.on('connection', (socket) => {
    console.log('user connected');

    // get(tempRT).then((snapshot) => {
    //         if (snapshot.exists()) {
    //             io.emit('temp-1', snapshot.val().temp);
    //             // console.log(snapshot.val());
    //         } else {
    //             console.log("(get) No data available");
    //         }
    //     }).catch((error) => {
    //         console.error(error);
    //     })

    onValue(ref(database, 'temp/now'), (snapshot) => {
        const data = snapshot.val();
        if (data) {
            console.log(data.temp);
            io.emit('temp-1', data.temp);      
        } else {
            console.log("(onValue) No data available");
        }
    });

    onValue(ref(database, 'humi/now'), (snapshot) => {
        const data = snapshot.val();
        if (data) {
            console.log(data.humi);
            io.emit('humi-1', data.humi);      
        } else {
            console.log("(onValue) No data available");
        }
    });

    onValue(ref(database, '/state/light/device-1/now/'), (snapshot) => {
        const data = snapshot.val();
        if (data) {
            console.log(data.state);
            io.emit('light-1', data.state);      
        } else {
            console.log("(onValue) No data available");
        }
    });

    socket.on('button-1', data => {
        // console.log(data);
        // io.emit('state-1', data);
        set(ref(database, 'control/light/device-1'), {
            signal: data.message
          })
          .then(()=>{
            // res.status(200).send(JSON.stringify(req.body));
          })
          .catch((e)=>console.log(`(E): ${e}`))
    });




    
});

// setInterval(() => {
//     io.emit('temp-1', '25');
// },1000)

// const tempRT = ref(database, 'temp/now');

// onValue(tempRT, (snapshot) => {
//     const data = snapshot.val();
//     if (data) {
//         console.log(data.temp);
//         io.emit('temp-1', data.temp);      
//     } else {
//         console.log("(onValue) No data available");
//     }
// });

// const humiRT = ref(database, 'humi/now');

// onValue(humiRT, (snapshot) => {
//     const data = snapshot.val();
//     if (data) {
//         console.log(data.humi);
//         io.emit('humi-1', data.humi);      
//     } else {
//         console.log("(onValue) No data available");
//     }
// });

server.listen(port, () => {
    console.log(`App listening on port ${port}`);
});




