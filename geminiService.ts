
import { GoogleGenAI } from "@google/genai";

/**
 * سرویس هوشمند دانستنی‌های اتمی
 * این بخش کاملاً در پس‌زمینه عمل می‌کند تا مزاحمتی برای کاربر ایجاد نشود.
 */
export async function getElementFunFact(elementName: string, persianName: string) {
  try {
    const apiKey = process.env.API_KEY;
    
    // اگر کلید موجود نباشد، به جای خطا دادن، یک پیام علمی پیش‌فرض نمایش می‌دهیم
    if (!apiKey) {
      return "دانستنی: این عنصر در ساختار بسیاری از مواد اطراف ما نقشی حیاتی دارد!";
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `یک فکت (دانستنی) علمی بسیار کوتاه، هیجان‌انگیز و جدید درباره عنصر "${persianName}" برای دانش‌آموزان نهم بنویس.`,
      config: {
        systemInstruction: "پاسخ فقط فارسی، علمی و حداکثر ۱۰ کلمه باشد. لحن صمیمی و جذاب باشد.",
        temperature: 0.7,
      }
    });

    return response.text?.trim() || "اتم‌ها اسرار زیادی دارند، این یکی هنوز در حال بررسی است!";
    
  } catch (error) {
    console.error("AI Service Error:", error);
    return "در حال تحلیل اتمی... (لطفاً لحظاتی دیگر دوباره امتحان کنید)";
  }
}
