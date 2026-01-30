import { GoogleGenAI } from "@google/genai";

export async function getElementFunFact(elementName: string, persianName: string) {
  try {
    // ایجاد نمونه با کلید دریافتی از محیط سیستم
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // استفاده از مدل فوق سریع و دقیق برای پاسخ‌های آموزشی
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `به عنوان یک استاد شیمی صمیمی، یک فکت علمی کوتاه، جذاب و شگفت‌انگیز درباره عنصر "${persianName}" برای دانش‌آموز کلاس نهم بنویس. پاسخ فقط در یک یا دو جمله باشد.`,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });
    
    // دریافت متن پاسخ
    const text = response.text;
    
    if (text && text.length > 5) {
      return text.trim();
    }
    
    throw new Error("پاسخ دریافتی نامعتبر است");
    
  } catch (error) {
    console.error("AI Error:", error);
    // این پیام فقط زمانی نشان داده می‌شود که کلید API_KEY ست نشده باشد یا مشکلی در اینترنت باشد
    return "اتصال به شبکه هوشمند مندلیف برقرار نشد. لطفاً تنظیمات API_KEY را در پنل مدیریت Vercel بررسی کنید تا دانستنی‌های اختصاصی فعال شوند.";
  }
}