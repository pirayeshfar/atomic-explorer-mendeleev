
import { GoogleGenAI } from "@google/genai";

/**
 * دریافت دانستنی‌های اختصاصی برای هر عنصر با استفاده از هوش مصنوعی جمینای
 */
export async function getElementFunFact(elementName: string, persianName: string) {
  try {
    // بررسی وجود کلید در زمان اجرا
    // نکته مهم: در Vercel حتماً باید بعد از تعریف متغیر، پروژه را Re-deploy کنید.
    const apiKey = process.env.API_KEY;
    
    if (!apiKey || apiKey === "undefined" || apiKey === "") {
      console.error("Mendeleev AI: API_KEY is missing in process.env.");
      throw new Error("MISSING_KEY");
    }

    // مقداردهی اولیه دقیقاً طبق دستورالعمل: new GoogleGenAI({ apiKey: process.env.API_KEY })
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `یک فکت علمی بسیار کوتاه، جذاب و آموزنده درباره عنصر شیمیایی "${persianName}" برای دانش‌آموزان بنویس.`,
      config: {
        systemInstruction: "شما یک معلم علوم مهربان هستید. پاسخ باید کوتاه (حداکثر ۱۵ کلمه) و به زبان فارسی باشد.",
        temperature: 0.7,
      }
    });
    
    if (response && response.text) {
      return response.text.trim();
    }
    
    throw new Error("EMPTY_RESPONSE");
    
  } catch (error: any) {
    console.error("Detailed API Error:", error);

    // مدیریت خطاهای مربوط به استقرار در Vercel
    if (error.message === "MISSING_KEY") {
      return "⚠️ خطا: کلید شناسایی نشد. راه حل: در Vercel به تب Deployments برو و روی آخرین Build گزینه Redeploy را بزن تا متغیر API_KEY اعمال شود.";
    }
    
    if (error.status === 401 || (error.message && error.message.includes("API key not valid"))) {
      return "❌ خطا: کلید API شما معتبر نیست. لطفاً مطمئن شوید کلید را درست کپی کرده‌اید (AIza...).";
    }

    return "اتصال به شبکه هوشمند برقرار نشد. لطفاً اینترنت خود را چک کنید.";
  }
}
