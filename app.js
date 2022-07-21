// Import express
const express = require('express')
/* const PORT = 3000 */
const exphbs = require('express-handlebars')
const path = require('path')

const session = require('express-session')
const passport = require('passport')
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')

const app = express()
const Router = require('./routes/router') 
const User = require('./models/user')

// configure handlebars
app.engine('hbs', exphbs.engine({
    defaultlayout: 'main',
    extname: 'hbs',
    helpers: {
        overthreshold: function(val, upperlimit){
            if (upperlimit == null)
            return false
            return val > upperlimit
        },
        underthreshold: function(val, lowerlimit){
            return val < lowerlimit
        },

        isTrue: function(x){
            return x === true
        },
        findEngagement: function(active_days, total_days){
            return Math.round((active_days/total_days) * 100)
        },
        highEngagement: function(active_days, total_days) {
            var engagementRate = Math.round((active_days/total_days) * 100)
            if (engagementRate > 80) {
                return true
            } else {
                return false
            }
        },
        hasComment: function(comment1, comment2, comment3, comment4){
            return comment1 || comment2 || comment3 || comment4
        },
        // Limit results of handlebars #each helper
        // sourced from: https://stackoverflow.com/questions/10377700/limit-results-of-each-in-handlebars-js
        limit: function(arr, limit){
            if (!Array.isArray(arr)) { return []; }
            return arr.slice(0, limit);
        },

        ranking: function(arr, user){
            const index = arr.findIndex( (element) => element.screen_name === user.screen_name);
            return index + 1;
        },

        concat: function(first, second){
            return first + " " + second;
        }

    }
}))

// Middleware
app.use(express.static(path.join(__dirname, '/public'))) // serves the static files
app.set('view engine', 'hbs') // set Handlebars view engine
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
    console.log('message arrived: ' + req.method + ' ' + req.path)
    next()
})  // middleware to log a message each time a request arrives at the server - handy for debugging

// Middleware for login/auth
// Track authenticated users through login sessions
app.use(
    session({
        secret: process.env.SESSION_SECRET || "verygoodsecret",
        name: 'demo', // needs to be changed
        saveUninitialized: false,
        resave: false,
        cookie: {
            sameSite: 'strict',
            httpOnly: true,
            secure: app.get('env') === 'production'
        }
    })
)

if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // trust first proxy
}

app.use(passport.initialize());
app.use(passport.session());
app.use(Router)

// Serialise a user into the request
passport.serializeUser(function (user, done) {
    done(null, user._id); // allows us to get user information using req.user....
})

// If needed, deserialise a user by finding the user's ID and passing back the user
passport.deserializeUser(function (id, done) {
    // Run database query here to retrieve user information
    User.findById(id, { password: 0 }, (err, user) => {
        done(err, user);
    });
});

// Set Passport strategy (find user and try to log them in)
passport.use(new localStrategy(function (username, password, done) {
    User.findOne({ email : username }, function (err, user) {
        if (err) return done(err);

        // if user doesn't exist
        if (!user) {
            return done(null, false, { message : 'Incorrect username.'});
        } 

        // verify password
        bcrypt.compare(password, user.password, function (err, res) {
            if (err) return done(err)
            if (res === false) {
                return done(null, false, { message : 'Incorrect password.'})
            }

            return done(null, user)

        })
    })
}))

// Tells the app to listen on port
app.listen(process.env.PORT || 3000, () => {
    
    console.log(`Our app is listening!`)
    /* console.log(`Our app is listening on port ${PORT}`) */
})

require('./models/index')
