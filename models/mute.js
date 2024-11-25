const mongoose = require('mongoose');

const muteSchema = new mongoose.Schema({
    userId: String,
    guildId: String,
    muteEnd: Date
});

module.exports = mongoose.model('Mute', muteSchema);
