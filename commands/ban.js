module.exports = {
    name: 'ban',
    description: 'Belirtilen kullanıcıyı sunucudan banlar.',
    async execute(message, args) {
        // Komutu kullanmak için gereken rol
        const requiredRole = 'Moderator'; // Değiştirin: İzin verilen rol adı

        // Kullanıcının yeterli izne sahip olup olmadığını kontrol et
        if (!message.member.roles.cache.some(role => role.name === requiredRole) && !message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('Bu komutu kullanmak için yetkiniz yok.');
        }

        // Banlanacak kullanıcıyı belirle
        const target = message.mentions.members.first();
        if (!target) {
            return message.reply('Lütfen banlanacak kullanıcıyı belirtin.');
        }

        // Sebebi belirle
        const reason = args.slice(1).join(' ') || 'Belirtilmemiş';

        // Log kanalını bul
        const logChannel = message.guild.channels.cache.find(channel => channel.name === 'log-kanalı');
        if (!logChannel) {
            return message.reply('Log kanalı bulunamadı.');
        }

        // Kullanıcıyı banla
        try {
            await target.ban({ reason });
            logChannel.send(`${target.user.tag} kullanıcısı ${message.author.tag} tarafından banlandı. Sebep: ${reason}`);
            message.reply(`${target.user.tag} kullanıcısı başarıyla banlandı.`);
        } catch (error) {
            console.error(error);
            message.reply('Kullanıcıyı banlarken bir hata oluştu.');
        }
    }
};
