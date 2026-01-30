
import { GoogleGenAI } from "@google/genai";

/**
 * سرویس هوشمند برای دریافت دانستنی‌های عناصر
 */
export async function getElementFunFact(elementName: string, persianName: string) {
  try {
    // استفاده مستقیم طبق راهنمای SDK
    const apiKey = process.env.API_KEY;

    if (!apiKey || apiKey === "undefined") {
      return "⚠️ کلید شناسایی نشد. لطفاً در پنل Vercel گزینه Redeploy را بزنید.";
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `یک فکت علمی بسیار کوتاه و جذاب درباره عنصر "${persianName}" برای دانش‌آموز نهم بنویس.`,
      config: {
        systemInstruction: "پاسخ فقط به زبان فارسی، علمی و حداکثر ۱۲ کلمه باشد.",
        temperature: 0.8,
      }
    });

    if (response && response.text) {
      return response.text.trim();
    }
    
    return "در حال حاضر اطلاعاتی در دسترس نیست.";
    
  } catch (error: any) {
    console.error("Gemini Error:", error);
    
    if (error.message?.includes("API key not valid") || error.status === 401) {
      return "❌ کلید API معتبر نیست. لطفاً در گوگل استودیو کلید جدید بسازید.";
    }
    
    return "اتصال به شبکه هوشمند برقرار نشد. لطفاً Redeploy کنید یا اینترنت را چک کنید.";
  }
}
