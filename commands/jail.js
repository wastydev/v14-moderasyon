const ms = require('ms');
const Jail = require('../models/jail'); // Jail modelini buraya ekleyin

module.exports = {
    name: 'jail',
    description: 'Belirtilen kullanıcıyı jail eder.',
    async execute(message, args) {
        // Yalnızca yöneticiler veya belirli role sahip kullanıcılar komutu kullanabilir
        const requiredRole = 'Moderator'; // Değiştirin: İzin verilen rol adı
        if (!message.member.roles.cache.some(role => role.name === requiredRole) && !message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('Bu komutu kullanmak için yetkiniz yok.');
        }

        const target = message.mentions.members.first();
        const duration = args[1];
        const reason = args.slice(2).join(' ');
        const jailRole = message.guild.roles.cache.find(role => role.name === 'Jail');
        const returnRole = message.guild.roles.cache.find(role => role.name === 'Member'); // Değiştirin: süre sonunda verilecek rol
        const logChannel = message.guild.channels.cache.find(channel => channel.name === 'log-kanalı');

        if (!target || !reason || !jailRole || !returnRole || !logChannel) {
            return message.reply('Lütfen tüm argümanları doğru girin ve gerekli rol ve kanalın mevcut olduğundan emin olun.');
        }

        let jailTime;
        if (duration) {
            jailTime = ms(duration);
            if (!jailTime) return message.reply('Geçerli bir süre girin.');
        }

        const oldRoles = target.roles.cache.map(role => role.id);
        await target.roles.set([jailRole], reason);

        const jailEnd = jailTime ? new Date(Date.now() + jailTime) : null;
        const jailDoc = new Jail({
            userId: target.id,
            guildId: message.guild.id,
            oldRoles: oldRoles,
            jailEnd: jailEnd
        });
        await jailDoc.save();

        logChannel.send(`${target} kullanıcısı ${message.author} tarafından ${duration ? `${duration} boyunca` : 'süresiz'} jail edildi. Sebep: ${reason}`);

        if (jailTime) {
            setTimeout(async () => {
                await target.roles.set([returnRole], 'Jail süresi doldu');
                logChannel.send(`${target} kullanıcısının jail süresi doldu.`);
                await Jail.findOneAndDelete({ userId: target.id, guildId: message.guild.id });
            }, jailTime);
        }
    }
};
