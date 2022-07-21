const { serializeUser } = require('passport')
const User = require('../models/user')
const HealthStat = require('../models/health_stats')
const bcrypt = require('bcrypt')

// return all patients' data
const getAllData = async (req, res, next) => {
    try {
        // finding data from database
        const patients = await User.find().lean()
        return res.render('dr_home', { layout: 'dr_main', patients: patients, title: "Doctor Home" })
    } catch (err) {
        return next(err)
    }
}

// add an object to the database
const insertData = (req, res) => {
    try {
        // Writing to database
        run()
        async function run() {
            try {
                const patient = await User.create({
                    first_name: 'Shervyn',
                    last_name: 'Zahin',
                    email: 'sh@hotmail.com',
                })

                console.log(patient)
            } catch (e) {
                console.log(e.message)
            }
        }

    } catch (err) {
        console.log(e.message)
    }
}

const index = async (req, res) => {
    res.render('index.hbs', {title: "A diabetes monitoring solution"})
}

const login = async (req, res) => {
    const response = {
        title: 'Login',
        error: req.query.error,
        unauthenticated: req.query.unauthenticated
    }
    res.render('login.hbs', response)
}

const aboutWebsite = async (req, res) => {
    res.render('about_website.hbs', {title: "About Diabetes@Home"})
}

const aboutDiabetes = async (req, res) => {
    res.render('about_diabetes.hbs', {title: "About Diabetes"})
}

const setup = async (req, res) => {

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        const email = "hjackman@gmail.com";
        const password = "hjackman";
        const first_name = "Hugh";
        const last_name = "Jackman";

        bcrypt.hash(password, salt, function (err, hash) {
            if (err) return next(err);
            const newDoctor = new User ({
                first_name: first_name,
                last_name: last_name,
                email: email,
                role: "doctor",
                password: hash
            });

            newDoctor.save();

            res.redirect('/login')
        });
    });
}

// exports an object, which contains a function named getAllData
module.exports = {
    getAllData,
    index,
    login,
    aboutWebsite,
    aboutDiabetes,
    insertData,
    setup
}