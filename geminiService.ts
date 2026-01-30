
import { GoogleGenAI } from "@google/genai";

/**
 * دریافت دانستنی‌های علمی از هوش مصنوعی جمینای
 * مقداردهی هوش مصنوعی مستقیماً داخل تابع انجام می‌شود تا آخرین مقدار کلید را دریافت کند.
 */
export async function getElementFunFact(elementName: string, persianName: string) {
  // دریافت کلید مستقیماً از محیط اجرا
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "") {
    throw new Error("API_KEY_MISSING");
  }

  try {
    // ایجاد نمونه جدید در هر فراخوانی برای اطمینان از تازگی کلید (مطابق استانداردهای جدید)
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `یک دانستنی (فکت) علمی بسیار کوتاه، هیجان‌انگیز و آموزنده درباره عنصر "${persianName}" (${elementName}) برای دانش‌آموزان پایه نهم بنویس.`,
      config: {
        systemInstruction: "پاسخ فقط فارسی، علمی، دقیق و حداکثر ۱۰ کلمه باشد. از کلمات جذاب استفاده کن.",
        temperature: 0.9,
      }
    });

    return response.text?.trim() || "اتم‌ها اسرار زیادی دارند!";
    
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // اگر خطا مربوط به پیدا نشدن موجودیت بود، باید دوباره کلید انتخاب شود
    if (error?.message?.includes("not found")) {
       throw new Error("API_KEY_INVALID");
    }
    return "در حال تحلیل اتمی... (لطفاً دوباره امتحان کنید)";
  }
}
