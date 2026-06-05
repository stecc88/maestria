import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { messages, textType, level, userInput } = await request.json()

    const historyText = messages.map((m: any) =>
      `${m.role === "ai" ? "Insegnante" : "Studente"}: ${m.text}`
    ).join("\n")

    const prompt = `Sei un insegnante di italiano esperto e paziente. Aiuta uno studente di livello ${level} a sviluppare le idee per scrivere un testo di tipo "${textType}".

Storico della conversazione:
${historyText}

${userInput === "start"
  ? "Inizia la conversazione con una domanda semplice per capire di cosa vuole scrivere lo studente."
  : `Ultima risposta dello studente: "${userInput}"`
}

Regole:
- Fai UNA sola domanda alla volta, semplice e adatta al livello ${level}
- Dopo 3-4 risposte dello studente, genera uno SCHEMA con questo formato esatto:
  📝 SCHEMA DEL TUO TESTO:
  • Apertura: [idea concreta]
  • Sviluppo: [idea concreta]
  • Conclusione: [idea concreta]
  💡 5 espressioni utili: [frase1], [frase2], [frase3], [frase4], [frase5]
- Rispondi SOLO in italiano semplice adatto al livello ${level}`

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    )

    const geminiData = await geminiResponse.json()
    const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "Mi dispiace, riprova."

    return NextResponse.json({ text })
  } catch (error: any) {
    return NextResponse.json({ text: "Errore del server. Riprova." }, { status: 500 })
  }
}
