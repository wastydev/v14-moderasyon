module.exports = {
    name: 'yetkilisay',
    description: 'Belirli bir roldeki kullanıcıları sayar ve çevrimiçi/çevrimdışı durumlarını kontrol eder.',
    async execute(message, args) {
        // Rol adı argüman olarak veriliyor
        const roleName = args[0];

        // Eğer rol adı verilmemişse, hata mesajı göster
        if (!roleName) {
            return message.reply('Lütfen bir rol adı belirtin.');
        }

        // Rolü bul
        const role = message.guild.roles.cache.find(role => role.name === roleName);
        if (!role) {
            return message.reply('Belirtilen rol bulunamadı.');
        }

        // Roldeki üyeleri al
        const membersWithRole = role.members;

        // Çevrimiçi ve çevrimdışı üyeleri ayır
        const onlineMembers = membersWithRole.filter(member => member.presence && member.presence.status !== 'offline');
        const offlineMembers = membersWithRole.filter(member => !member.presence || member.presence.status === 'offline');

        // Sonuçları gönder
        message.channel.send(`
**${roleName} rolündeki toplam üye sayısı:** ${membersWithRole.size}
**Çevrimiçi üye sayısı:** ${onlineMembers.size}
**Çevrimdışı üye sayısı:** ${offlineMembers.size}
**Çevrimiçi olmayan üyeler:** ${offlineMembers.map(member => member).join(', ')}
        `);
    }
};