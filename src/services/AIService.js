/**
 * AIService — Generative AI Task Breakdown Helper
 *
 * Integrates with the Google Gemini API to split complex tasks
 * into manageable checklists of actionable sub-tasks.
 */

// Placeholder for Google Gemini API key.
// Paste your free API key from Google AI Studio here!
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY";

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

class AIService {
  /**
   * Generates a checklist of sub-tasks for a given task title and notes.
   * Returns: { success: boolean, subTasks: string[], error: string }
   */
  static async generateSubTasks(taskTitle, taskNotes) {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_GEMINI_API_KEY") {
      return { 
        success: false, 
        error: "Google Gemini API key is missing. Please add your key to AIService.js." 
      };
    }

    const cleanTitle = taskTitle.trim();
    const cleanNotes = taskNotes ? taskNotes.trim() : "";

    const prompt = `
      You are an expert academic project assistant for university students. 
      Analyze this student coursework task:
      Task Title: "${cleanTitle}"
      Task Description/Notes: "${cleanNotes || 'No notes provided.'}"

      Decompose this main task into exactly 4 to 5 smaller, chronological, highly actionable sub-tasks.
      Each sub-task must be brief, clear, and include a realistic estimated duration (e.g. "Research 3 sources (1 hour)", "Draft introduction section (45 mins)").
      
      You must return ONLY a raw JSON array of strings containing the sub-task items. Do not wrap the output in markdown block notations (no \`\`\`json).
      
      Example output layout:
      [
        "Read assignment brief & create checklist (30 mins)",
        "Search library database for 3 research papers (1 hour)",
        "Write draft of introduction & outline (1.5 hours)",
        "Review spelling, edit flow, and double-check referencing (45 mins)"
      ]
    `;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json"
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`API error (Status ${response.status})`);
      }

      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error("No response candidates returned from Gemini API.");
      }

      const rawText = data.candidates[0].content.parts[0].text;
      
      // Parse list from the JSON array string
      const subTasksList = JSON.parse(rawText.trim());
      
      if (!Array.isArray(subTasksList)) {
        throw new Error("Response was not a valid JSON array.");
      }

      return { success: true, subTasks: subTasksList };
    } catch (err) {
      console.error("[AIService] Gemini task breakdown failed:", err);
      return { 
        success: false, 
        error: "Failed to generate study steps. Please check your API key and connection." 
      };
    }
  }
}

export default AIService;
