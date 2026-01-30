
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getElementFunFact(elementName: string, persianName: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `یک فکت علمی جالب و کوتاه (حداکثر دو جمله) درباره عنصر ${persianName} (${elementName}) برای دانش‌آموزان کلاس نهم به زبان فارسی بنویس. لحن صمیمی و جذاب باشد.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching fun fact:", error);
    return "اتصالی به دنیای اتم‌ها برقرار نشد! اما این عنصر بسیار شگفت‌انگیز است.";
  }
}
