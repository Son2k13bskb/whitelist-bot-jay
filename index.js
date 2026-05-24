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

// 🔥 thêm cái này
async function checkRobloxUser(username) {
    try {
        const res = await fetch("https://users.roblox.com/v1/usernames/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                usernames: [username],
                excludeBannedUsers: false
            })
        });

        const data = await res.json();
        return data.data && data.data.length > 0;
    } catch (err) {
        console.error(err);
        return false;
    }
}

client.on('ready', () => {
    console.log(`Bot online: ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const username = interaction.options.getString('username');

    if (interaction.commandName === 'whitelist') {

        const exists = await checkRobloxUser(username);

        if (!exists) {
            return interaction.reply(`❌ User Roblox không tồn tại`);
        }

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