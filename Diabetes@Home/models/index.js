// Load environment variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const mongoose = require('mongoose')

require('./user')
require('./health_stats')

// Connect to your mongo database using the MONGO_URL environment variable.
// Locally, MONGO_URL will be loaded by dotenv from .env.
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'Diabetes@Home',
})

// Exit on error
const db = mongoose.connection.on('error', (err) => {
    console.error(err)
    process.exit(1)
})

// Log to console once the database is open
db.once('open', async () => {
    console.log(`Mongo connection started on ${db.host}:${db.port}`)
})
