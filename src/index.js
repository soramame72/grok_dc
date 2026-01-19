const { Client, GatewayIntentBits, Collection, REST, Routes, ApplicationCommandType, ActivityType } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { getGrokResponse, factCheck, summarize } = require('./lib/ai');
const { startServer } = require('./web/server');
const axios = require('axios');

require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

client.commands = new Collection();

// Validate Environment Variables
const requiredEnv = ['DISCORD_BOT_TOKEN', 'GROQ_API_KEY'];
const missingEnv = requiredEnv.filter(key => !process.env[key]);
if (missingEnv.length > 0) {
    console.error(`Missing environment variables: ${missingEnv.join(', ')}`);
    // Ideally exit, but for Render log visibility we might want to stay alive briefly or just crash
    // process.exit(1); 
}

// Load Slash Commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const commands = [];

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
    }
}

// Context Menu Commands
const contextCommands = [
    {
        name: 'Grok: Fact Check',
        type: ApplicationCommandType.Message
    },
    {
        name: 'Grok: Summarize',
        type: ApplicationCommandType.Message
    }
];

contextCommands.forEach(cmd => commands.push(cmd));

const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN);

async function registerCommands() {
    try {
        console.log('Started refreshing application (/) commands.');
        // Register global commands
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setActivity('X (旧Twitter)', { type: ActivityType.Watching });

    // Register commands if token is present
    if (process.env.DISCORD_BOT_TOKEN) {
        await registerCommands();
    }

    // Keep-alive Logic for Render Free Tier
    // Pings itself every 10 minutes
    const RENDER_EXTERNAL_URL = process.env.RENDER_EXTERNAL_URL; // Render automatically sets this
    if (RENDER_EXTERNAL_URL) {
        setInterval(() => {
            axios.get(RENDER_EXTERNAL_URL)
                .then(() => console.log('Keep-alive ping successful'))
                .catch(err => console.error('Keep-alive ping failed', err.message));
        }, 10 * 60 * 1000); // 10 minutes
    }
});

client.on('interactionCreate', async interaction => {
    // Handle Slash Commands
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'コマンド実行中にエラーが発生したぜ。', ephemeral: true });
            } else {
                await interaction.reply({ content: 'コマンド実行中にエラーが発生したぜ。', ephemeral: true });
            }
        }
    }
    // Handle Context Menu Commands
    else if (interaction.isMessageContextMenuCommand()) {
        const targetMessage = interaction.targetMessage;
        const text = targetMessage.content;

        if (!text) {
            await interaction.reply({ content: "テキストがないメッセージは処理できないぜ。", ephemeral: true });
            return;
        }

        await interaction.deferReply(); // AI might take time

        try {
            let response;
            if (interaction.commandName === 'Grok: Fact Check') {
                response = await factCheck(text);
            } else if (interaction.commandName === 'Grok: Summarize') {
                response = await summarize(text);
            }

            await interaction.editReply(response);

        } catch (error) {
            console.error(error);
            await interaction.editReply("エラーだ。調子が悪いみたいだ。");
        }
    }
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    if (client.user && message.mentions.has(client.user)) {
        const content = message.content.replace(/<@!?[0-9]+>/, '').trim();

        if (!content) {
            await message.reply("なんだい？");
            return;
        }

        await message.channel.sendTyping();

        try {
            // Check for keyword triggers within mention
            if (content.startsWith("ファクトチェック")) {
                const targetText = content.replace("ファクトチェック", "").trim();
                const response = targetText ? await factCheck(targetText) : "ファクトチェックするテキストをくれよ。";
                await message.reply(response);
            }
            else if (content.startsWith("要約して")) {
                const targetText = content.replace("要約して", "").trim();
                // If empty, check for reply reference
                if (!targetText && message.reference) {
                    const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);
                    if (repliedMessage.content) {
                        const response = await summarize(repliedMessage.content);
                        await message.reply(response);
                        return;
                    }
                }
                const response = targetText ? await summarize(targetText) : "要約するテキストがないぞ。";
                await message.reply(response);
            }
            else {
                // Normal Chat
                const messages = [{ role: "user", content: content }];
                const response = await getGrokResponse(messages);
                await message.reply(response);
            }
        } catch (error) {
            console.error(error);
            await message.reply("エラーだ。すまないな。");
        }
    }
});

// Start Web Server
startServer();

// Start Bot
if (process.env.DISCORD_BOT_TOKEN) {
    client.login(process.env.DISCORD_BOT_TOKEN);
} else {
    console.log("No DISCORD_BOT_TOKEN found. Only starting web server.");
}
