import { prisma } from "../lib/prisma";
// Local types to avoid relying on generated Prisma typings in lint step
export type NoteQuality = "SIMPLE" | "BALANCED" | "DETAILED";
export type NoteStatus = "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";
export type GeneratedNote = {
  id: string;
  userId: string;
  title: string;
  content: string | null;
  quality: NoteQuality;
  status: NoteStatus;
  errorMessage: string | null;
  sourceFileName: string;
  sourceFileSize: number;
  createdAt: Date;
  updatedAt: Date;
};

async function extractPdfText(buffer: Buffer): Promise<string> {
  const { default: pdfParse } = await import("pdf-parse");
  const result = await pdfParse(buffer);
  return normalizeWhitespace(result.text || "");
}

function normalizeWhitespace(text: string): string {
  return text
    .replace(/\r/g, "")
    .replace(/\t/g, " ")
    .replace(/\u00a0/g, " ");
}

function chunkText(text: string, maxChars: number): string[] {
  const paragraphs = text.split(/\n{2,}/);
  const chunks: string[] = [];
  let current = "";
  for (const p of paragraphs) {
    const para = p.trim();
    if (!para) continue;
    if ((current + "\n\n" + para).length > maxChars) {
      if (current) chunks.push(current);
      if (para.length > maxChars) {
        for (let i = 0; i < para.length; i += maxChars) {
          chunks.push(para.slice(i, i + maxChars));
        }
        current = "";
      } else {
        current = para;
      }
    } else {
      current = current ? current + "\n\n" + para : para;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

function qualityToInstructions(quality: NoteQuality): string {
  switch (quality) {
    case "SIMPLE":
      return "Create concise bullet-point notes with key terms only. Avoid long explanations.";
    case "DETAILED":
      return "Create detailed lecture notes with explanations, examples, and brief derivations where relevant.";
    default:
      return "Create balanced notes with bullet points and short explanations.";
  }
}

type GeminiResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
};

async function callGemini(prompt: string, model: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing env var: GEMINI_API_KEY");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GEMINI_REQUEST_FAILED: ${res.status} ${text}`);
  }
  const json = (await res.json()) as GeminiResponse;
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return text;
}

async function mapSummaries(
  chunks: string[],
  quality: NoteQuality,
  model: string
): Promise<string[]> {
  const sys =
    "You are a helpful teaching assistant who writes faithful notes from provided content. Avoid hallucinations.";
  const instr = qualityToInstructions(quality);
  const summaries: string[] = [];
  for (const chunk of chunks) {
    const prompt = `${sys}\n\n${instr}\n\nSource:\n${chunk}`;
    const content = await callGemini(prompt, model);
    summaries.push(content.trim());
  }
  return summaries;
}

async function reduceSummaries(
  summaries: string[],
  quality: NoteQuality,
  model: string
): Promise<string> {
  const sys =
    "You are a helpful teaching assistant who merges notes into a coherent Markdown document.";
  const instr = qualityToInstructions(quality);
  const mergedSource = summaries.join("\n\n---\n\n");
  const prompt = `${sys}\n\n${instr}\n\nMerge the following chunked notes into one coherent Markdown document with clear headings and bullets.\n\n${mergedSource}`;
  const final = await callGemini(prompt, model);
  return final.trim();
}

export async function createJob(
  userId: string,
  fileName: string,
  fileSize: number,
  quality: NoteQuality,
  title?: string
) {
  const note = await (
    prisma as unknown as {
      generatedNote: {
        create: (args: {
          data: Partial<GeneratedNote> & {
            userId: string;
            title: string;
            quality: NoteQuality;
            status: NoteStatus;
            sourceFileName: string;
            sourceFileSize: number;
          };
        }) => Promise<GeneratedNote>;
      };
    }
  ).generatedNote.create({
    data: {
      userId,
      title: title || fileName,
      quality,
      status: "QUEUED",
      sourceFileName: fileName,
      sourceFileSize: fileSize,
    },
  });
  return note;
}

export async function processJob(
  note: GeneratedNote,
  buffer: Buffer
): Promise<void> {
  const maxChars = Number(process.env.MAX_CHUNK_CHARS || 3000);
  const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  try {
    await (
      prisma as unknown as {
        generatedNote: {
          update: (args: {
            where: { id: string };
            data: Partial<GeneratedNote>;
          }) => Promise<GeneratedNote>;
        };
      }
    ).generatedNote.update({
      where: { id: note.id },
      data: { status: "PROCESSING" as NoteStatus },
    });
    const text = await extractPdfText(buffer);
    const chunks = chunkText(text, maxChars);
    const mapped = await mapSummaries(chunks, note.quality, model);
    const finalMd = await reduceSummaries(mapped, note.quality, model);
    await (
      prisma as unknown as {
        generatedNote: {
          update: (args: {
            where: { id: string };
            data: Partial<GeneratedNote>;
          }) => Promise<GeneratedNote>;
        };
      }
    ).generatedNote.update({
      where: { id: note.id },
      data: { status: "COMPLETED", content: finalMd },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "UNKNOWN_ERROR";
    await (
      prisma as unknown as {
        generatedNote: {
          update: (args: {
            where: { id: string };
            data: Partial<GeneratedNote>;
          }) => Promise<GeneratedNote>;
        };
      }
    ).generatedNote.update({
      where: { id: note.id },
      data: { status: "FAILED", errorMessage: message },
    });
  }
}

export async function getNoteById(id: string, userId: string) {
  return (
    prisma as unknown as {
      generatedNote: {
        findFirst: (args: {
          where: { id: string; userId: string };
        }) => Promise<GeneratedNote | null>;
      };
    }
  ).generatedNote.findFirst({ where: { id, userId } });
}

export async function listNotes(userId: string) {
  return (
    prisma as unknown as {
      generatedNote: {
        findMany: (args: {
          where: { userId: string };
          orderBy: { createdAt: "desc" };
        }) => Promise<GeneratedNote[]>;
      };
    }
  ).generatedNote.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteNote(id: string, userId: string) {
  return (
    prisma as unknown as {
      generatedNote: {
        deleteMany: (args: {
          where: { id: string; userId: string };
        }) => Promise<{ count: number }>;
      };
    }
  ).generatedNote.deleteMany({ where: { id, userId } });
}
