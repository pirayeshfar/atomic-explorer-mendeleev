
import { GoogleGenAI } from "@google/genai";

export async function getElementFunFact(elementName: string, persianName: string) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `یک فکت علمی جالب و کوتاه (حداکثر دو جمله) درباره عنصر ${persianName} (${elementName}) برای دانش‌آموزان کلاس نهم به زبان فارسی بنویس. لحن صمیمی و جذاب باشد.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "این عنصر یکی از شگفت‌انگیزترین آجرهای سازنده جهان ماست که خواص منحصر به فردی در شیمی دارد!";
  }
}
