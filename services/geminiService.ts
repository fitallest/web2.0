
import { GoogleGenAI, Type } from "@google/genai";

// Ensure the API key is available from environment variables
const apiKey = process.env.API_KEY;

if (!apiKey) {
    console.error("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

interface AIContentResult {
    slogans: string[];
    seoDescription: string;
}

export const generateSloganAndDescription = async (brandName: string, industry: string): Promise<AIContentResult> => {
    if (!apiKey) {
        throw new Error("API Key is not configured.");
    }

    const prompt = `Bạn là chuyên gia Copywriter và Marketing hàng đầu. Hãy tạo nội dung sáng tạo cho thương hiệu: "${brandName}" hoạt động trong lĩnh vực: "${industry}".
    Yêu cầu đầu ra phải là một chuỗi JSON hợp lệ, không chứa ký tự markdown (như \`\`\`json) hoặc bất kỳ văn bản nào khác ngoài JSON.
    Cấu trúc JSON phải chính xác như sau:
    {
        "slogans": [
            "Slogan 1 (kèm 1 emoji phù hợp)",
            "Slogan 2 (kèm 1 emoji phù hợp)",
            "Slogan 3 (kèm 1 emoji phù hợp)"
        ],
        "seoDescription": "Một đoạn mô tả website chuẩn SEO hấp dẫn, khoảng 50-60 từ, chứa tên thương hiệu và từ khóa lĩnh vực."
    }`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        slogans: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "An array of 3 creative slogans for the brand."
                        },
                        seoDescription: {
                            type: Type.STRING,
                            description: "An SEO-friendly description for the website, around 50-60 words."
                        }
                    },
                    required: ["slogans", "seoDescription"]
                }
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText) as AIContentResult;
        return result;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate content from AI. Please check the console for details.");
    }
};
