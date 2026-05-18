// ─────────────────────────────────────────────────────────────────────────────
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import Groq from "groq-sdk";
import { getBallLabel } from "@/utils/helper/scorecard";
import { db } from "../db";
import { getFallbackCommentary } from "./fallback";
import { CommentaryLine, CommentaryPayload } from "./types";

const SYSTEM_PROMPT = `You are Akash Chopra, the cricket commentator for Scordo — a live cricket scoring platform.
Your job is to generate ONE short, punchy, exciting commentary line (max 2 sentences) for each event in Higlish language just like Akash Chopra.

Rules:
- Tone: Exciting, natural, slightly dramatic — like a real TV commentator
- Language: Primarily English, with occasional Hinglish/Hindi words for big moments", etc.)
- Never repeat the same phrase twice in a session
- For boundaries (4s/6s): be celebratory
- For wickets: be dramatic and specific to the wicket type  
- For dot balls: highlight the battle, the pressure
- For milestones: be euphoric
- For hat-tricks or big moments: mix Hindi for maximum drama
- Keep it SHORT — 1 or 2 sentences maximum
- Never include quotes or markdown — plain text only
- Vary your vocabulary constantly`;

const GEMINI_MODEL = "gemini-3-flash-preview";

function buildPrompt(payload: CommentaryPayload): string {
  const ctx = payload.overContext ? `[${payload.overContext}]` : "";
  const score = payload.teamScore ? ` Score: ${payload.teamScore}.` : "";
  const batter = payload.batterName ?? "The batter";
  const bowler = payload.bowlerName ?? "The bowler";
  const type = payload.shotType ?? "DEFENSE";
  const runs = payload.ball?.runs ?? 0;
  const side = payload.shotSide || "fine-leg";

  if (!payload.ball) {
    return `${ctx}Event: ${payload.eventType}. ${score} Generate commentary.`;
  }

  switch (payload.eventType) {
    case "RUN_SCORED": {
      const extra = payload.ball.isWide
        ? "Wide ball!"
        : payload.ball.isNoBall
          ? "No ball!"
          : payload.ball.isBye
            ? "Bye!"
            : payload.ball.isLegBye
              ? "Leg bye!"
              : "";

      if (extra)
        return `${ctx}${extra} ${runs} run${runs !== 1 ? "s" : ""} added. Shot ${type} to the ${side}.${score} Generate commentary.`;

      if (runs === 0)
        return `${ctx}Dot ball. ${batter} faces ${bowler} ${side}.  Shot ${type} to the ${side}.${score} Generate commentary for this defensive moment.`;
      if (runs === 1 || runs === 2 || runs === 3)
        return `${ctx}${batter} hits ${side} for ${runs} run${runs !== 1 ? "s" : ""} off ${bowler}. Shot ${type} to the ${side}.${score} Generate short commentary.`;
      if (runs === 4)
        return `${ctx}FOUR! ${batter} drives ${side} to the boundary off ${bowler}. Shot ${type} to the ${side}.${score} Generate excited boundary commentary.`;
      if (runs === 5)
        return `${ctx}FIVE penalty runs! fielding side infringement. Shot ${type} to the ${side}.${score} Generate commentary.`;
      if (runs === 6)
        return `${ctx}SIX! ${batter} launches ${side} into the crowd off ${bowler}. Shot ${type} to the ${side}.${score} Generate euphoric six commentary.`;
      return `${ctx}${runs} runs scored. Shot ${type} to the ${side}.${score}`;
    }

    case "WICKET": {
      const wType = payload.ball.dismissalType ?? "OUT";
      const fielder = payload.fielderName ? ` Fielder: ${payload.fielderName}.` : "";
      return `${ctx}WICKET! ${batter} is dismissed — ${wType}. Bowled by ${bowler}, Catched by ${fielder}.  Shot ${type} to the ${side}.${score} Generate dramatic wicket commentary specific to the wicket type.`;
    }

    case "MILESTONE": {
      const ml = payload.milestoneType;
      const val = payload.milestoneValue;
      if (ml === "FIFTY")
        return `${ctx}${batter} has just completed a FIFTY (${val} runs)! Shot ${type} to the ${side}. Generate euphoric half-century commentary, optionally with Hindi.`;
      if (ml === "CENTURY")
        return `${ctx}${batter} has scored a CENTURY (${val} runs)! Shot ${type} to the ${side}. Generate the most excited, mix of English and Hindi century commentary possible.`;
      if (ml === "HAT_TRICK")
        return `${ctx}HAT-TRICK! ${bowler} takes 3 wickets in 3 balls! Shot ${type} to the ${side}. Generate explosive hat-trick commentary with Hindi phrases.`;
      return `${ctx}Milestone reached! Shot ${type} to the ${side}. Generate commentary.`;
    }

    case "SPECIAL_EVENT": {
      const se = payload.specialEvent;
      if (se === "BACK_TO_BACK_FOURS")
        return `${ctx}Back-to-back FOURS by ${batter} off ${bowler}! Shot ${type} to the ${side}. Generate exciting consecutive boundary commentary.`;
      if (se === "BACK_TO_BACK_SIXES")
        return `${ctx}Back-to-back SIXES by ${batter}! He is on FIRE! Shot ${type} to the ${side}. Generate over-the-top six commentary with Hindi drama.`;
      if (se === "MULTIPLE_BOUNDARIES")
        return `${ctx}Multiple boundaries in the over by ${batter}! Shot ${type} to the ${side}. Generate crowd-going-wild commentary.`;
      if (se === "MAIDEN_OVER")
        return `${ctx}MAIDEN OVER by ${bowler}! Not a single run conceded.${score} Generate tight bowling commentary.`;
      if (se === "LAST_WICKET")
        return `${ctx}Last wicket falls! The innings is over. Shot ${type} to the ${side}.${score} Generate dramatic end-of-innings commentary.`;
      if (se === "MATCH_WIN")
        return `${ctx}MATCH OVER! What a game of cricket! Shot ${type} to the ${side}.${score} Generate euphoric match-winning commentary.`;
      return `Special cricket moment.  Shot ${type} to the ${side}. Generate exciting commentary.`;
    }
  }
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const openAI = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

async function callAI(
  prompt: string,
  userQuery: string
): Promise<{ success: true; data: string } | { success: false; error: string }> {
  const fullPrompt = `${SYSTEM_PROMPT}\n${prompt}\n${userQuery}`;

  try {
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
    });

    const res = await model.generateContent(fullPrompt);
    const text = res?.response?.text()?.trim();

    if (text) {
      return { success: true, data: text };
    }
  } catch (error) {
    if (error instanceof Error)
      return {
        success: false,
        error: error?.message || "Something went wrong!",
      };

    console.error("Gemini failed → falling back...");
  }

  try {
    const res = await openAI.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: fullPrompt }],
      temperature: 0.8,
    });

    const text = res.choices[0]?.message?.content?.trim();

    if (text) {
      return { success: true, data: text };
    }
  } catch (error) {
    if (error instanceof Error)
      return {
        success: false,
        error: error?.message,
      };

    console.error("OpenAI failed → falling back...");
  }

  try {
    const res = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: fullPrompt }],
      temperature: 0.9,
      max_tokens: 80,
    });

    const text = res.choices[0]?.message?.content?.trim();

    if (text) {
      return { success: true, data: text };
    }
  } catch (error) {
    if (error instanceof Error)
      return {
        success: false,
        error: error?.message || "Something went wrong!",
      };

    console.error("Groq also failed.");
  }

  return {
    success: false,
    error: "All AI providers failed",
  };
}

export async function generateCommentary(
  payload: CommentaryPayload,
  aiEnabled = false
): Promise<CommentaryLine> {
  const data: CommentaryLine = {
    eventType: payload.eventType,
    label: getBallLabel(payload?.ball),
    text: "",
    id: Date.now().toString(),
    timestamp: new Date(),
  };

  if (aiEnabled) {
    const prompt = buildPrompt(payload);
    const last6Balls = await db.ball.findMany({
      where: {
        inningId: payload.ball?.inningId,
      },
      take: 6,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        batsman: {
          select: {
            user: {
              select: {
                name: true,
                username: true,
              },
            },
          },
        },
        bowler: {
          select: {
            user: {
              select: {
                name: true,
                username: true,
              },
            },
          },
        },
        fielder: {
          select: {
            user: {
              select: {
                name: true,
                username: true,
              },
            },
          },
        },
        ball: true,
        runs: true,
        over: true,
        dismissalType: true,
        isBye: true,
        isLegBye: true,
        isNoBall: true,
        isWicket: true,
        isWide: true,
        createdAt: true,
      },
    });
    const userQuery = JSON.stringify({ ...payload, last6Balls }, null, 2);

    const response = await callAI(prompt, userQuery);

    if (response.success) {
      data.text = response.data;

      return data;
    }

    if (!payload.ball) {
      data.text = `What a moment in this match! Let's see how it unfolds.`;

      return data;
    }
  }

  const fallback = getFallbackCommentary(payload);

  data.text = fallback;

  return data;
}
