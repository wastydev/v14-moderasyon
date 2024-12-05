const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'yetkicek',
    description: 'Belirtilen kullanıcıdan belirli bir rol ve üstündeki tüm rolleri alır.',
    async execute(message, args) {
        // Komutu kullanmak için gereken rol
        const requiredRole = ''; // Değiştirin: İzin verilen rol adı
        const roleToRemove = ''; // Değiştirin: Alınacak en düşük rol adı
        const logChannelName = ''; // Değiştirin: Log kanalının adı

        // Kullanıcının yeterli izne sahip olup olmadığını kontrol et
        if (!message.member.roles.cache.some(role => role.name === requiredRole) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('#FF0000').setTitle('Yetkisiz Erişim').setDescription('Bu komutu kullanmak için yeterli yetkiniz yok.')] });
        }

        // Rol alınacak kullanıcıyı belirle
        const target = message.mentions.members.first();
        if (!target) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('#FF0000').setTitle('Hata!').setDescription('Lütfen rol alınacak kullanıcıyı belirtin.')] });
        }

        // Alınacak rolü bul
        const role = message.guild.roles.cache.find(r => r.name === roleToRemove);
        if (!role) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('#FF0000').setTitle('Hata!').setDescription('Alınacak rol bulunamadı.')] });
        }

        // Kullanıcının rollerini kontrol et ve üstündeki rolleri al
        const rolesToRemove = target.roles.cache.filter(r => r.position >= role.position);
        if (rolesToRemove.size === 0) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('#FF0000').setTitle('Hata!').setDescription('Bu kullanıcıda belirtilen rol veya üstünde rol bulunmuyor.')] });
        }

        // Log kanalını bul
        const logChannel = message.guild.channels.cache.find(channel => channel.name === logChannelName);
        if (!logChannel) {
            return message.reply({ embeds: [new EmbedBuilder().setColor('#FF0000').setTitle('Hata!').setDescription('Log kanalı bulunamadı.')] });
        }

        // Kullanıcıdan rolleri al
        try {
            await target.roles.remove(rolesToRemove);
            
            // Başarılı mesajı
            message.reply({ embeds: [new EmbedBuilder().setColor('#00FF00').setTitle('Başarılı!').setDescription(`${target.user.tag} kullanıcısından ${rolesToRemove.map(r => r.name).join(', ')} rolleri başarıyla alındı.`)] });

            // Log mesajı
            logChannel.send({ embeds: [new EmbedBuilder().setColor('#FFFF00').setTitle('Rol Alındı').setDescription(`${message.author.tag}, ${target.user.tag} kullanıcısından ${rolesToRemove.map(r => r.name).join(', ')} rolleri aldı.`)] });
        } catch (error) {
            console.error(error);
            message.reply({ embeds: [new EmbedBuilder().setColor('#FF0000').setTitle('Hata!').setDescription('Kullanıcıdan rol alırken bir hata oluştu.')] });
        }
    }
};
