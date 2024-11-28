const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'toplanti',
    description: 'Belirli roldeki kullanıcıları belirtilen ses kanalına çeker ve seste olmayanları bildirir',
    async execute(message, args) {
        const roleId = 'ROLE_ID'; // Belirli rolün ID'si
        const voiceChannelId = 'VOICE_CHANNEL_ID'; // Hedef ses kanalının ID'si

        // Komutu kullanmak için gerekli yetkileri kontrol et
        if (!message.member.permissions.has(PermissionsBitField.Flags.MoveMembers)) {
            return message.reply('Bu komutu kullanmak için yeterli yetkiye sahip değilsiniz.');
        }

        const role = message.guild.roles.cache.get(roleId);
        if (!role) {
            return message.reply('Belirtilen rol bulunamadı.');
        }

        const voiceChannel = message.guild.channels.cache.get(voiceChannelId);
        if (!voiceChannel || voiceChannel.type !== 'GUILD_VOICE') {
            return message.reply('Belirtilen ses kanalı bulunamadı veya geçerli değil.');
        }

        const membersToMove = role.members.filter(member => member.voice.channel && member.voice.channel.id !== voiceChannelId);
        const membersNotInVoice = role.members.filter(member => !member.voice.channel);

        // Ses kanalına taşınacak üyeleri taşı
        for (const [memberId, member] of membersToMove) {
            await member.voice.setChannel(voiceChannelId);
        }

        // Seste olmayan üyeleri bildir
        if (membersNotInVoice.size > 0) {
            const notInVoiceList = membersNotInVoice.map(member => member.user.tag).join('\n');
            message.channel.send(`Seste olmayan kullanıcılar:\n${notInVoiceList}`);
        } else {
            message.channel.send('Tüm kullanıcılar zaten seste.');
        }
    }
};
