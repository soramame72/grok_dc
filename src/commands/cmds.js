const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cmds')
        .setDescription('利用可能なコマンド一覧を表示'),
    async execute(interaction) {
        const helpText = `
**Grok コマンド一覧**

🤖 **チャット**
\`@grok [テキスト]\`: メンションを送ると答えます。

🛠 **スラッシュコマンド**
\`/about\`: 俺について
\`/cmds\`: このヘルプを表示

🖱 **右クリック (Apps)**
メッセージを右クリック -> アプリ
- \`Grok: Fact Check\`: そのメッセージをファクトチェック
- \`Grok: Summarize\`: そのメッセージを要約
        `;
        await interaction.reply({ content: helpText, ephemeral: true });
    },
};
