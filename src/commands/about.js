const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Grokについて'),
    async execute(interaction) {
        await interaction.reply({
            content: "私はGrok。\nversion: 1.3.4\nProduced by soramame72\n\nCreated with Groq API.",
            ephemeral: true
        });
    },
};
