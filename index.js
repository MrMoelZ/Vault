const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const pg = require('pg');
const conString = 'postgres://postgres:admin@localhost/VaultDB'

const db = require('./db.js')

const app = express()
const port = 3000

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts')
}))

app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))

app.use((err, request, response, next) => {
    console.log(err)
    next()
})

app.get('/users', function(req, res, next) {
    pg.connect(conString, function(err, client, done) {
        if(err) {
            return next(err);
        }
        client.query('SELECT * FROM users;', [], function(err, result) {
            if(err) return next(err);

            res.json(result.rows);
        })
    })
})

app.get('/postuser', function (req, res, next) {
    //const user = req.body
    const user = {name: "HolZ", email: "mrmoerlin@gmail.com"}
    console.log(pg);
    pg.connect(conString, function (err, client, done) {
        if (err) {
            // pass the error to the express error handler
            return next(err)
        }
        client.query('INSERT INTO users (name, email) VALUES ($1, $2);', [user.name, user.email], function (err, result) {
            done() //this done callback signals the pg driver that the connection can be closed or returned to the connection pool
  
            if (err) {
            // pass the error to the express error handler
                return next(err)
            }
            res.send(200)
        })
    })
})

app.get('/', (request, response) => {
    db.test();
    response.render('home', {
        name: 'Marlun'
    })
})

app.listen(port, ()=> {
      console.log(`server is listening on ${port}`)
})