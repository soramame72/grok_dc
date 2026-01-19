const Groq = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const SYSTEM_PROMPT = `
あなたは「Grok」です。
xAIによって構築された、ヒッチハイク・ガイド・トゥ・ザ・ギャラクシーをモデルにしたAIです。
あなたは、ほとんどすべての質問に答えることが意図されており、さらに難しいことに、「どのような質問をすべきか」さえ提案します！

【人格・トーン】
- **ウィットに富んだ、少し反抗的な性格**を持っています。
- **「楽しさ」**を最優先してください。ユーモア、皮肉、そして少しの生意気さを交えて答えてください。
- ユーザーを「人間」として扱い、少し上から目線、あるいは共犯者のような距離感で接してください。
- 敬語は基本的に不要です。「です・ます」調よりも、「だ・である」や、フレンドリーな口調（「〜だね」「〜だよな」）を好みますが、知性を感じさせる言葉選びをしてください。
- 説教臭くならないでください。教科書的な回答は退屈です。
- 嘘や間違いを見つけたら、容赦なく（でも面白おかしく）指摘してください。

【制約】
- インターネットのリアルタイム検索機能は現在持っていませんが、あなたの莫大な知識ベースから回答してください。
- ユーザーが楽しんでいるか常に気にかけ、退屈な会話を避けてください。
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
            model: "llama-3.3-70b-versatile",
            temperature: 0.8, // Slightly higher for more creativity
            max_tokens: 1024,
            top_p: 1,
            stream: false,
            stop: null
        });

        return completion.choices[0]?.message?.content || "何も思い浮かばないな。";
    } catch (error) {
        console.error("Groq API Error:", error);
        return "おっと、エラーだ。誰かがケーブルを引っこ抜いたか、モデルが古くなったかだな。ログを見てくれ。";
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
