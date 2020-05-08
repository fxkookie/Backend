const express = require('express');
const app = express();
const { timer } = require('./service');
const { APP, HTTP} = require('./constants');
const { response } = require('./generator');
const HttpStatus = require('http-status-codes');
const { nanoid } = require('nanoid');
const mysql = require('mysql')

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const morgan = require('morgan')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');

app.use(bodyParser.urlencoded({extended: false}))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(morgan('short'))

app.get('/', (req, res) => {
  console.log('Request My Hello World');
  res.send('Hello World');
});

const connection = getConnection();

function getConnection(){
  return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'tnk_mysql'
  })
}
//////
app.get('/user/:id',(req,res) => {
  console.log("Fectching user with id: " + req.params.id)

  const userId = req.params.id
  const queryString = "SELECT * FROM users WHERE id = ?"
  connection.query(queryString,[userId], (err,rows,fields) => {
      if(err){
          console.log("Faild to query for users: " + err)
          res.sendStatus(500)
          return
      }
      console.log("I thing we fetched users succesfully")
      const users = rows.map((row) =>{
          return {user: row.username,lastName: row.password}
      })
      res.status(HttpStatus.OK).json(rows)
  })

})

app.get('/user',(req,res) => {
  console.log("Fectching all user ")
  const queryString = "SELECT * FROM users"
  connection.query(queryString, (err,rows,fields) => {
      if(err){
          console.log("Faild to query for users: " + err)
          res.sendStatus(500)
          return
      }
      console.log("I think we fetched users succesfully")
      const users = rows.map((row) =>{
          return {user: row.username,password: row.password}
      })
      res.status(HttpStatus.OK).json(rows)
  })

})

app.post('/users',async function(req,res){
  const reqId = req.header(HTTP.HEADER.X_REQUEST_ID) || nanoid();
  var name = req.body.username;
  var password = req.body.password;
  const sleeptime = Math.round(Math.random() *1000);
  console.log(`Start: `,{
    reqId,
    sleeptime
  });
  await timer.sleep(sleeptime);
  console.log(`End: `,{
    reqId,
    sleeptime,
  });
  console.log("username: " + req.body.cusername)
  const queryString = "INSERT INTO users (username, password) VALUES (?,?)"
  getConnection().query(queryString,[username,password],(err,results,fields) =>{
    if(err){
      console.log("Failed to insert new user: " + err)
      res.sendStatus(500)
      return
    }
    console.log("Inserted a new user with id: ",results.insertId);
    const SECRET = "tnk'token";
    const token = jwt.sign({ _id: id.toString()},SECRET,{expiresIn: '1 day'})
    var resmsg = {
      "username":name,
      "status": "Created",
      "reqid": reqId,
      "token": token
    }
    res.status(HttpStatus.CREATED).send(resmsg);
  })

});

app.listen(APP.PORT, () => {
  console.log(`My Node is listening on port ${APP.PORT}!`);
});
