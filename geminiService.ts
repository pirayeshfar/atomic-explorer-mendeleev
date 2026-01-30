
import { GoogleGenAI } from "@google/genai";

export async function getElementFunFact(elementName: string, persianName: string) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `یک فکت علمی جالب، کوتاه و بسیار شگفت‌انگیز درباره عنصر ${persianName} برای دانش‌آموز کلاس نهم بنویس. حداکثر در ۲ جمله و با لحن جذاب.`,
    });
    
    if (response && response.text) {
      return response.text;
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("Gemini API Error:", error);
    // بازگشت متن پیش‌فرض فقط در صورت قطع کامل اینترنت یا نبود کلید API
    return "این عنصر یکی از اسرارآمیزترین بخش‌های جدول تناوبی است که در فناوری‌های مدرن کاربرد حیاتی دارد!";
  }
}
