module.exports = {
    name: 'unmute',
    description: 'Belirtilen kullanıcının mute rolünü kaldırır.',
    async execute(message, args) {
        // Komutu kullanmak için gereken rol
        const requiredRole = 'Moderator'; // Değiştirin: İzin verilen rol adı

        // Kullanıcının yeterli izne sahip olup olmadığını kontrol et
        if (!message.member.roles.cache.some(role => role.name === requiredRole) && !message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('Bu komutu kullanmak için yetkiniz yok.');
        }

        // Unmute edilecek kullanıcıyı belirle
        const target = message.mentions.members.first();
        if (!target) {
            return message.reply('Lütfen unmute edilecek kullanıcıyı belirtin.');
        }

        // Sebebi belirle
        const reason = args.slice(1).join(' ') || 'Belirtilmemiş';

        // Mute rolünü bul
        const muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');
        if (!muteRole) {
            return message.reply('Mute rolü bulunamadı.');
        }

        // Log kanalını bul
        const logChannel = message.guild.channels.cache.find(channel => channel.name === 'log-kanalı');
        if (!logChannel) {
            return message.reply('Log kanalı bulunamadı.');
        }

        // Kullanıcıdan mute rolünü kaldır
        if (target.roles.cache.has(muteRole.id)) {
            try {
                await target.roles.remove(muteRole, reason);
                logChannel.send(`${target.user.tag} kullanıcısının mute rolü ${message.author.tag} tarafından kaldırıldı. Sebep: ${reason}`);
                message.reply(`${target.user.tag} kullanıcısının mute rolü başarıyla kaldırıldı.`);
            } catch (error) {
                console.error(error);
                message.reply('Kullanıcının mute rolünü kaldırırken bir hata oluştu.');
            }
        } else {
            message.reply('Bu kullanıcıda mute rolü bulunmuyor.');
        }
    }
};
