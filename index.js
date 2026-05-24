const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;

let whitelist = [];

if (fs.existsSync('whitelist.json')) {
    whitelist = JSON.parse(fs.readFileSync('whitelist.json'));
}

function save() {
    fs.writeFileSync('whitelist.json', JSON.stringify(whitelist, null, 2));
}

client.on('ready', () => {
    console.log(`Bot online: ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const username = interaction.options.getString('username');

    if (interaction.commandName === 'whitelist') {
        if (!whitelist.includes(username)) {
            whitelist.push(username);
            save();
            await interaction.reply(`✅ Whitelisted ${username}`);
        } else {
            await interaction.reply(`⚠️ Đã có rồi`);
        }
    }

    if (interaction.commandName === 'unwhitelist') {
        whitelist = whitelist.filter(u => u !== username);
        save();
        await interaction.reply(`❌ Removed ${username}`);
    }
});

client.login(TOKEN);