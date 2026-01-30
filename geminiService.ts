
import { GoogleGenAI } from "@google/genai";

export async function getElementFunFact(elementName: string, persianName: string) {
  try {
    // ایجاد نمونه جدید در هر بار فراخوانی برای اطمینان از خواندن آخرین کلید API
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `یک فکت علمی بسیار کوتاه، جذاب و شگفت‌انگیز درباره عنصر شیمیایی "${persianName}" مخصوص دانش‌آموزان کلاس نهم بنویس. لحن صمیمی باشد و فقط در یک یا دو جمله پاسخ بده.`,
      config: {
        temperature: 0.8,
        topP: 0.95,
      }
    });
    
    const text = response.text;
    if (text && text.trim().length > 0) {
      return text.trim();
    }
    throw new Error("Empty AI response");
  } catch (error) {
    console.error("خطا در ارتباط با هوش مصنوعی:", error);
    // این متن فقط زمانی نمایش داده می‌شود که کلید API در پنل Vercel ست نشده باشد
    return "در حال حاضر ارتباط با مغز متفکر مندلیف برقرار نشد. لطفاً مطمئن شوید کلید API_KEY را در تنظیمات Vercel وارد کرده‌اید!";
  }
}
