import { GoogleGenAI } from "@google/genai";
import { ThemeStyle, GenerationRequest } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateInvitationMessage = async (request: GenerationRequest): Promise<string> => {
  const { name, age, theme, tone } = request;

  let themeDescription = '';
  switch (theme) {
    case ThemeStyle.FUN: themeDescription = 'divertido, colorido e cheio de energia'; break;
    case ThemeStyle.ELEGANT: themeDescription = 'sofisticado, clássico e refinado'; break;
    case ThemeStyle.MINIMAL: themeDescription = 'simples, direto e moderno'; break;
    case ThemeStyle.SPACE: themeDescription = 'galáctico, espacial e aventureiro'; break;
    case ThemeStyle.NATURE: themeDescription = 'floral, natural e tranquilo'; break;
  }

  const prompt = `
    Escreva uma mensagem curta e cativante para um convite de aniversário (máximo 40 palavras).
    Detalhes:
    - Aniversariante: ${name}
    - Idade: ${age} anos
    - Estilo da festa: ${themeDescription}
    - Tom da mensagem: ${tone}
    
    A mensagem deve convidar as pessoas para celebrar. Não inclua data ou local no texto gerado, apenas a mensagem de convite inspiradora. Responda apenas com o texto em Português.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text?.trim() || "Vamos celebrar este momento especial juntos!";
  } catch (error) {
    console.error("Erro ao gerar mensagem:", error);
    return "Venha celebrar comigo este dia especial! Vai ser incrível.";
  }
};