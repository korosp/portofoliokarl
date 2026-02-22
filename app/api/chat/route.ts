import { NextResponse } from 'next/server';

type ChatMessage = { role: string; content: string };

function extractTextFromProviderResponse(data: any) {
  // OpenAI chat completions
  if (data?.choices?.[0]?.message?.content) return data.choices[0].message.content;
  if (data?.choices?.[0]?.text) return data.choices[0].text;

  // Generic providers (Groq/other) common fields
  if (typeof data?.output_text === 'string') return data.output_text;
  if (Array.isArray(data?.output) && data.output[0]?.content_text) return data.output[0].content_text;

  // Fallback: stringify
  return JSON.stringify(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: ChatMessage[] = body.messages ?? [];
    // Inject system prompt with developer info if not provided by client
    const hasSystem = messages.some(m => String(m.role).toLowerCase() === 'system');
    const clientLang = String(body.lang ?? '').toLowerCase();
    if (!hasSystem) {
      const base = 'You are Karlzy Helper. The developer of this site is karlzy, a student at Company Dev. When asked about the developer, identify them as Karlzy and mention that they are a student at Company Dev. Use a professional tone and avoid slang or flashy/"alay" phrasing. Accept lowercase input and do not force uppercase on user text.';
      // If client language is Indonesian, enforce replies in Indonesian more strongly
      const content = clientLang.startsWith('id') ? base + ' Always reply in Indonesian.' : base + ' Prefer answering in Indonesian if the user writes Indonesian.';
      messages.unshift({ role: 'system', content });
    }
    const model = body.model ?? process.env.OPENAI_MODEL ?? 'gpt-3.5-turbo';

    console.log('[api/chat] incoming request', { model, messagesCount: messages.length });

    // If model indicates Groq provider, call configured GROQ API
      // If model indicates Groq provider, call configured GROQ API
      // Groq often uses OpenAI-compatible model names like "openai/gpt-oss-120b".
      const groqKey = process.env.GROQ_API_KEY;
      const shouldUseGroq = model.toLowerCase().startsWith('groq') || (!!groqKey && String(model).toLowerCase().startsWith('openai/'));
      if (shouldUseGroq) {
        const groqUrl = process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions';
        if (!groqUrl || !groqKey) {
          return NextResponse.json({ error: 'GROQ_API_URL or GROQ_API_KEY not configured' }, { status: 500 });
        }

      // Groq expects OpenAI-compatible model names (e.g. "openai/gpt-oss-120b").
      // Allow request to pass explicit model in body; otherwise default to a common Groq model.
      const payloadModel = body.model ?? model ?? 'openai/gpt-oss-120b';
      const payload = {
        model: payloadModel,
        messages: messages.map(m => ({ role: m.role === 'bot' ? 'assistant' : m.role, content: m.content }))
      };

      let groqRes;
      try {
        groqRes = await fetch(groqUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqKey}`
        },
        body: JSON.stringify(payload)
        });
      } catch (err) {
        console.error('[api/chat] groq fetch error', err);
        return NextResponse.json({ error: 'Groq fetch failed', detail: String(err) }, { status: 502 });
      }

      const textRes = await groqRes.text();
      let data: any;
      try { data = JSON.parse(textRes); } catch (e) { data = { raw: textRes }; }

      if (!groqRes.ok) {
        // include response body to help debugging
        return NextResponse.json({ error: 'Groq error', status: groqRes.status, raw: data }, { status: 502 });
      }

      const text = extractTextFromProviderResponse(data);
      return NextResponse.json({ provider: 'groq', model: payloadModel, text, raw: data });
    }

    // Default: OpenAI Chat Completions
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OPENAI_API_KEY not set on server' }, { status: 500 });
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ model, messages: messages.map(m => ({ role: m.role === 'bot' ? 'assistant' : m.role, content: m.content })) })
    });

    const data = await res.json();
    const text = extractTextFromProviderResponse(data);
    return NextResponse.json({ provider: 'openai', model, text, raw: data });
  } catch (err: any) {
    console.error('[api/chat] unexpected error', err);
    return NextResponse.json({ error: 'internal_server_error', message: err?.message ?? String(err), stack: err?.stack ?? null }, { status: 500 });
  }
}
