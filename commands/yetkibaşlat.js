module.exports = {
    name: 'yetkibaslat',
    description: 'Belirtilen kullanıcıya yetki rolü verir.',
    async execute(message, args) {
        // Komutu kullanmak için gereken rol
        const requiredRole = 'Moderator'; // Değiştirin: İzin verilen rol adı
        const roleToAssign = 'Yetkili'; // Değiştirin: Verilecek rol adı
        const logChannelName = 'log-kanalı'; // Değiştirin: Log kanalının adı

        // Kullanıcının yeterli izne sahip olup olmadığını kontrol et
        if (!message.member.roles.cache.some(role => role.name === requiredRole) && !message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('Bu komutu kullanmak için yetkiniz yok.');
        }

        // Rol verilecek kullanıcıyı belirle
        const target = message.mentions.members.first();
        if (!target) {
            return message.reply('Lütfen rol verilecek kullanıcıyı belirtin.');
        }

        // Verilecek rolü bul
        const role = message.guild.roles.cache.find(r => r.name === roleToAssign);
        if (!role) {
            return message.reply('Verilecek rol bulunamadı.');
        }

        // Log kanalını bul
        const logChannel = message.guild.channels.cache.find(channel => channel.name === logChannelName);
        if (!logChannel) {
            return message.reply('Log kanalı bulunamadı.');
        }

        // Kullanıcıya rolü ver
        try {
            await target.roles.add(role);
            message.reply(`${target.user.tag} kullanıcısına ${role.name} rolü başarıyla verildi.`);
            logChannel.send(`${message.author.tag}, ${target.user.tag} kullanıcısına ${role.name} rolünü verdi.`);
        } catch (error) {
            console.error(error);
            message.reply('Kullanıcıya rol verirken bir hata oluştu.');
        }
    }
};
