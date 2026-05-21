const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const TOKEN = process.env.TOKEN;
const CLIENT_ID = "1506964509275852872";

const commands = [
    new SlashCommandBuilder()
        .setName('whitelist')
        .setDescription('Whitelist user')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Tên Roblox')
                .setRequired(true)),

    new SlashCommandBuilder()
        .setName('unwhitelist')
        .setDescription('Remove whitelist')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Tên Roblox')
                .setRequired(true))
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    await rest.put(
        Routes.applicationCommands(CLIENT_ID),
        { body: commands }
    );
    console.log("Đã tạo lệnh");
})();