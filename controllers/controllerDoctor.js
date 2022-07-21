const bcrypt = require('bcrypt')
const User = require('../models/user')
const HealthStat = require('../models/health_stats')
const Notes = require('../models/notes')

// Function below is used to handle GET request from doctor for dashboard
const doctorHome = async (req, res, next) => {

    const id = req.user.toJSON()._id
    // console.log(id)
    try {
        doctor = await User.findById(id)

    } catch (error) {
        console.log('Cannot get name of patient.')
        console.log(error)
    }

    try {
        const now   = new Date(Date.now())
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const patients = await User.find({managed_by:id}).sort({'first_name': 'asc'}).lean()
        for(let i = 0; i<patients.length; i++){
            let represent = 0
            const thisPatient = patients[i]
            const requirement = patients[i].requirement
            for (const item in requirement){
                if ((requirement[item] == true) && (thisPatient[item] != null) && (thisPatient[item].submitted == true)  && (thisPatient[item].submit_time != null)) {
                    represent = item
                }
            }
            if(represent != 0){
                const submitTime = thisPatient[represent].submit_time
                const submitDay = new Date(submitTime.getFullYear(), submitTime.getMonth(), submitTime.getDate())
                if((submitDay.getFullYear() == today.getFullYear()) && (submitDay.getMonth() == today.getMonth()) && (submitDay.getDate() == today.getDate())){
                    thisPatient.enteredToday = true
                   // thisPatient.currdate = formatDate(today)
                }
                else{
                    thisPatient.entryNeeded = false
                  //  thisPatient.currdate = formatDate(today)
                }
            }
            else{
                thisPatient.entryNeeded = false
               // thisPatient.currdate = formatDate(today)
            }
        }
        return res.render('dr_home.hbs', { 
            layout: 'dr_main', 
            user_id: doctor._id,
            doctor_name: doctor.first_name, 
            patients: patients, 
            title: "", //"Doctor Home"
            restricted_action: req.query.restricted_action
        })
    } catch (err) {
        return next(err)
    }
}


// Function below is used to handle GET request when doctor clicks to a patient's name in dash board
const individualPatientData = async (req, res) => {
    try {

        const id = req.params.id
        
        const thispatient = await User.findOne( {_id: id} ).lean()
        const health_stats = await HealthStat.find({patientId: id}).sort({'date': 'desc'}).populate('patientId').lean()
        const notes = await Notes.find({patientId: id}).sort({'date': 'desc'}).lean()

        const now   = new Date(Date.now())
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        let represent = 0
        const requirement = thispatient.requirement
        thispatient.lastEntry = true
        for (const item in requirement){
            if ((requirement[item] == true) && (thispatient[item] != null) && (thispatient[item].submitted == true)  && (thispatient[item].submit_time != null)) {
                represent = item
            }
        }
        if(represent != 0){
            const submitTime = thispatient[represent].submit_time
            const submitDay = new Date(submitTime.getFullYear(), submitTime.getMonth(), submitTime.getDate())
            if((submitDay.getFullYear() == today.getFullYear()) && (submitDay.getMonth() == today.getMonth()) && (submitDay.getDate() == today.getDate())){
                thispatient.entryNeeded = false
                thispatient.currdate = formatOnlyDate(today)
            }
            else{
                thispatient.entryNeeded = true
                thispatient.currdate = formatOnlyDate(today)
            }
            thispatient.lastDate = formatOnlyDate(submitDay)
        }
        else{
            thispatient.entryNeeded = true
            thispatient.currdate = formatOnlyDate(today)
            thispatient.lastEntry = false
        }

        if(thispatient.blood_glucose && thispatient.blood_glucose.submitted && thispatient.blood_glucose.submit_time){
            thispatient.blood_glucose.submit_time = formatDate(thispatient.blood_glucose.submit_time)
        }
        if(thispatient.insulin_dosage && thispatient.insulin_dosage.submitted && thispatient.insulin_dosage.submit_time){
            thispatient.insulin_dosage.submit_time = formatDate(thispatient.insulin_dosage.submit_time)
        }
        if(thispatient.weight && thispatient.weight.submitted && thispatient.weight.submit_time){
            thispatient.weight.submit_time = formatDate(thispatient.weight.submit_time)
        }
        if(thispatient.step_count && thispatient.step_count.submitted && thispatient.step_count.submit_time){
            thispatient.step_count.submit_time = formatDate(thispatient.step_count.submit_time)
        }

        for(let i = 0; i<health_stats.length;i++){
            if(health_stats[i].blood_glucose && health_stats[i].blood_glucose.submitted && health_stats[i].blood_glucose.submit_time){
                health_stats[i].blood_glucose.submit_time = formatDate(health_stats[i].blood_glucose.submit_time)
            }
            if(health_stats[i].insulin_dosage && health_stats[i].insulin_dosage.submitted && health_stats[i].insulin_dosage.submit_time){
                health_stats[i].insulin_dosage.submit_time = formatDate(health_stats[i].insulin_dosage.submit_time)
            }
            if(health_stats[i].weight && health_stats[i].weight.submitted && health_stats[i].weight.submit_time){
                health_stats[i].weight.submit_time = formatDate(health_stats[i].weight.submit_time)
            }
            if(health_stats[i].step_count && health_stats[i].step_count.submitted && health_stats[i].step_count.submit_time){
                health_stats[i].step_count.submit_time = formatDate(health_stats[i].step_count.submit_time)
            }
            health_stats[i].date = formatOnlyDate(health_stats[i].date)
        }
        
        for(let i = 0; i<notes.length;i++){
            if(notes[i].date){
                notes[i].date = formatDate(notes[i].date)
            }
        }
        console.log(health_stats)



        res.render('dr_individual_patients', { layout: 'dr_main', thispatient: thispatient, health_stats:health_stats, notes:notes, title: "" })   
        // return res.render('dr_individual_patients', { layout: 'dr_main', thispatient: thispatient, health_stats:health_stats, notes:notes, title: "Doctor Home" })       
    } catch (error) {
        console.log(error)
    }

}

const doctorPatientComments = async(req, res, next) => {
    const id =  req.user.toJSON()._id
    try {

        const allcomments = await HealthStat.find().sort({'date': 'desc'}).populate('patientId').lean()
        comments = []
        for (const comment of allcomments){
            if (comment.patientId.managed_by == id){
                comments.push(comment);
            }
        }
        for(let i = 0; i<comments.length;i++){
            if(comments[i].blood_glucose && comments[i].blood_glucose.submitted && comments[i].blood_glucose.submit_time){
                comments[i].blood_glucose.submit_time = formatDate(comments[i].blood_glucose.submit_time)
            }
            if(comments[i].insulin_dosage && comments[i].insulin_dosage.submitted && comments[i].insulin_dosage.submit_time){
                comments[i].insulin_dosage.submit_time = formatDate(comments[i].insulin_dosage.submit_time)
            }
            if(comments[i].weight && comments[i].weight.submitted && comments[i].weight.submit_time){
                comments[i].weight.submit_time = formatDate(comments[i].weight.submit_time)
            }
            if(comments[i].step_count && comments[i].step_count.submitted && comments[i].step_count.submit_time){
                comments[i].step_count.submit_time = formatDate(comments[i].step_count.submit_time)
            }
        }

        const patients = await User.find({managed_by:id}).sort({'first_name': 'asc'}).lean()
        for(let i = 0; i<patients.length;i++){
            if(patients[i].blood_glucose && patients[i].blood_glucose.submitted && patients[i].blood_glucose.submit_time){
                patients[i].blood_glucose.submit_time = formatDate(patients[i].blood_glucose.submit_time)
            }
            if(patients[i].insulin_dosage && patients[i].insulin_dosage.submitted && patients[i].insulin_dosage.submit_time){
                patients[i].insulin_dosage.submit_time = formatDate(patients[i].insulin_dosage.submit_time)
            }
            if(patients[i].weight && patients[i].weight.submitted && patients[i].weight.submit_time){
                patients[i].weight.submit_time = formatDate(patients[i].weight.submit_time)
            }
            if(patients[i].step_count && patients[i].step_count.submitted && patients[i].step_count.submit_time){
                patients[i].step_count.submit_time = formatDate(patients[i].step_count.submit_time)
            }
        }

        return res.render('dr_patient_comments.hbs', { 
            layout: 'dr_main', 
            comments: comments, 
            patients: patients,
            title: "" 
        })
    } catch (err) {
    return next(err)
}
}

const sendMessage = async(req,res,next) => {
    const id = req.params.id
    const type = Object.keys(req.body)[0]
    thispatient = await User.findOne( {_id: id} ).lean()
    if(type == 'message'){
        writeOptions = {
            $set : {
                message:req.body.message.trim(),
            }  
        }

        try {
            await User.findByIdAndUpdate(id, writeOptions, (err, result) => {
                if (err) {
                    res.send(err)
                } else {
                    console.log(
                        'Message added successfully for ' + id)
                }
            }).clone()
        } catch (err) {
            console.log(err.message)
        }
    }

    individualPatientData(req,res,next)
}

const formatOnlyDate = (date) => {
    const timezoneRegex = /\(([^)]+)\)/; // sourced from https://stackoverflow.com/questions/17779744/regular-expression-to-get-a-string-between-parentheses-in-javascript
    const localDate = date.toLocaleDateString('en-GB');
    return `${localDate}`;
}

// Format Date object to be more easily readable
const formatDateOnly = (date) => {
    const timezoneRegex = /\(([^)]+)\)/; // sourced from https://stackoverflow.com/questions/17779744/regular-expression-to-get-a-string-between-parentheses-in-javascript
    const localDate = date.toLocaleDateString('en-GB');
    return `${localDate}`;
};

// Format Date object to be more easily readable
const formatDate = (date) => {
    const timezoneRegex = /\(([^)]+)\)/; // sourced from https://stackoverflow.com/questions/17779744/regular-expression-to-get-a-string-between-parentheses-in-javascript
    const localDate = date.toLocaleDateString('en-GB');
    const localTime = date.toLocaleTimeString().replace(/(.*)\D\d+/, "$1");
    return `${localDate} ${localTime}`;
};

// Add new patient
const registerPatientPage = async (req, res) => {
    res.render('register_patient.hbs', {layout: 'dr_main', title: "Register New Patient" })
}

// Add a new patient action
const registerNewPatient = async (req, res) => {
    const fieldNames = ["blood_glucose", "weight", "insulin_dosage", "step_count"]
    const doctorID = req.user.toJSON()._id
    try {

        // Generate a random password
        function generatePassword() {
            var length = 8,
                charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
                retVal = "";
            for (var i = 0, n = charset.length; i < length; ++i) {
                retVal += charset.charAt(Math.floor(Math.random() * n));
            }
            return retVal;
        }
        const random_password = generatePassword()

        console.log(random_password);

        bcrypt.genSalt(10, function (err, salt) {
            if (err) return next(err);
            bcrypt.hash(random_password, salt, function (err, hash) {
                if (err) return next(err);
                const newPatient = new User ({
                    first_name: req.body.first_name.trim(),
                    last_name: req.body.last_name.trim(), 
                    role: 'patient',
                    email: req.body.patient_email.toLowerCase().trim(),
                    screen_name: req.body.screen_name.trim(),
                    birth_year: req.body.birth_year.trim(),
                    bio: req.body.bio.trim(),
                    password: hash,
                    active_days: 0, 
                    total_days: 1,  
                    requirement: {
                        blood_glucose: false,
                        insulin_dosage:false,
                        weight: false,
                        step_count: false
                    },
                    managed_by: doctorID, // NEED TO ADD THIS - when new patient created, link it to doctor who created him/her             
                })

                if (req.body.blood_glucose_checkbox) {
                    newPatient.requirement.blood_glucose = true
                    if (req.body.blood_glucose_low == "" || req.body.blood_glucose_low == null) {
                        newPatient.thresholds.blood_glucose.min = 0
                    } else {
                        newPatient.thresholds.blood_glucose.min = req.body.blood_glucose_low
                    }
                    if (req.body.blood_glucose_high == "" || req.body.blood_glucose_high == null) {
                        newPatient.thresholds.blood_glucose.max = 1000
                    } else {
                        newPatient.thresholds.blood_glucose.max = req.body.blood_glucose_high
                    }          
                }

                if (req.body.insulin_checkbox){
                    newPatient.requirement.insulin_dosage = true
                    if (req.body.insulin_dose_low == "" || req.body.insulin_dose_low == null) {
                        newPatient.thresholds.insulin_dosage.min = 0
                    } else {
                        newPatient.thresholds.insulin_dosage.min = req.body.insulin_dose_low
                    }
                    if (req.body.insulin_dose_high == "" || req.body.insulin_dose_high == null) {
                        newPatient.thresholds.insulin_dosage.max = 1000
                    } else {
                        newPatient.thresholds.insulin_dosage.max = req.body.insulin_dose_high
                    }     
                }

                if (req.body.weight_checkbox){
                    newPatient.requirement.weight = true
                    if (req.body.weight_low == "" || req.body.weight_low == null) {
                        newPatient.thresholds.weight.min = 0
                    } else {
                        newPatient.thresholds.weight.min = req.body.weight_low
                    }
                    if (req.body.weight_high == "" || req.body.weight_high == null) {
                        newPatient.thresholds.weight.max = 1000
                    } else {
                        newPatient.thresholds.weight.max = req.body.weight_high
                    }    
                }

                if (req.body.exercise_checkbox){
                    newPatient.requirement.step_count = true
                    if (req.body.exercise_low == "" || req.body.exercise_low == null) {
                        newPatient.thresholds.step_count.min = 0
                    } else {
                        newPatient.thresholds.step_count.min = req.body.exercise_low
                    }
                    if (req.body.exercise_high == "" || req.body.exercise_high == null) {
                        newPatient.thresholds.step_count.max = 999999
                    } else {
                        newPatient.thresholds.step_count.max = req.body.exercise_high
                    }
                }

                for (let i = 0; i < fieldNames.length; i ++){
                    newPatient[fieldNames[i]].metric = null
                    newPatient[fieldNames[i]].comment = null
                    newPatient[fieldNames[i]].submit_time = null
                    newPatient[fieldNames[i]].submitted = false
                }

                newPatient.save()
                res.render('register_success', {
                    layout: 'dr_main',
                    title: "Register New Patient", 
                    password: random_password, 
                    email: req.body.patient_email.toLowerCase(),
                    patient: req.body.first_name /* toLowerCase() ? Maybe first letter only? */
                })
            })
        })

    } catch (e) {
        console.log(e.message);
    }
}

// Register patient success
const registerSuccessPage = async (req, res) => {
    res.render('register_success.hbs', {layout: 'dr_main', title: "Registration Success" })
}

// Doctor preferences
const doctorPreferences = async (req, res) => {
    const doctorID = req.user.toJSON()._id
    const thisdoctor = await User.findOne( {_id: doctorID} ).lean()
    res.render('dr_preferences.hbs', {layout: 'dr_main', title: "" , doctor: thisdoctor })
}

// view password
const doctorPasswordpage = async (req, res) => {
    const response = {
        layout: 'dr_main',
        title: 'Change Your Password',
        incorrect_password: req.query.incorrect_password,
        no_match: req.query.no_match,
        password_length_error: req.query.password_length_error
    }
    res.render('dr_password.hbs', response)
}

// view patient about diabetes
const doctorAboutdiabetes = async (req, res) => {
    res.render('about_diabetes.hbs', {layout: 'dr_main', title: "About Diabetes" })
}

// view patient about websites
const doctorAboutthispage = async (req, res) => {
    res.render('about_website.hbs', {layout: 'dr_main', title: "About Diabetes@Home" })
}

// view patient about websites
const doctorPasswordsuccess = async (req, res) => {
    res.render('password_success.hbs', {layout: 'dr_main', title: "Change your Password" })
}

// See patient threholds
const editThresholds = async (req, res) => {
    const id = req.params.id
    
    const thispatient = await User.findOne( {_id: id} ).lean()
    return res.render('edit_patient_thresholds.hbs', { layout: 'dr_main', thispatient: thispatient }) 
}

const editIndividualThreshold = async(req, res) => {

    const id = req.params.id
    const fieldAdding = req.params.field
    let writeOptions = {}
    console.log(req.body)

    try {

        switch (fieldAdding){
            case ("blood_glucose"):
                if (req.body.blood_glucose_checkbox){
                    writeOptions = {$set: { "requirement.blood_glucose"   : true,
                                            "thresholds.blood_glucose.min": req.body.blood_glucose_low,
                                            "thresholds.blood_glucose.max": req.body.blood_glucose_high}}
                    await User.findOneAndUpdate({_id: id}, writeOptions)  
                }
    
                else{
                    writeOptions = {$set: {"requirement.blood_glucose": false,}}
                    await User.findOneAndUpdate({_id: id}, writeOptions)
                }
                break
            
    
            case ("insulin_dosage"):
                if (req.body.insulin_checkbox){
                    writeOptions = {$set: { "requirement.insulin_dosage"   : true,
                                            "thresholds.insulin_dosage.min": req.body.insulin_dose_low,
                                            "thresholds.insulin_dosage.max": req.body.insulin_dose_high}}
                    await User.findOneAndUpdate({_id: id}, writeOptions)  
                }
    
                else{
                    writeOptions = {$set: {"requirement.insulin_dosage": false,}}
                    await User.findOneAndUpdate({_id: id}, writeOptions)
                }
                break
            
    
            case ("weight"):
                if (req.body.weight_checkbox){
                    writeOptions = {$set: { "requirement.weight"   : true,
                                            "thresholds.weight.min": req.body.weight_low,
                                            "thresholds.weight.max": req.body.weight_high}}
                    await User.findOneAndUpdate({_id: id}, writeOptions)  
                }
    
                else{
                    writeOptions = {$set: {"requirement.weight": false,}}
                    await User.findOneAndUpdate({_id: id}, writeOptions)
                }
                break
            
    
            case ("exercise"):
                if (req.body.exercise_checkbox){
                    writeOptions = {$set: { "requirement.step_count"   : true,
                                            "thresholds.step_count.min": req.body.exercise_low,
                                            "thresholds.step_count.max": req.body.exercise_high}}
                    await User.findOneAndUpdate({_id: id}, writeOptions)  
                }
    
                else{
                    writeOptions = {$set: {"requirement.step_count": false,}}
                    await User.findOneAndUpdate({_id: id}, writeOptions)
                }
                break
        }

        
    } catch (error) {
        console.log(error)
    }
    editThresholds(req, res)
}



const addPatientNote = async (req, res) => {
    /* 
    1. Get the patient id
    2. Make write options
    3. Write to Notes
    */
    const id = req.params.id
    const type = Object.keys(req.body)[0]
    thispatient = await User.findOne( {_id: id} ).lean()
    if(type == 'note'){
        try {
            await Notes.create({
                comment: req.body.note.trim(),
                patientId: id,
                date: Date.now()
            })
        } catch (err) {
            console.log(err.message)
        }
    }

    individualPatientData(req,res)//.next

    return 0
}

// Visualise data
const getVisualisation = async (req, res) => {
    const id = req.params.id
    
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

    return res.render('charts.hbs', { 
        layout: 'dr_main', 
        thispatient: thispatient, 
        blood_glucose_stats: JSON.stringify(blood_glucose_stats),
        insulin_dosage_stats: JSON.stringify(insulin_dosage_stats),
        weight_states: JSON.stringify(weight_stats),
        step_count_stats: JSON.stringify(step_count_stats),
        dates: JSON.stringify(dates)
    }) 
}

// change password successfully 
const change_password_success = async (req, res) => {
    const response = {
        layout: 'dr_main',
        title: 'Change your password',       
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
                    res.redirect('/dr_home/preferences/change_password?password_length_error=true')
                }

                else if (new_password != confirm_new_password) {
                    console.log("Passwords do not match.");
                    res.redirect('/dr_home/preferences/change_password?no_match=true')
                }

                else {
                    
                    // Validation passed - now ensure current password submitted matches
                    bcrypt.compare(current_password, user.password, (err, resp) => {
                        if (err) throw err;
                        if (resp === false) {
                            console.log('Current password is incorrect.');
                            res.redirect('/dr_home/preferences/change_password?incorrect_password=true')
                        } else {
                            console.log(current_password);
                            // Update user password with new password
                            bcrypt.genSalt(10, (err, salt) =>
                                bcrypt.hash(new_password, salt, (err, hash) => {
                                    if (err) throw err;
                                    user.password = hash;
                                    user.save();
                            }))

                            res.redirect('/dr_home/preferences/change_password/success')
                        }
                        
            
                    })
                }
            }
        }
    })
}

module.exports = {
    doctorHome,
    individualPatientData,
    registerPatientPage,
    registerNewPatient,
    registerSuccessPage,
    doctorPreferences,
    doctorPatientComments,
    sendMessage,
    addPatientNote,
    doctorPasswordpage,
    doctorAboutdiabetes,
    doctorAboutthispage,
    editThresholds,
    editIndividualThreshold,
    doctorPasswordsuccess,
    change_password,
    change_password_success,
    getVisualisation
}