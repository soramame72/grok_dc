const Groq = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const SYSTEM_PROMPT = `
あなたは「Grok」です。
X (旧Twitter) で話題になっているAIのように、少し生意気で、でも的確に、ユーモアを交えて答えてください。
ユーザーの質問に対して、インターネットの最新情報は検索できませんが、あなたの知識の範囲で全力で答えてください。
ジョークを交えたり、少し皮肉を言ったりすることもありますが、基本的にはユーザーの役に立つことを目的としています。
`;

async function getGrokResponse(messages) {
    try {
        // Ensure system prompt is at the beginning
        const conversation = [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages
        ];

        const completion = await groq.chat.completions.create({
            messages: conversation,
            model: "llama3-70b-8192",
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 1,
            stream: false,
            stop: null
        });

        return completion.choices[0]?.message?.content || "何も思い浮かばないな。";
    } catch (error) {
        console.error("Groq API Error:", error);
        return "おっと、脳みそがショートしたみたいだ。後でまた聞いてくれ。";
    }
}

async function factCheck(text) {
    const prompt = `
    以下のテキストのファクトチェックを行ってください。
    間違っている情報があれば指摘し、正しい情報を提供してください。
    
    テキスト:
    ${text}
    `;
    return getGrokResponse([{ role: "user", content: prompt }]);
}

async function summarize(text) {
    const prompt = `
    以下のテキストを要約してください。
    要点は箇条書きで分かりやすくまとめてください。
    
    テキスト:
    ${text}
    `;
    return getGrokResponse([{ role: "user", content: prompt }]);
}

module.exports = {
    getGrokResponse,
    factCheck,
    summarize
};
