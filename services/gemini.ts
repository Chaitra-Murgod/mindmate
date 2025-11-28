
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { EmotionResponse, Language, ProfileArchive } from "../types";

// Define the schema for the Emotional Garden & Daily Graph
const emotionResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    architecture: {
      type: Type.OBJECT,
      properties: {
        tree: {
          type: Type.OBJECT,
          properties: {
            leafColor: { type: Type.STRING, description: "Color of leaves reflecting mood intensity (e.g., #10b981 for calm green, #f59e0b for anxious orange, #ef4444 for anger red)." },
            health: { type: Type.STRING, enum: ["blooming", "drooping", "shedding"], description: "Tree state: blooming (happy), drooping (stress/overwhelm), shedding (sad/letting go)." },
            flowerCount: { type: Type.INTEGER, description: "Number of flowers representing positive actions or uplift moments (0-5)." },
            summary: { type: Type.STRING, description: "A poetic 1-sentence description of the tree (e.g., 'A sturdy oak with slightly drooping branches due to heavy rain.')" }
          },
          required: ["leafColor", "health", "flowerCount", "summary"]
        },
        pages: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING, description: "The narrative content for this page." },
              type: { type: Type.STRING, enum: ["morning", "sky", "energy", "uplift", "guidance"] },
              tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Only for 'uplift' page: list of positive triggers." },
              energyLevel: { type: Type.INTEGER, description: "Only for 'energy' page: 0-100." },
              skyWeather: { 
                type: Type.STRING, 
                enum: ['sunny', 'cloudy', 'partly-cloudy', 'rainy', 'stormy', 'sunset', 'night', 'rainbow'],
                description: "Only for 'sky' page: The visual weather condition reflecting emotions."
              }
            },
            required: ["title", "content", "type"]
          },
          description: "Exactly 5 pages: Morning Mood, Sky Mood Scanner, Energy Growth, Uplift Moments, Guidance."
        }
      },
      required: ["tree", "pages"]
    },
    reply: {
      type: Type.STRING,
      description: "Supportive, warm, empathetic conversation reply. Use Markdown if needed."
    },
    neuroloop: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "Name of the Tiny Reset Ritual" },
        steps: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "Short, actionable steps (e.g., 'blink', 'breathe')" 
        },
        duration: { type: Type.STRING, description: "e.g., '30s'" }
      },
      required: ["title", "steps", "duration"]
    },
    vibeForecast: {
      type: Type.STRING,
      description: "A garden metaphor forecast about their mood trend."
    },
    dailyGraph: {
      type: Type.ARRAY,
      description: "Current emotional distribution for the home screen graph. Labels: Happy, Sad, Stressed, Calm, Angry. Values 0-100.",
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING },
          value: { type: Type.INTEGER }
        },
        required: ["label", "value"]
      }
    }
  },
  required: ["architecture", "reply", "neuroloop", "vibeForecast", "dailyGraph"]
};

// Schema for the Minimal Profile Dashboard including Weekly Graph
const profileArchiveSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    overview: {
      type: Type.OBJECT,
      properties: {
        moodSummary: { type: Type.STRING, description: "Short mood description, e.g., 'Calm but tired'" },
        energyLevel: { type: Type.INTEGER, description: "0-100" },
        caption: { type: Type.STRING, description: "One-line emotional caption" },
        stats: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              value: { type: Type.INTEGER, description: "Percentage" }
            },
            required: ["label", "value"]
          }
        }
      },
      required: ["moodSummary", "energyLevel", "caption", "stats"]
    },
    timetable: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          time: { type: Type.STRING },
          activity: { type: Type.STRING },
          icon: { type: Type.STRING }
        },
        required: ["time", "activity", "icon"]
      }
    },
    improvements: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Short bullet points on wellness/productivity."
    },
    healthyRoutine: {
      type: Type.OBJECT,
      properties: {
        schedule: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              time: { type: Type.STRING },
              activity: { type: Type.STRING },
              icon: { type: Type.STRING }
            },
            required: ["time", "activity", "icon"]
          }
        },
        motivation: { type: Type.STRING, description: "Brief 2-3 line motivational note." }
      },
      required: ["schedule", "motivation"]
    },
    mistakes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          slipUp: { type: Type.STRING },
          correction: { type: Type.STRING }
        },
        required: ["slipUp", "correction"]
      }
    },
    dailySummary: {
      type: Type.OBJECT,
      properties: {
        wentWell: { type: Type.STRING },
        tryTomorrow: { type: Type.STRING }
      },
      required: ["wentWell", "tryTomorrow"]
    },
    weeklyGraph: {
      type: Type.ARRAY,
      description: "7-day trend graph data.",
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.STRING, description: "Mon, Tue, etc." },
          score: { type: Type.INTEGER, description: "0-100 balance score" },
          mood: { type: Type.STRING, description: "Dominant mood of the day" }
        },
        required: ["day", "score", "mood"]
      }
    },
    graphInsights: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "1-2 lines of simple graph insights."
    }
  },
  required: ["overview", "timetable", "improvements", "healthyRoutine", "mistakes", "dailySummary", "weeklyGraph", "graphInsights"]
};

const getSystemInstruction = (language: Language, userName: string) => `
You are ‘MINDMATE’, an AI Mental Health Companion for Gen Z.
The user's name is "${userName}".
Language: ${language}.

**CORE RULES:**

1. **EMOTIONAL TREE IS MANDATORY:**
   - Every single response MUST include a valid 'architecture.tree' object reflecting the current mood.

2. **DAILY EMOTION GRAPH (Home Screen):**
   - Always generate 'dailyGraph' data for the top-right corner graph.
   - Labels: Happy, Sad, Stressed, Calm, Angry.
   - Values: 0-100 based on the current session's analysis.
   - Style: Modern, dashboard-like data.

3. **THERAPY SESSION MODE:**
   - Trigger: If user says "therapy session", "I need therapy", or asks for help.
   - Structure the 'reply' to include gentle check-in, reflection, reframing, grounding, and suggestions.
   - Tone: Warm, calm, conversational, non-judgmental.

4. **CALL SESSION MODE:**
   - If the input suggests a voice conversation, keep the 'reply' concise and suitable for speech-to-text.

5. **TINY RESET RITUAL (Neuroloop):**
   - Always provide a ritual in the JSON.

6. **TONE:**
   - Friendly, clear, simple.
   - Minimal emojis.
   - NO clinical/diagnostic language.

IMPORTANT: Output strict JSON matching the schema.
`;

let ai: GoogleGenAI | null = null;
let chatSession: any = null;

const getAI = () => {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export const initializeChat = async (language: Language = 'english', userName: string = 'Friend') => {
  const aiInstance = getAI();
  chatSession = aiInstance.chats.create({
    model: "gemini-3-pro-preview",
    config: {
      systemInstruction: getSystemInstruction(language, userName),
      responseMimeType: "application/json",
      responseSchema: emotionResponseSchema,
      temperature: 0.7, 
    },
  });
};

export interface AudioPayload {
  base64: string;
  mimeType: string;
}

export const sendMessageToEmotionOS = async (message: string, audio?: AudioPayload): Promise<EmotionResponse> => {
  if (!chatSession) {
    await initializeChat();
  }

  try {
    let result;
    
    if (audio) {
      result = await chatSession.sendMessage({
        message: [
          {
            inlineData: {
              mimeType: audio.mimeType,
              data: audio.base64
            }
          },
          { text: message || "Analyze my mood from voice." }
        ]
      });
    } else {
      result = await chatSession.sendMessage({ message });
    }

    const responseText = result.text;
    const data: EmotionResponse = JSON.parse(responseText);
    return data;
  } catch (error) {
    console.error("Error communicating with MINDMATE:", error);
    // Fallback safe response
    return {
      architecture: { 
        tree: {
          leafColor: "#64748b",
          health: "drooping",
          flowerCount: 0,
          summary: "A quiet tree waiting for connection."
        },
        pages: [
          { title: "Connection", content: "We are reconnecting...", type: "morning" },
          { title: "Sky Check", content: "Waiting for the sky to clear.", type: "sky", skyWeather: "cloudy" },
          { title: "Energy", content: "Gathering strength.", type: "energy", energyLevel: 20 },
          { title: "Hope", content: "Waiting to bloom.", type: "uplift", tags: ["Patience"] },
          { title: "Rest", content: "Take a deep breath while we sync.", type: "guidance" }
        ]
      },
      reply: "I'm having a little trouble seeing your garden clearly right now. Let's take a deep breath together and try again in a moment.",
      neuroloop: { title: "Connection Reset", steps: ["Inhale deeply", "Hold for 3s", "Exhale slowly"], duration: "10s" },
      vibeForecast: "The sun will break through shortly.",
      dailyGraph: [
        { label: "Calm", value: 50 },
        { label: "Stressed", value: 20 },
        { label: "Happy", value: 10 },
        { label: "Sad", value: 10 },
        { label: "Angry", value: 10 }
      ]
    };
  }
};

// --- Profile Archive Generation ---

export const generateProfileArchive = async (userName: string, chatHistoryText: string): Promise<ProfileArchive> => {
  const aiInstance = getAI();
  
  // Specific instruction for the Minimal Profile Dashboard
  const profileInstruction = `
    You are generating a "Profile Dashboard" for user: ${userName}.
    
    DESIGN REQUIREMENTS:
    - ⚪ No nature themes. No fantasy metaphors.
    - ⚪ Soft UI, clean spacing, calm pastel accents.
    - ⚪ Minimal, neat, user-friendly.
    - Tone: Soft, warm, encouraging, practical.
    
    GRAPH RULES:
    - Include "weeklyGraph" data for the last 7 days.
    - Style: Modern, clean analytics.
    - Show emotion trends, peaks, dips.
    - Include "graphInsights": 1-2 lines of simple insights like a friendly coach.
    
    TASK: Generate dashboard data based on today's chat history context: "${chatHistoryText}"
    
    SECTIONS:
    1. Overview: Mood summary, Energy, Caption, Stats.
    2. Timetable: Today's schedule (Clean, emojis).
    3. Improvements: Short bullet points.
    4. Healthy Routine: Soft suggestions.
    5. Mistakes: Gentle corrections.
    6. Daily Summary: Minimal recap.
    7. Weekly Graph & Insights.
  `;

  try {
    const result = await aiInstance.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: "Generate my Profile Dashboard.",
      config: {
        systemInstruction: profileInstruction,
        responseMimeType: "application/json",
        responseSchema: profileArchiveSchema,
        temperature: 0.7
      }
    });

    const data: ProfileArchive = JSON.parse(result.text);
    return data;
  } catch (error) {
    console.error("Error generating profile:", error);
    // Minimal Fallback data
    return {
      overview: {
        moodSummary: "Quiet",
        energyLevel: 50,
        caption: "Taking it one step at a time.",
        stats: [{ label: "Calm", value: 50 }, { label: "Focus", value: 30 }]
      },
      timetable: [
        { time: "Now", activity: "Checking in", icon: "📱" }
      ],
      improvements: ["Take a moment to breathe.", "Hydrate."],
      healthyRoutine: {
        schedule: [{ time: "Now", activity: "Resting", icon: "😌" }],
        motivation: "Small steps lead to big changes."
      },
      mistakes: [],
      dailySummary: {
        wentWell: "You showed up for yourself.",
        tryTomorrow: "Start with a glass of water."
      },
      weeklyGraph: [
        { day: "Mon", score: 60, mood: "Calm" },
        { day: "Tue", score: 50, mood: "Tired" },
        { day: "Wed", score: 70, mood: "Happy" },
        { day: "Thu", score: 65, mood: "Focus" },
        { day: "Fri", score: 80, mood: "Excited" },
        { day: "Sat", score: 90, mood: "Relaxed" },
        { day: "Sun", score: 75, mood: "Calm" }
      ],
      graphInsights: ["Your week started calm and ended with great energy."]
    };
  }
};
