const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', async () => {
    console.log(`Bot ${client.user.tag} olarak giriş yaptı!`);
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('MongoDB bağlantısı başarılı!');
});

client.on('messageCreate', async message => {
    if (!message.content.startsWith('.') || message.author.bot) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        await command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('Bu komutu çalıştırırken bir hata oluştu.');
    }
});

client.on('guildMemberAdd', async member => {
    const muteDoc = await Mute.findOne({ userId: member.id, guildId: member.guild.id });
    if (muteDoc && muteDoc.muteEnd > new Date()) {
        const muteRole = member.guild.roles.cache.find(role => role.name === 'Muted');
        if (muteRole) {
            await member.roles.add(muteRole, 'Sunucuya yeniden katıldığında mute durumu devam ediyor');
        }
        if (member.voice.channel) {
            member.voice.setMute(true, 'Sunucuya yeniden katıldığında mute durumu devam ediyor');
        }
    }
});

client.on('guildMemberAdd', async member => {
    const jailDoc = await Jail.findOne({ userId: member.id, guildId: member.guild.id });
    if (jailDoc && (!jailDoc.jailEnd || jailDoc.jailEnd > new Date())) {
        const jailRole = member.guild.roles.cache.find(role => role.name === 'Jail');
        if (jailRole) {
            await member.roles.add(jailRole, 'Sunucuya yeniden katıldığında jail durumu devam ediyor');
        }
    }
});

client.login(process.env.TOKEN);
