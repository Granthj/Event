const mongoose = require('mongoose');
const schema = mongoose.Schema;
const Cart = new schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }
})
module.exports = Cart