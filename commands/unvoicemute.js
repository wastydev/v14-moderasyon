module.exports = {
    name: 'unvmute',
    description: 'Belirtilen kullanıcının sesli mutesini kaldırır.',
    async execute(message, args) {
        // Komutu kullanmak için gereken rol
        const requiredRole = 'Moderator'; // Değiştirin: İzin verilen rol adı

        // Kullanıcının yeterli izne sahip olup olmadığını kontrol et
        if (!message.member.roles.cache.some(role => role.name === requiredRole) && !message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('Bu komutu kullanmak için yetkiniz yok.');
        }

        // Unvoicemute edilecek kullanıcıyı belirle
        const target = message.mentions.members.first();
        if (!target) {
            return message.reply('Lütfen unvoicemute edilecek kullanıcıyı belirtin.');
        }

        // Sebebi belirle
        const reason = args.slice(1).join(' ') || 'Belirtilmemiş';

        // Log kanalını bul
        const logChannel = message.guild.channels.cache.find(channel => channel.name === 'log-kanalı');
        if (!logChannel) {
            return message.reply('Log kanalı bulunamadı.');
        }

        // Kullanıcıdan sesli mute'yi kaldır
        if (target.voice.serverMute) {
            try {
                await target.voice.setMute(false, reason);
                logChannel.send(`${target.user.tag} kullanıcısının sesli mutesi ${message.author.tag} tarafından kaldırıldı. Sebep: ${reason}`);
                message.reply(`${target.user.tag} kullanıcısının sesli mutesi başarıyla kaldırıldı.`);
            } catch (error) {
                console.error(error);
                message.reply('Kullanıcının sesli mutesini kaldırırken bir hata oluştu.');
            }
        } else {
            message.reply('Bu kullanıcı sesli olarak mute durumda değil.');
        }
    }
};
