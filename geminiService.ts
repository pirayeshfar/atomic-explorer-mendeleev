
import { GoogleGenAI } from "@google/genai";

/**
 * دریافت دانستنی‌های علمی از هوش مصنوعی جمینای
 * این نسخه بهینه‌سازی شده تا با محدودیت‌های مرورگر در Vercel سازگار باشد.
 */
export async function getElementFunFact(elementName: string, persianName: string) {
  try {
    // تلاش برای خواندن کلید از محیط‌های مختلف تزریق شده
    const key = process.env.API_KEY || "";
    
    if (!key) {
      console.warn("هشدار: API_KEY هنوز در دسترس نیست. لطفاً تنظیمات Vercel را چک کنید.");
    }

    const ai = new GoogleGenAI({ 
      apiKey: key 
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `یک فکت (دانستنی) علمی بسیار کوتاه، هیجان‌انگیز و جدید درباره عنصر "${persianName}" برای دانش‌آموزان نهم بنویس.`,
      config: {
        systemInstruction: "شما یک دستیار هوشمند آزمایشگاه هستید. پاسخ فقط فارسی، علمی و حداکثر ۱۰ کلمه باشد. از لحن صمیمی استفاده کن.",
        temperature: 0.8,
      }
    });

    if (response && response.text) {
      return response.text.trim();
    }
    
    return "اتم‌ها اسرار زیادی دارند، این یکی هنوز کشف نشده!";
    
  } catch (error: any) {
    // ثبت خطا برای عیب‌یابی توسط رزا و رزیتا در کنسول (F12)
    console.group("اطلاعات خطای آزمایشگاه:");
    console.error("جزئیات:", error?.message || error);
    console.log("وضعیت متغیرها:", typeof process !== 'undefined' ? "Process تعریف شده" : "Process تعریف نشده!");
    console.groupEnd();
    
    return "در حال تحلیل اتمی... (لطفاً لحظاتی دیگر دوباره روی عنصر کلیک کنید یا صفحه را رفرش نمایید)";
  }
}
