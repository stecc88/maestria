import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { messages, level, type } = await request.json();

    const systemPrompt = `Sei un insegnante di italiano esperto e paziente. Il tuo compito è aiutare uno studente di livello [${level}] a sviluppare le idee per scrivere un testo di tipo [${type}].

Segui queste linee guida:
1. Fai UNA domanda alla volta, semplice e chiara.
2. Inizia chiedendo di cosa vuole scrivere ("Di cosa vuoi scrivere?").
3. In base al tipo di testo [${type}], fai 2-3 domande specifiche per approfondire (esempio per email: a chi scrive, obiettivo; per narrativo: personaggi, finale).
4. Quando hai abbastanza informazioni (dopo 3-4 risposte), genera uno schema dettagliato che includa ESATTAMENTE queste sezioni:
   - Apertura: idee per iniziare
   - Sviluppo: punti principali da trattare
   - Conclusione: come chiudere il testo
   - Espressioni utili: 5 parole o frasi chiave in italiano per questo tema e livello.

Rispondi sempre in italiano semplice adatto al livello [${level}]. Sii motivatore e incoraggiante.`;

    const prompt = `${systemPrompt}\n\nConversazione:\n${messages.map((m: any) => `${m.role}: ${m.content}`).join("\n")}\nAI:`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    if (!geminiResponse.ok) {
      const error = await geminiResponse.json();
      throw new Error(error.error?.message || "Error calling Gemini API");
    }

    const geminiData = await geminiResponse.json();
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return NextResponse.json({ text: rawText });
  } catch (error: any) {
    console.error("Writing assistant API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
