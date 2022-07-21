const express = require('express')
const passport = require('passport')
const bcrypt = require('bcrypt') // only for manually setting password - delete before final submission
const User = require('../models/user') // only for manually setting password - delete before final submission

// create our Router object
const Router = express.Router()

// import controller functions
const controller = require('../controllers/controller')
const controllerPatient = require('../controllers/controllerPatient')
const controllerDoctor = require('../controllers/controllerDoctor')

/* GENERAL ROUTES ------------------*/

Router.get('/login', controller.login)
Router.get('/about_website', controller.aboutWebsite)
Router.get('/about_diabetes', controller.aboutDiabetes)
Router.get('/', controller.index)
Router.get('/index', (req, res) => {
    res.redirect('/')
})

// Authentication middleware

const isAuthenticatedDoctor = (req, res, next) => {
    // If user is not authenticated via Passport, redirect to login page
    if (!req.isAuthenticated()) {

        return res.redirect('/login?unauthenticated=true')

    } else { // If authenticated
        
        if (req.user.toJSON().role === 'doctor') {

            // proceed to next middleware function
            return next()

        } else if (req.user.toJSON().role === 'patient') {
            res.redirect('/patient_home?restricted_action=true');
        }
    }
}

const isAuthenticatedPatient = (req, res, next) => {
    // If user is not authenticated via Passport, redirect to login page
    if (!req.isAuthenticated()) {

        return res.redirect('/login?unauthenticated=true')

    } else { // If authenticated
        
        if (req.user.toJSON().role === 'patient') {

            // proceed to next middleware function
            return next()

        } else if (req.user.toJSON().role === 'doctor') {
            res.redirect('/dr_home?restricted_action=true');
        }
    }

}

// Passport - user auth
Router.post('/login', passport.authenticate('local', {
    // successRedirect: '/patient_home',

    failureRedirect: '/login?error=true'}),
    function (req, res) {
        
        if (req.user.toJSON().role === 'patient') {
            res.redirect('/patient_home')
        } else if (req.user.toJSON().role === 'doctor') {
            res.redirect('/dr_home');
        }
})

Router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

/* PATIENT ROUTES ------------------*/

Router.get('/patient_home', isAuthenticatedPatient, controllerPatient.patientHome)
Router.post('/patient_home', controllerPatient.processPatientData)
Router.get('/patient_home/historical_data', isAuthenticatedPatient, controllerPatient.viewPastData)
Router.get('/patient_home/preferences', isAuthenticatedPatient, controllerPatient.preferences)
Router.get('/patient_home/preferences/change_password', isAuthenticatedPatient, controllerPatient.passwordPage)
Router.post('/patient_home/preferences/change_password', controllerPatient.change_password)
Router.get('/patient_home/preferences/change_password/success', isAuthenticatedPatient, controllerPatient.change_password_success)
Router.get('/patient_home/about_diabetes', isAuthenticatedPatient, controllerPatient.patientAboutdiabetes)
Router.get('/patient_home/about_websites', isAuthenticatedPatient, controllerPatient.patientAboutthispage)
Router.get('/patient_home/leaderboard', isAuthenticatedPatient, controllerPatient.leaderboard)
Router.get('/patient_home/historical_data/visualisations', isAuthenticatedPatient, controllerPatient.getVisualisation)

/* DOCTOR ROUTES ------------------*/

Router.get('/dr_home', isAuthenticatedDoctor, controllerDoctor.doctorHome)
Router.get('/dr_individual_patients/:id', isAuthenticatedDoctor, (req, res) => controllerDoctor.individualPatientData(req, res))
Router.post('/dr_individual_patient_message/:id', (req, res) => controllerDoctor.sendMessage(req, res))
Router.post('/dr_individual_patient_note/:id', (req, res) => controllerDoctor.addPatientNote(req,res))
Router.get('/dr_patient_comments', isAuthenticatedDoctor, controllerDoctor.doctorPatientComments)
Router.get('/dr_home/register_patient', isAuthenticatedDoctor, controllerDoctor.registerPatientPage)
Router.post('/dr_home/register_patient', controllerDoctor.registerNewPatient)
Router.get('/dr_home/register_patient/register_success', isAuthenticatedDoctor, controllerDoctor.registerSuccessPage)
Router.get('/dr_home/dr_preferences', isAuthenticatedDoctor, controllerDoctor.doctorPreferences)
Router.get('/dr_home/preferences/change_password', isAuthenticatedDoctor, controllerDoctor.doctorPasswordpage)
Router.post('/dr_home/preferences/change_password', controllerDoctor.change_password)
Router.get('/dr_home/about_diabetes', isAuthenticatedDoctor, controllerDoctor.doctorAboutdiabetes)
Router.get('/dr_home/about_websites', isAuthenticatedDoctor, controllerDoctor.doctorAboutthispage)
Router.get('/dr_individual_patients/:id/visualisations', isAuthenticatedDoctor, controllerDoctor.getVisualisation)
Router.get('/edit_thresholds/:id', isAuthenticatedDoctor, (req, res) => controllerDoctor.editThresholds(req, res))
Router.get('/dr_home/preferences/change_password/success', isAuthenticatedDoctor, controllerDoctor.doctorPasswordsuccess)
Router.post('/edit_individual_threshold/:id/:field', (req, res) => controllerDoctor.editIndividualThreshold(req,res))


// export the router
module.exports = Router
