
import { GoogleGenAI } from "@google/genai";

/**
 * دریافت دانستنی‌های اختصاصی برای هر عنصر با استفاده از هوش مصنوعی جمینای
 * این تابع به گونه‌ای طراحی شده که در صورت بروز خطا، جزئیات آن را در کنسول نمایش دهد
 * تا عیب‌یابی در پنل Vercel راحت‌تر باشد.
 */
export async function getElementFunFact(elementName: string, persianName: string) {
  try {
    // بررسی وجود کلید در محیط اجرا (Vercel/Production)
    const apiKey = process.env.API_KEY;
    
    if (!apiKey || apiKey === "undefined") {
      console.error("Mendeleev AI Error: API_KEY is missing or undefined in process.env. Please check Vercel Environment Variables and RE-DEPLOY.");
      throw new Error("MISSING_KEY");
    }

    // ایجاد نمونه هوش مصنوعی طبق آخرین استانداردهای Gemini 2025
    const ai = new GoogleGenAI({ apiKey });
    
    // استفاده از مدل gemini-3-flash-preview برای پاسخ‌های سریع و آموزشی
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `یک فکت علمی خیره‌کننده، کوتاه و آموزنده درباره عنصر شیمیایی "${persianName}" بنویس.`,
      config: {
        systemInstruction: "شما یک استاد شیمی صمیمی و دلسوز هستید که برای دانش‌آموزان پایه نهم ایران صحبت می‌کنید. پاسخ شما باید دقیقاً به زبان فارسی، علمی، و حداکثر در ۲ جمله کوتاه باشد تا برای ارائه در کلاس جذاب باشد.",
        temperature: 0.8,
        topP: 0.95,
      }
    });
    
    // دریافت مستقیم متن خروجی
    const text = response.text;
    
    if (text && text.length > 5) {
      return text.trim();
    }
    
    throw new Error("EMPTY_RESPONSE");
    
  } catch (error: any) {
    // ثبت جزئیات دقیق خطا در کنسول مرورگر (F12) برای کمک به کاربر
    console.error("--- Mendeleev Smart Network Debug Info ---");
    console.error("Error Message:", error.message);
    console.error("Status Code:", error.status);
    console.groupEnd();

    // مدیریت پیام‌های خطا به زبان فارسی برای دانش‌آموزان
    if (error.message === "MISSING_KEY") {
      return "⚠️ خطا: متغیر API_KEY در Vercel یافت نشد. لطفاً مطمئن شوید کلید را در بخش Environment Variables اضافه کرده و دوباره دکمه Deploy را زده‌اید.";
    }
    
    if (error.status === 401 || error.message?.includes("API key not valid")) {
      return "❌ خطا: کلید API معتبر نیست. لطفاً یک کلید جدید از Google AI Studio دریافت و در پنل مدیریت جایگزین کنید.";
    }

    if (error.status === 429) {
      return "⏳ ترافیک شبکه بالاست. لطفاً چند لحظه دیگر دوباره روی عنصر کلیک کنید.";
    }

    return "اتصال به شبکه هوشمند برقرار نشد. لطفاً اینترنت خود را چک کنید یا از تنظیم صحیح API_KEY در پنل مدیریت مطمئن شوید.";
  }
}
