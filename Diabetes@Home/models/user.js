const mongoose = require('mongoose')
require('mongoose-double')(mongoose)

const user_schema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: String,
    screen_name: String,
    role: String,
    message: String,
    email: {
        type: String,
        required: true,
        lowercase: true,
        minlength: 5
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    birth_year: String,
    managed_by: {
        type: mongoose.Schema.Types.String,
        ref: 'doctor',
    },
    active_days:{
        type: Number
    },

    total_days:{
        type: Number
    },

    requirement: {
        blood_glucose: Boolean,
        weight: Boolean,
        insulin_dosage: Boolean,
        step_count: Boolean
    },

    blood_glucose: {
        metric: mongoose.Schema.Types.Double,
        comment: String,
        submit_time: Date,
        submitted: Boolean,
    },

    weight: {
        metric: mongoose.Schema.Types.Double,
        comment: String,
        submit_time: Date,
        submitted: Boolean,
    },


    insulin_dosage: {
        metric: Number,
        comment: String,
        submit_time: Date,
        submitted: Boolean,
    },

    step_count: {
        metric: Number,
        comment: String,
        submit_time: Date,
        submitted: Boolean,
    },

    thresholds: {
        blood_glucose: {
            min: mongoose.Schema.Types.Double,
            max: mongoose.Schema.Types.Double,
        },
        insulin_dosage: {
            min: Number,
            max: Number,
        },
        weight: {
            min: mongoose.Schema.Types.Double,
            max: mongoose.Schema.Types.Double,
        },
        step_count: {
            min: Number,
            max: Number,
        },
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
    bio: String,
    health_stats: [{type: mongoose.Schema.Types.ObjectId, ref: 'Healthstat'}]
})

// Pass in collection named 'User'
const User = mongoose.model('User', user_schema)

module.exports = User
