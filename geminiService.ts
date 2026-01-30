
import { GoogleGenAI } from "@google/genai";

// استفاده از یک مقدار پیش‌فرض برای جلوگیری از خطای ReferenceError در مرورگر
const getApiKey = () => {
  try {
    return process.env.API_KEY || "";
  } catch (e) {
    return "";
  }
};

export async function getElementFunFact(elementName: string, persianName: string) {
  const apiKey = getApiKey();
  if (!apiKey) {
    return "لطفاً کلید API را در تنظیمات Vercel وارد کنید تا هوش مصنوعی فعال شود.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `یک فکت علمی جالب و کوتاه (حداکثر دو جمله) درباره عنصر ${persianName} (${elementName}) برای دانش‌آموزان کلاس نهم به زبان فارسی بنویس. لحن صمیمی و جذاب باشد.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching fun fact:", error);
    return "اتصالی به دنیای اتم‌ها برقرار نشد! اما این عنصر بسیار شگفت‌انگیز است.";
  }
}
