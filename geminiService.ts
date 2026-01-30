
import { GoogleGenAI } from "@google/genai";

/**
 * دریافت مستقیم دانستنی‌های علمی از هوش مصنوعی جمینای
 */
export async function getElementFunFact(elementName: string, persianName: string) {
  try {
    // مقداردهی مستقیم طبق دستورالعمل SDK
    // این بخش در زمان Build توسط Vercel جایگزین می‌شود
    const ai = new GoogleGenAI({ 
      apiKey: process.env.API_KEY 
    });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `یک فکت علمی بسیار کوتاه، جذاب و آموزنده درباره عنصر "${persianName}" بنویس.`,
      config: {
        systemInstruction: "شما یک دستیار آزمایشگاه علوم هستید. پاسخ باید فقط به زبان فارسی، علمی و حداکثر در ۱۰ کلمه باشد. از کلمات تشویقی برای دانش‌آموزان استفاده کن.",
        temperature: 0.8,
      }
    });

    // استخراج متن مستقیم از پاسخ
    if (response && response.text) {
      return response.text.trim();
    }
    
    return "ذره‌ای از هستی که منتظر کشف توست!";
    
  } catch (error: any) {
    // لاگ کردن خطا در کنسول برای عیب‌یابی فنی (فقط برای توسعه‌دهنده)
    console.error("Gemini Connection Status:", error);
    
    // نمایش پیام ملایم به کاربر در صورت بروز هرگونه مشکل ارتباطی
    return "در حال تحلیل اتمی... (لطفاً لحظاتی دیگر دوباره روی عنصر کلیک کنید)";
  }
}
