
import { GoogleGenAI } from "@google/genai";

/**
 * دریافت دانستنی‌های علمی از هوش مصنوعی جمینای
 * این نسخه برای هماهنگی ۱۰۰٪ با پنل Vercel و رفع خطای عدم شناسایی کلید بازنویسی شده است.
 */
export async function getElementFunFact(elementName: string, persianName: string) {
  try {
    // ایجاد نمونه مستقیم از هوش مصنوعی با استفاده از کلید تزریق شده توسط پلتفرم
    const ai = new GoogleGenAI({ 
      apiKey: process.env.API_KEY 
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `یک دانستنی (فکت) علمی بسیار کوتاه، هیجان‌انگیز و آموزنده درباره عنصر شیمیایی "${persianName}" (${elementName}) برای دانش‌آموزان پایه نهم بنویس.`,
      config: {
        systemInstruction: "پاسخ باید فقط به زبان فارسی، علمی، دقیق و حداکثر در ۱۰ کلمه باشد. از کلمات جذاب و تشویقی استفاده کن.",
        temperature: 0.9,
      }
    });

    // استخراج مستقیم متن از پاسخ طبق آخرین استاندارد SDK
    if (response && response.text) {
      return response.text.trim();
    }
    
    return "اتم‌ها اسرار زیادی دارند، این یکی هنوز کشف نشده!";
    
  } catch (error: any) {
    // نمایش خطا در کنسول برای بررسی فنی در صورت نیاز
    console.error("وضعیت اتصال به جمینای:", error);
    
    // در صورت بروز هرگونه خطا در ارتباط، یک پیام ملایم به دانش‌آموز نشان می‌دهیم
    return "در حال تحلیل اتمی... (اگر این پیام باقی ماند، لطفاً صفحه را رفرش کنید یا اینترنت را چک کنید)";
  }
}
