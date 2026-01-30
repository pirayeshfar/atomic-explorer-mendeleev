
import { GoogleGenAI } from "@google/genai";

export async function getElementFunFact(elementName: string, persianName: string) {
  // دسترسی مستقیم به متغیر محیطی طبق دستورالعمل
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "undefined") {
    console.error("API Key is missing in process.env");
    return "لطفاً در پنل Vercel، متغیر API_KEY را در بخش Environment Variables تعریف کرده و دوباره پروژه را Deploy کنید.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `یک فکت علمی جالب و کوتاه (حداکثر دو جمله) درباره عنصر ${persianName} (${elementName}) برای دانش‌آموزان کلاس نهم به زبان فارسی بنویس. لحن صمیمی و جذاب باشد.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "هوش مصنوعی در حال حاضر در دسترس نیست، اما این عنصر یکی از آجرهای سازنده جهان ماست!";
  }
}
