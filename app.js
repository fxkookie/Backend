const express = require('express');
const app = express();
const morgan = require('morgan')
const mysql = require('mysql')


app.get('/', (req, res) => {
    console.log('Request My Hello World');
    res.send('Hello World');
});
  
app.use(morgan('short'))
  
app.get('/user/:id',(req,res) => {
    console.log("Fectching user with id: " + req.params.id)

    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'tnk_mysql'
    })
    
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
            return {firstName: row.first_name,lastName: row.last_name}
        })
        res.json(rows)
    })

    //res.end()
})



app.get("/users", (req,res) => {
    var user1 = {firstName: "Stephen",lastName: "Curry"}
    var user2 = {firstName: "Kevin",lastName: "Durant"}
    res.json([user1, user2])
    //res.send("Nodemon auto updates when I save this filewow")
})
  
  
app.listen(3000, () => {
    console.log('My Node is listening on port 3000!');
});
  