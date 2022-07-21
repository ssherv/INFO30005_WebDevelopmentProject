const mongoose = require('mongoose')
require('mongoose-double')(mongoose)

const notes_schema = new mongoose.Schema({
    patientId: {
    type: mongoose.Schema.Types.String, 
    ref: 'Patient',
    },
    date: Date,
    comment: String,
})

const Notes = mongoose.model('Notes', notes_schema)

module.exports = Notes