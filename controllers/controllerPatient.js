const User = require('../models/user')
const HealthStat = require('../models/health_stats')
const bcrypt = require('bcrypt')


// Returning patient's homepage for GET request
const patientHome = async (req, res) => {


    const id = req.user.toJSON()._id
    const thisPatient = await User.findOne({ _id:id}).lean()

    await pushDataHealthStat(req,res)

    // Render the updated page 
    renderPatientHome(res, id, req)
}

const pushDataHealthStat = async (req, res) => {

    const id = req.user.toJSON()._id
    // Check condition to add data to health_stats here
    const thisPatient = await User.findOne({ _id:id}).lean()
    console.log(thisPatient)
    const requirement = req.user.toJSON().requirement
    let represent = 0

    // Get representative required field
    for (const item in requirement){
        if ((requirement[item] == true) && (thisPatient[item]) && (thisPatient[item].submitted == true)  && (thisPatient[item].submit_time != null)) {
            represent = item
            // break
        }
    }

    if (represent === 0){
        console.log("all required data hasn't been entered")
        return -1
    }

    
    const now   = new Date(Date.now())
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const submitTime = thisPatient[represent].submit_time
    console.log(submitTime)
    const submitDay = new Date(submitTime.getFullYear(), submitTime.getMonth(), submitTime.getDate())

    console.log("Today is: %s", today)
    console.log("Date of submission is: %s", submitDay)

    if (today.getTime() > submitDay.getTime()){
        console.log("adding to health stat!")

        const histData = new HealthStat({
            patientId: id,
            date: submitTime, // representative measurement

            blood_glucose:{
                metric: thisPatient.blood_glucose.metric,
                comment: thisPatient.blood_glucose.comment,
                submit_time: thisPatient.blood_glucose.submit_time,
                submitted: thisPatient.blood_glucose.submitted,
            },

            weight:{
                metric: thisPatient.weight.metric,
                comment: thisPatient.weight.comment,
                submit_time: thisPatient.weight.submit_time,
                submitted: thisPatient.weight.submitted,
            },

            insulin_dosage:{
                metric: thisPatient.insulin_dosage.metric,
                comment: thisPatient.insulin_dosage.comment,
                submit_time: thisPatient.insulin_dosage.submit_time,
                submitted: thisPatient.insulin_dosage.submitted,
            },

            step_count:{
                metric: thisPatient.step_count.metric,
                comment: thisPatient.step_count.comment,
                submit_time: thisPatient.step_count.submit_time,
                submitted: thisPatient.step_count.submitted,
            },

        })

        histData.save()
        console.log("data added to record for patient %s", id)
        // NEED TO RESET THE DATA ENTRY
        await resetDataSubmitStatus(id)
    }
    else{
        console.log("New date has not arrived to add data to health stat")
    }
    // Take one representative required measurement and compare the date with today (only takes the day)
}

// Returning patient's homepage for POST request
const processPatientData = async (req, res) => {

    // staticly point to Pat
    // const id = '626126a9c29c2c238e788df8'

    const id = req.user.toJSON()._id
    const metric = Object.keys(req.body)[0]

    // Check what field is the patient submitting and push that to database
    switch (metric) {
        case 'blood_glucose_metric':
            console.log(metric)
            if (req.body.blood_glucose_metric !== undefined) {
                writeOptions = {
                    $set : {
                        blood_glucose: {
                            metric: req.body.blood_glucose_metric,
                            comment: req.body.blood_glucose_cmt.trim(),
                            submit_time: Date.now(),
                            submitted: true 
                        }
                    }
                }
                await updateDataById("blood_glucose", writeOptions, id)
                break
            }

        case 'insulin_dosage_metric':
            console.log(metric)
            if (req.body.insulin_dosage_metric !== undefined) {
                writeOptions = {
                    $set: {
                        insulin_dosage: {
                            metric: req.body.insulin_dosage_metric,
                            comment: req.body.insulin_dosage_cmt.trim(),
                            submit_time: Date.now(),
                            submitted: true 
                        }
                    }
                }
                await updateDataById("insulin_dosage", writeOptions, id)
                break
            }

        case 'step_count_metric':
            console.log(metric)
            if (req.body.step_count_metric !== undefined) {
                writeOptions = {
                    $set: {
                        step_count: {
                            metric: req.body.step_count_metric,
                            comment: req.body.step_count_cmt.trim(),
                            submit_time: Date.now(),
                            submitted: true 
                        }
                    }
                }
                await updateDataById("step_count", writeOptions, id)
                break
            }

        case 'weight_metric':
            console.log(metric)
            if (req.body.weight_metric !== undefined) {
                writeOptions = {
                    $set: {
                        weight: {
                            metric: req.body.weight_metric,
                            comment: req.body.weight_cmt.trim(),
                            submit_time: Date.now(),
                            submitted: true 
                        }
                    }
                }
                await updateDataById("weight", writeOptions, id)
                break
            }
    }

    // Render the updated page 
    renderPatientHome(res, id, req)
}

// Function below is used to render patient's data entry page, it will submission status for each required field
const renderPatientHome = async(res, id, req) => {
    const dataSubmitted = await retrieveDataByPatientId(id)
    const thisPatient = await User.findOne({_id:id}).lean()

    let all_data_submitted = false // used to check submit status for all data and render corresponding message
    if ((dataSubmitted[0].submitted || !thisPatient.requirement.blood_glucose) && (dataSubmitted[1].submitted || !thisPatient.requirement.insulin_dosage)&& 
    (dataSubmitted[2].submitted || !thisPatient.requirement.weight) && (dataSubmitted[3].submitted || !thisPatient.requirement.step_count)){
        all_data_submitted = true
    }
    // console.log(dataSubmitted)
    try {
        patient = await User.findById(id)

    } catch (error) {
        console.log('Cannot get name of patient.')
        console.log(error)
    }
    
    res.render('pt_home.hbs', {
        layout: "pt_main", title: "Welcome,",

        all_data_submitted: all_data_submitted,

        blood_glucose_required: patient.requirement.blood_glucose,
        blood_glucose_submitted: dataSubmitted[0].submitted,
        blood_glucose_date: dataSubmitted[0].submit_time && formatDate(dataSubmitted[0].submit_time),
        blood_glucose_metric: dataSubmitted[0].metric,
        blood_glucose_cmt:dataSubmitted[0].comment,
        
        insulin_dosage_required: patient.requirement.insulin_dosage,
        insulin_dosage_submitted: dataSubmitted[1].submitted,
        insulin_dosage_date: dataSubmitted[1].submit_time && formatDate(dataSubmitted[1].submit_time),
        insulin_dosage_metric: dataSubmitted[1].metric,
        insulin_dosage_cmt:dataSubmitted[1].comment,
        
        step_count_required: patient.requirement.step_count,
        step_count_submitted: dataSubmitted[2].submitted,
        step_count_date: dataSubmitted[2].submit_time && formatDate(dataSubmitted[2].submit_time),
        step_count_metric: dataSubmitted[2].metric,
        step_count_cmt:dataSubmitted[2].comment,
        
        weight_required: patient.requirement.weight,
        weight_submitted: dataSubmitted[3].submitted,
        weight_date: dataSubmitted[3].submit_time && formatDate(dataSubmitted[3].submit_time),
        weight_metric: dataSubmitted[3].metric,
        weight_cmt:dataSubmitted[3].comment,

        restricted_action: req.query.restricted_action,
        patient_name: patient.first_name,
        user_id: patient._id, // or req.user._id????
        // user_secret: user.secret,
        doctor_patient_message:patient.message,
        user: thisPatient,

    })
}
const formatOnlyDate = (date) => {
    const timezoneRegex = /\(([^)]+)\)/; // sourced from https://stackoverflow.com/questions/17779744/regular-expression-to-get-a-string-between-parentheses-in-javascript
    const localDate = date.toLocaleDateString('en-GB');
    return `${localDate}`;
}

const formatTableDate = (date) => {
    const timezoneRegex = /\(([^)]+)\)/; // sourced from https://stackoverflow.com/questions/17779744/regular-expression-to-get-a-string-between-parentheses-in-javascript
    const localDate = date.toLocaleDateString('en-GB');
    const localTime = date.toLocaleTimeString().replace(/(.*)\D\d+/, "$1");
    return `${localDate} ${localTime}`;
};
// Format Date object to be more easily readable
const formatDate = (date) => {
    const timezoneRegex = /\(([^)]+)\)/; // sourced from https://stackoverflow.com/questions/17779744/regular-expression-to-get-a-string-between-parentheses-in-javascript
    const localDate = date.toLocaleDateString('en-GB');
    const localTime = date.toLocaleTimeString().replace(/(.*)\D\d+/, "$1");
    const timezone = timezoneRegex.exec(date.toString())[0];
    return `${localDate} ${localTime} ${timezone}`;
};


// Update individual health metric and associated fields
const updateDataById = async (healthObject, writeOptions, id) => {
    try {
        await User.findByIdAndUpdate(id, writeOptions, (err, result) => {
            if (err) {
                res.send(err)
            } else {
                console.log(
                    'Record added successfully for ' + healthObject)
            }
        }).clone()
    } catch (err) {
        console.log(err.message)
    }
}


// Retrieve all metrics, comment & date given patient's id 
const retrieveDataByPatientId = async (id) => {
    try {
        patient = await User.findById(id).clone()

        return [
            patient.blood_glucose,
            patient.insulin_dosage,
            patient.step_count,
            patient.weight,
            patient.first_name,
            // patient.requirement
        ]
    } catch (error) {
        console.log('Cannot check submit status')
        console.log(error)
    }
}

// Reset all data submitted given patient id, TESTING ONLY
const resetDataSubmitStatus = async (id) => {
    try {
        await User.findByIdAndUpdate(
            id,
            {
                $set: {
                    // requirement: {
                    //     blood_glucose: true,
                    //     weight: true,
                    //     insulin_dosage: true,
                    //     step_count: true
                    // },
                    // message:"hello",
                    blood_glucose: {
                        metric: null,
                        comment: null,
                        submit_time: null,
                        submitted: false,
                        // required:true
                    },

                    insulin_dosage: {
                        metric: null,
                        comment: null,
                        submit_time: null,
                        submitted: false,
                        // required:true
                    },

                    weight: {
                        metric: null,
                        comment: null,
                        submit_time: null,
                        submitted: false,
                        // required:true
                    },

                    step_count: {
                        metric: null,
                        comment: null,
                        submit_time: null,
                        submitted: false,
                        // required:true
                    },                       
                }                
            },
            (error, result) => {
                if (error) {
                    res.send(error)
                    console.log(error)
                } else {
                    console.log('Reset submission status successfully')
                }
            }
        ).clone()
    } catch (error) {
        console.log('Cannot reset data submit status')
        console.log(error)
    }
}

// view patient's historical data
const viewPastData = async (req, res) => {

    const patient = req.user.toJSON()
    id = patient._id
    const health_stats = await HealthStat.find({patientId: id}).sort({'date': 'desc', 'first_name': 'asc'}).populate('patientId').lean()
    const thisPatient = await User.findOne({_id: id}).lean()

    const now   = new Date(Date.now())
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    let represent = 0
    const requirement = thisPatient.requirement
    thisPatient.lastEntry = true

    for (const item in requirement){
        if ((requirement[item] == true) && (thisPatient[item] != null) && (thisPatient[item].submitted == true)  && (thisPatient[item].submit_time != null)) {
            represent = item
        }
    }
    if(represent != 0){
        const submitTime = thisPatient[represent].submit_time
        const submitDay = new Date(submitTime.getFullYear(), submitTime.getMonth(), submitTime.getDate())
        if(submitDay.getFullYear() == today.getFullYear() && submitDay.getMonth() == today.getMonth() && submitDay.getDate() == today.getDate()){
            thisPatient.entryNeeded = false
            thisPatient.currdate = formatOnlyDate(today)
        }
        else{
            thisPatient.entryNeeded = true
            thisPatient.currdate = formatOnlyDate(today)
        }
        thisPatient.lastDate = formatOnlyDate(submitDay)
    }
    else{
        thisPatient.entryNeeded = true
        thisPatient.currdate = formatOnlyDate(today)
        thisPatient.lastEntry = false
    }
    
    if(thisPatient.blood_glucose && thisPatient.blood_glucose.submitted && thisPatient.blood_glucose.submit_time){
        thisPatient.blood_glucose.submit_time = formatTableDate(thisPatient.blood_glucose.submit_time)
    }
    if(thisPatient.insulin_dosage && thisPatient.insulin_dosage.submitted && thisPatient.insulin_dosage.submit_time){
        thisPatient.insulin_dosage.submit_time = formatTableDate(thisPatient.insulin_dosage.submit_time)
    }
    if(thisPatient.weight && thisPatient.weight.submitted && thisPatient.weight.submit_time){
        thisPatient.weight.submit_time = formatTableDate(thisPatient.weight.submit_time)
    }
    if(thisPatient.step_count && thisPatient.step_count.submitted && thisPatient.step_count.submit_time){
        thisPatient.step_count.submit_time = formatTableDate(thisPatient.step_count.submit_time)
    }

    for(let i = 0; i<health_stats.length;i++){
        if(health_stats[i].blood_glucose && health_stats[i].blood_glucose.submitted && health_stats[i].blood_glucose.submit_time){
            health_stats[i].blood_glucose.submit_time = formatTableDate(health_stats[i].blood_glucose.submit_time)
        }
        if(health_stats[i].insulin_dosage && health_stats[i].insulin_dosage.submitted && health_stats[i].insulin_dosage.submit_time){
            health_stats[i].insulin_dosage.submit_time = formatTableDate(health_stats[i].insulin_dosage.submit_time)
        }
        if(health_stats[i].weight && health_stats[i].weight.submitted && health_stats[i].weight.submit_time){
            health_stats[i].weight.submit_time = formatTableDate(health_stats[i].weight.submit_time)
        }
        if(health_stats[i].step_count && health_stats[i].step_count.submitted && health_stats[i].step_count.submit_time){
            health_stats[i].step_count.submit_time = formatTableDate(health_stats[i].step_count.submit_time)
        }
        health_stats[i].date = formatOnlyDate(health_stats[i].date)
    }

    // console.log(health_stats)
    res.render('patient_past_data.hbs', {layout: 'pt_main', title: "",
                                         health_stats: health_stats,
                                         doctor_patient_message: thisPatient.message,
                                         thispatient: thisPatient,
                                         doctor_patient_message: thisPatient.message,
                                         user: thisPatient,  })
}

// view leaderboard
const leaderboard = async (req, res) => {
    try {
        // console.log(req.params)
        const user = req.user.toJSON()
        const patient_list = await User.find({role:"patient"}).lean()
        const sorted_patients = patient_list.sort(compare)
        
        res.render('leaderboard.hbs', {
            layout: 'pt_main',
            user_id: user._id,
            doctor_patient_message: user.message,
            user: user,
            patients: sorted_patients, 
            title: "Leaderboard" 
        })
    } catch (err) {
        return (err)
    }  
}

function compare(a,b){
    if ( a.active_days/a.total_days < b.active_days/b.total_days ){
        return 1;
      }
      if ( a.active_days/a.total_days > b.active_days/b.total_days ){
        return -1;
      }
      return 0;
}
// view preferences
const preferences = async (req, res) => {
    const user = req.user.toJSON()

    const response = {
        layout: 'pt_main',
        user: user,
        doctor_patient_message:user.message,
        title: 'Preferences',
        password_updated: req.query.password_updated
        
    }
    res.render('preferences.hbs', response)
}

// view password
const passwordPage = async (req, res) => {
    const user = req.user.toJSON()
    const response = {
        layout: 'pt_main',
        title: 'Change Your Password',
        incorrect_password: req.query.incorrect_password,
        no_match: req.query.no_match,
        password_length_error: req.query.password_length_error,
        user: user,  
    }
    res.render('pt_password.hbs', response)
}

// view patient about diabetes
const patientAboutdiabetes = async (req, res) => {
    const id = req.user.toJSON()._id
    const thisPatient = await User.findOne({_id:id}).lean()

    const response = {
        layout: 'pt_main',
        title: 'About Diabetes',
        doctor_patient_message: thisPatient.message,
        user: thisPatient,    
    }
    res.render('about_diabetes.hbs', response)
}

// view patient about websites
const patientAboutthispage = async (req, res) => {
    const id = req.user.toJSON()._id
    const thisPatient = await User.findOne({_id:id}).lean()
    const response = {
        layout: 'pt_main',
        title: 'About Diabetes@Home',
        doctor_patient_message: thisPatient.message,
        user: thisPatient,     
    }
    res.render('about_website.hbs', response)
}

// change password successfully 
const change_password_success = async (req, res) => {
    const id = req.user.toJSON()._id
    const thisPatient = await User.findOne({_id:id}).lean()
    const response = {
        layout: 'pt_main',
        title: 'Change your password', 
        user: thisPatient,      
    }
    res.render('password_success.hbs', response)
}

// change patient password
const change_password = async (req, res) => {

    console.log(req.user.toJSON()._id)
    User.findOne({ _id: req.user.toJSON()._id }, (err, user) => {

        if (err) {
            res.json({ success: false, message: err })
        } else {
            if (!user){
                res.json({ success: false, message: 'User not found.' })
            } else {
                console.log("HI");

                const current_password = req.body.current_password
                const new_password = req.body.new_password;
                const confirm_new_password = req.body.confirm_new_password;

                // const message = document.getElementById("message");

                if (new_password.length < 8) {
                    console.log("New password less than 8 characters in length.");
                    res.redirect('/patient_home/preferences/change_password?password_length_error=true')
                }

                else if (new_password != confirm_new_password) {
                    console.log("Passwords do not match.");
                    res.redirect('/patient_home/preferences/change_password?no_match=true')
                }

                else {
                    
                    // Validation passed - now ensure current password submitted matches
                    bcrypt.compare(current_password, user.password, (err, resp) => {
                        if (err) throw err;
                        if (resp === false) {
                            console.log('Current password is incorrect.');
                            res.redirect('/patient_home/preferences/change_password?incorrect_password=true')
                        } else {
                            console.log(current_password);
                            // Update user password with new password
                            bcrypt.genSalt(10, (err, salt) =>
                                bcrypt.hash(new_password, salt, (err, hash) => {
                                    if (err) throw err;
                                    user.password = hash;
                                    user.save();
                            }))

                            res.redirect('/patient_home/preferences/change_password/success')
                        }
                        
            
                    })
                }
            }
        }
    })
}

// Format Date object to be more easily readable
const formatDateOnly = (date) => {
    const timezoneRegex = /\(([^)]+)\)/; // sourced from https://stackoverflow.com/questions/17779744/regular-expression-to-get-a-string-between-parentheses-in-javascript
    const localDate = date.toLocaleDateString('en-GB');
    return `${localDate}`;
};

// Visualise data
const getVisualisation = async (req, res) => {
    
    const id = req.user.toJSON()._id
    const thispatient = await User.findOne( {_id: id} ).lean()

    const dates = []
    const step_count_stats = []
    const weight_stats = []
    const insulin_dosage_stats = []
    const blood_glucose_stats = []

    // Record dates
    const patientRecord = await HealthStat.find({patientId:id}).sort({'date': 'asc'}).lean()
    patientRecord.forEach(healthstat => {
        dates.push(formatDateOnly(healthstat.date))
    })

    // If blood glucose is recorded
    if (thispatient.requirement.blood_glucose) {

        patientRecord.forEach(healthstat => {
            blood_glucose_stats.push(parseFloat(healthstat.blood_glucose.metric))
        })
        
    }

    // If insulin dosage is recorded
    if (thispatient.requirement.insulin_dosage) {

        patientRecord.forEach(healthstat => {
            insulin_dosage_stats.push(parseInt(healthstat.insulin_dosage.metric))
        })
        
    }

    // If weight is recorded
    if (thispatient.requirement.weight) {

        patientRecord.forEach(healthstat => {
            weight_stats.push(parseFloat(healthstat.weight.metric))
        })
        
    }

    // If step count is recorded
    if (thispatient.requirement.step_count) {

        patientRecord.forEach(healthstat => {
            step_count_stats.push(parseInt(healthstat.step_count.metric))
        })
        
    }

    return res.render('pt_charts.hbs', { 
        layout: 'pt_main', 
        thispatient: thispatient, 
        user: thispatient, 
        blood_glucose_stats: JSON.stringify(blood_glucose_stats),
        insulin_dosage_stats: JSON.stringify(insulin_dosage_stats),
        weight_states: JSON.stringify(weight_stats),
        step_count_stats: JSON.stringify(step_count_stats),
        dates: JSON.stringify(dates)
    }) 
}

module.exports = {
    patientHome,
    processPatientData,
    viewPastData,
    leaderboard,
    preferences,
    change_password,
    passwordPage,
    patientAboutdiabetes,
    patientAboutthispage,
    change_password_success,
    getVisualisation
}
