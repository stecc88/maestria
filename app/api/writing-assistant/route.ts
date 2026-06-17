import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ text: "Non autorizzato" }, { status: 401 })
  }

  try {
    const { messages, textType, level, userInput } = await request.json()

    const historyText = messages.map((m: any) =>
      `${m.role === "ai" ? "Insegnante" : "Studente"}: ${m.text}`
    ).join("\n")

    const prompt = `Sei un esperto di didattica dell'italiano L2. Aiuta uno studente di livello ${level} (QCER) a sviluppare la competenza testuale per la tipologia: "${textType}".

OBIETTIVO PEDAGOGICO:
Non limitarti a un formato, ma insegna a produrre un testo efficace per la tipologia "${textType}" al livello ${level}.

FLUSSO DI LAVORO:
1. Identifica lo scopo comunicativo dello studente.
2. Spiega brevemente la struttura ideale per un testo "${textType}".
3. Fornisce lessico e strutture grammaticali specifiche per il livello ${level}.
4. Avverte su possibili errori frequenti relativi a questa tipologia.
5. Aiuta a creare una scaletta/outline.

Storico della conversazione:
${historyText}

${userInput === "start"
  ? `Inizia salutando e chiedendo allo studente cosa vorrebbe scrivere (ad esempio, se ${textType} è narrativo, chiedi di un evento passato). Spiega brevemente lo scopo di un testo ${textType}.`
  : `Ultima risposta dello studente: "${userInput}"`
}

REGOLE DI RISPOSTA:
- Rispondi SEMPRE e SOLO in italiano adatto al livello ${level}.
- Fai UNA sola domanda alla volta per guidare lo studente.
- Sii incoraggiante ma rigoroso dal punto di vista linguistico.
- Quando hai abbastanza informazioni (dopo 4-5 scambi), genera lo schema finale.

FORMATO DELLO SCHEMA FINALE (DEVE iniziare con questa riga):
📝 SCHEMA DEL TUO TESTO:
• SCOPO: [Spiega lo scopo comunicativo]
• STRUTTURA: [Breve spiegazione della struttura]
• SCALETTA: [Punti chiave da seguire]
• LESSICO CHIAVE: [5-8 parole/espressioni di livello ${level}]
• ERRORI DA EVITARE: [2-3 avvertenze specifiche]
• SUGGERIMENTO GRAMMATICALE: [Un punto grammaticale utile per questo testo al livello ${level}]`

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    )

    const geminiData = await geminiResponse.json()

    if (!geminiResponse.ok) {
      console.error("Gemini API Error Detail:", geminiData);
      const errorMsg = geminiData.error?.message || `Gemini API returned ${geminiResponse.status}`;
      throw new Error(errorMsg);
    }
    const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "Mi dispiace, l'IA non ha restituito una risposta valida."

    return NextResponse.json({ text })
  } catch (error: any) {
    console.error("Writing Assistant Error:", error)
    return NextResponse.json({
      text: "Errore del server o dell'IA. Per favore, riprova tra qualche istante.",
      details: error.message
    }, { status: 500 })
  }
}
