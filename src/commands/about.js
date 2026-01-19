const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Grokについて'),
    async execute(interaction) {
        await interaction.reply({
            content: "俺はGrok。X (旧Twitter) で話題のAI…の、まあ、親戚みたいなもんだな。\nユーモアと少しの皮肉を交えて、あんたの質問に答える。\n\nCreated with Groq API.",
            ephemeral: true
        });
    },
};
