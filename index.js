const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const express = require('express');
const fetch = require('node-fetch');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;
const app = express();

app.use(express.json());

let whitelist = [];

// load file
function load() {
    if (fs.existsSync('whitelist.json')) {
        whitelist = JSON.parse(fs.readFileSync('whitelist.json'));
    }
}

// save file
function save() {
    fs.writeFileSync('whitelist.json', JSON.stringify(whitelist, null, 2));
}

// check roblox user tồn tại
async function checkRobloxUser(username) {
    try {
        const res = await fetch(`https://users.roblox.com/v1/usernames/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                usernames: [username],
                excludeBannedUsers: true
            })
        });

        const data = await res.json();
        return data.data.length > 0;
    } catch (err) {
        return false;
    }
}

// discord ready
client.on('ready', () => {
    console.log(`Bot login: ${client.user.tag}`);
    load();
});

// command
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const username = interaction.options.getString('username');

    if (interaction.commandName === 'whitelist') {

        const exists = await checkRobloxUser(username);

        if (!exists) {
            return interaction.reply("❌ User Roblox không tồn tại");
        }

        if (!whitelist.includes(username.toLowerCase())) {
            whitelist.push(username.toLowerCase());
            save();
            return interaction.reply(`✅ Đã whitelist ${username}`);
        } else {
            return interaction.reply("⚠️ Đã có rồi");
        }
    }
});


// ===== WEBHOOK API =====
app.post('/check-whitelist', (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.json({ allowed: false });
    }

    const allowed = whitelist.includes(username.toLowerCase());

    res.json({
        allowed: allowed
    });
});


// chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Webhook running...");
});

// login bot
client.login(TOKEN);