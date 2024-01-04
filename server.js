// importing
import express from 'express';
import mongoose from 'mongoose';
import Messages from './dbMessages.js';
import Pusher from 'pusher';
import cors from 'cors';

// app config
const app = express()
const port = process.env.PORT || 9000

const pusher = new Pusher({
    appId: "1628286",
    key: "3195b91e526a2c890925",
    secret: "e34a96736dc84f719e17",
    cluster: "mt1",
    useTLS: true
  });


// middleware
app.use(express.json());
app.use(cors());



// db config
const connection_url = 'mongodb+srv://drastona:123456seven@cluster0.qbk1joo.mongodb.net/';

mongoose.connect(connection_url,{ 
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection
db.once('open', () => {
    console.log("DB connected");

    const msgCollection = db.collection('messagecontents');
    const changeStream = msgCollection.watch();
    
    changeStream.on('change', (change) => {
        console.log('A change occured', change);

        if (change.operationType === 'insert') {
            const messageDetails = change.fullDocument;
            pusher.trigger('messages','inserted',
                {
                    name:messageDetails.name,
                    message: messageDetails.message,
                    timestamp: messageDetails.timestamp,
                    received: messageDetails.received,
                }
            );
        } else {
            console.log('error triggering pusher')
        }


    });

});









// api routes
app.get('/',(req,res)=>res.status(200).send('hello world'))

app.get('/messages/sync', async (req, res) => {
    try {
      const data = await Messages.find();
      res.status(200).send(data);
    } catch (error) {
      res.status(500).send(error);
    }
  });


app.post('/messages/new', (req, res) => {
    const dbMessage = req.body;
    Messages.create(dbMessage)
      .then(createdMessage => {
        res.status(201).send(createdMessage);
      })
      .catch(error => {
        res.status(500).send(error);
      });
  });

// listen
app.listen(port,()=>console.log(`listening on localhost:${port}`))













// app.use((req, res, next) => {
//     res.setHeader('Acess-Controol-Allow-Origin','*');
//     res.setHeader('Acess-Controol-Allow-Headers','*');
//     next();
// })






// app.get('/messages/sync', (req, res) => {
//     Messages.find((err,data) => {
//         if (err) {
//             res.status(500).send(err)
//         } else {
//             res.status(200).send(data)
//         }
//     })
// })


// app.post('/api/v1/messages/new', (req,res) => {----normal convention
//     app.post('/messages/new', (req,res) => {
//     const dbMessage = req.body
//     Messages.create(dbMessage, (err,data) => {
//         if (err) {
//             res.status(500).send(err)
//         } else {
//             // res.status(201).send(`new message created: \n ${data}`)----normal convention
//             res.status(201).send(data)
//         }
//     })
// })







// mongoose.set('strictQuery', false);
// try {
//   await mongoose.connect(connection_url, { useNewUrlParser: true, useUnifiedTopology: true });
//   console.log('Successfully connected to the database');

//   const db = mongoose.connection;
//   db.once('open', () => {
//     console.log("DB connected");

//     const msgCollection = db.collection('messagecontent');
//     const changeStream = msgCollection.watch();
//     // Additional code related to change stream goes here
//   });
// } catch (error) {
//   console.error('Error connecting to the database:', error);
// }








// mongoose.set('strictQuery', false);---------my initial code
// try {
//   await mongoose.connect(connection_url, { useNewUrlParser: true, useUnifiedTopology: true });
//   console.log('Successfully connected to the database');
// } catch (error) {
//   console.error('Error connecting to the database:', error);
// }


// const db = mongoose.connection
// db.once('open', () => {
//     console.log("DB connected");

//     const msgCollection = db.collection('messagecontents');
//     const changeStream = msgCollection.watch();
    
//     changeStream.on('change', (change) => {
//         console.log('A change occured', change);
//     });

// });








// mongoose.set('strictQuery', false);-------working code 
// try {
//   await mongoose.connect(connection_url, { useNewUrlParser: true, useUnifiedTopology: true });
//   console.log('Successfully connected to the database');

//   const db = mongoose.connection;
//   db.on('open', () => {
//     console.log("DB connected");
//   });

//   const msgCollection = db.collection('messagecontents');
//   const changeStream = msgCollection.watch();

//   changeStream.on('change', (change) => {
//     console.log('A change occurred', change);
//   });
// } catch (error) {
//   console.error('Error connecting to the database:', error);
// }