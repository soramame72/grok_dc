const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cmds')
        .setDescription('利用可能なコマンド一覧を表示'),
    async execute(interaction) {
        const helpText = `
**Grok コマンド一覧**

🤖 **チャット**
\`@grok [テキスト]\`: メンションを送ると答えます

🖼️ **画像分析・編集**
\`@grok [指示]\` + 画像添付: 画像を分析・編集します
例: 「この画像を説明して」「最悪のロゴを消して」

🛠 **スラッシュコマンド**
\`/about\`: Grokについて
\`/cmds\`: このヘルプを表示

🖱 **右クリック (Apps)**
メッセージを右クリック → アプリ
- \`Grok: Fact Check\`: メッセージをファクトチェック
- \`Grok: Summarize\`: メッセージを要約

💡 **ヒント**
- メッセージに返信して \`@grok ファクトチェック\` や \`@grok 要約して\` とすると、そのメッセージを処理します
        `;
        await interaction.reply({ content: helpText, ephemeral: true });
    },
};
