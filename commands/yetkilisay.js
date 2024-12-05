module.exports = {
    name: 'yetkilisay',
    description: 'Belirli bir roldeki kullanıcıları sayar ve aktif/sesteki yetkili durumlarını kontrol eder.',
    async execute(message, args) {
        // Burada rol ID'si belirleyeceğiz, direkt olarak koda yazılacak
        const roleId = '1207378125491539998'; // Buraya belirtilen rolün ID'sini yazın

        // Kullanıcının yeterli yetkiye sahip olup olmadığını kontrol et (örneğin, Admin rolü)
        const requiredRole = 'Shareholder'; // Değiştirin: Yönetici rolü adı
        if (!message.member.roles.cache.some(role => role.name === requiredRole) && !message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('Bu komutu kullanmak için yeterli yetkiye sahip değilsiniz.');
        }

        // Rolü ID'ye göre bul
        const role = message.guild.roles.cache.get(roleId);
        if (!role) {
            return message.reply('Belirtilen rol bulunamadı.');
        }

        // Roldeki üyeleri al
        const membersWithRole = role.members;

        // Çevrimiçi ve çevrimdışı üyeleri ayır
        const onlineMembers = membersWithRole.filter(member => member.presence?.status !== 'offline');
        const offlineMembers = membersWithRole.filter(member => !member.presence || member.presence.status === 'offline');

        // Seste bulunan üyeleri al
        const membersInVoice = membersWithRole.filter(member => member.voice.channel);

        // Embed mesajını oluştur
        const resultEmbed = {
            color: 0x00FF00, // Renk değerini hexadecimal formatta sayı olarak belirledik.
            title: `**${role.name}** Rolündeki Yetkililer`,
            fields: [
                { name: 'Yetkili Sayısı', value: membersWithRole.size.toString(), inline: true },
                { name: 'Aktif Yetkili Sayısı (Çevrimiçi)', value: onlineMembers.size.toString(), inline: true },
                { name: 'Sesteki Yetkili Sayısı', value: membersInVoice.size.toString(), inline: true },
            ],
            timestamp: new Date(),
        };

        message.channel.send({ embeds: [resultEmbed] });
    }
};
