const mongoose = require('mongoose')

const health_stats_schema = new mongoose.Schema({

    patientId: {
        type: mongoose.Schema.Types.String, 
        ref: 'User',
        },
    date: Date,

    blood_glucose: {
        metric: mongoose.Schema.Types.Double,
        comment: String,
        submit_time: Date,
        submitted: Boolean
    },

    weight: {
        metric: mongoose.Schema.Types.Double,
        comment: String,
        submit_time: Date,
        submitted: Boolean
    },

    insulin_dosage: {
        metric: Number,
        comment: String,
        submit_time: Date,
        submitted: Boolean
    },

    step_count: {
        metric: Number,
        comment: String,
        submit_time: Date,
        submitted: Boolean
    },
})

// Pass in collection named 'healthstat'
const HealthStats = mongoose.model('HealthStat', health_stats_schema)
module.exports = HealthStats
