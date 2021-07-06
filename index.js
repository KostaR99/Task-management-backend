const express = require('express')
const app = express();

var cors = require('cors')
app.use(cors()) 

app.use(express.json());
app.get('/', (req, res) => res.send('Hello World!'));

app.use('/user',require('./user'))
app.use('/task',require('./task'))

app.listen(3000, () => console.log('App Server listening on port 3000!'));