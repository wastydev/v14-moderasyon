const ms = require('ms');
const Mute = require('../models/mute'); // Mute modelini buraya ekleyin

module.exports = {
    name: 'voicemute',
    description: 'Belirtilen kullanıcıyı sesli olarak mute eder.',
    async execute(message, args) {
        const target = message.mentions.members.first();
        const duration = args[1];
        const reason = args.slice(2).join(' ');
        const logChannel = message.guild.channels.cache.find(channel => channel.name === 'log-kanalı');

        if (!target || !duration || !reason || !logChannel) {
            return message.reply('Lütfen tüm argümanları doğru girin ve gerekli kanalın mevcut olduğundan emin olun.');
        }

        const muteTime = ms(duration);
        if (!muteTime) return message.reply('Geçerli bir süre girin.');

        if (target.voice.channel) {
            target.voice.setMute(true, reason);
        } else {
            return message.reply('Kullanıcı bir ses kanalında değil.');
        }

        const muteEnd = new Date(Date.now() + muteTime);
        const muteDoc = new Mute({
            userId: target.id,
            guildId: message.guild.id,
            muteEnd: muteEnd
        });
        await muteDoc.save();

        logChannel.send(`${target} kullanıcısı ${message.author} tarafından ${duration} boyunca sesli olarak mutelendi. Sebep: ${reason}`);

        setTimeout(async () => {
            if (target.voice.channel) {
                target.voice.setMute(false, 'Mute süresi doldu');
            }
            logChannel.send(`${target} kullanıcısının sesli mute süresi doldu.`);
            await Mute.findOneAndDelete({ userId: target.id, guildId: message.guild.id });
        }, muteTime);
    }
};
