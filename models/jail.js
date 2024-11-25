const mongoose = require('mongoose');

const jailSchema = new mongoose.Schema({
    userId: String,
    guildId: String,
    oldRoles: [String],
    jailEnd: Date
});

module.exports = mongoose.model('Jail', jailSchema);