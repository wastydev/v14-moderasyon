module.exports = {
    name: 'yetkicek',
    description: 'Belirtilen kullanıcıdan belirli bir rol ve üstündeki tüm rolleri alır.',
    async execute(message, args) {
        // Komutu kullanmak için gereken rol
        const requiredRole = 'Moderator'; // Değiştirin: İzin verilen rol adı
        const roleToRemove = 'Yetkili'; // Değiştirin: Alınacak en düşük rol adı
        const logChannelName = 'log-kanalı'; // Değiştirin: Log kanalının adı

        // Kullanıcının yeterli izne sahip olup olmadığını kontrol et
        if (!message.member.roles.cache.some(role => role.name === requiredRole) && !message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('Bu komutu kullanmak için yetkiniz yok.');
        }

        // Rol alınacak kullanıcıyı belirle
        const target = message.mentions.members.first();
        if (!target) {
            return message.reply('Lütfen rol alınacak kullanıcıyı belirtin.');
        }

        // Alınacak rolü bul
        const role = message.guild.roles.cache.find(r => r.name === roleToRemove);
        if (!role) {
            return message.reply('Alınacak rol bulunamadı.');
        }

        // Kullanıcının rollerini kontrol et ve üstündeki rolleri al
        const rolesToRemove = target.roles.cache.filter(r => r.position >= role.position);
        if (rolesToRemove.size === 0) {
            return message.reply('Bu kullanıcıda belirtilen rol veya üstünde rol bulunmuyor.');
        }

        // Log kanalını bul
        const logChannel = message.guild.channels.cache.find(channel => channel.name === logChannelName);
        if (!logChannel) {
            return message.reply('Log kanalı bulunamadı.');
        }

        // Kullanıcıdan rolleri al
        try {
            await target.roles.remove(rolesToRemove);
            message.reply(`${target.user.tag} kullanıcısından ${rolesToRemove.map(r => r.name).join(', ')} rolleri başarıyla alındı.`);
            logChannel.send(`${message.author.tag}, ${target.user.tag} kullanıcısından ${rolesToRemove.map(r => r.name).join(', ')} rolleri aldı.`);
        } catch (error) {
            console.error(error);
            message.reply('Kullanıcıdan rol alırken bir hata oluştu.');
        }
    }
};
