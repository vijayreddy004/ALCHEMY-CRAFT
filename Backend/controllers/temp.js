const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require('@google/generative-ai');
const config = require('../config');

const MixCache = require('../models/MixCache');

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
];

const genAI = new GoogleGenerativeAI(config.googleApiKey);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  systemInstruction: 'You are an Element Mixer for a crafting game.',
  safetySettings: safetySettings,
});

const buildPrompt = (first, second) => {
  return (
    `You are an Element Mixer for a crafting game. Combine '${first}' and '${second}' using the rules below:\n\n` +
    "1. Output format: Only output `[Emoji] [Combined Element Name]` with no extra text. For example:\n" +
    "   `🍞 Bread`\n\n" +
    "2. Allowed:\n" +
    "   - Everyday physical interactions (e.g., 💧+💧 = 🌊 Lake)\n" +
    "   - Common myths/fairytales (e.g., 🌙+🐺 = 🐺 Werewolf)\n" +
    "   - Simplified sci-fi (e.g., 🔩+🤖 = 🤖 Robot)\n\n" +
    "3. Banned:\n" +
    "   - Obscure or niche references (no 'quarks' or 'dark matter')\n" +
    "   - Overly specific terms (use 'Magic Wand', not 'Elder Wand')\n\n" +
    "   - Do not use tenses or verb forms like run+run is not running, mud + water is not muddier.Give other related object but NEVER the TENSE or similar Form .\n" +
    "4. Priority Order:\n" +
    "   - 1st: Everyday physical interactions (💧+💧 = 🌊 Lake)\n" +
    "   - 2nd: Universal cultural ideas (🌙+🐺 = 🐺 Werewolf)\n" +
    "   - 3rd: user-friendly imagination (🌌+🐴 = 🦄 Star Horse)\n" +
    "   - 4th: Prefer objects over professions/feelings; choose common, simple names.\n" +
    "   - 5th: If multiple options, choose the most recognizable/common one.\n\n" +
    "5. If no clear connection, output: ❌ Nothing\n\n" +
    "6. Use only common single-word names (e.g., Robot not Android, Phoenix not Firebird)" +
    "7. Check how common the word is in normal usage. If it is less common, replace it with a commonly used synonym.(Use clothes not knitwear, use tools not machinery)" +
    "Examples:\n" +
    "🍎 + 🍎 = 🥧 Pie\n" +
    "🔥 + 🐦 = 🐦 Phoenix\n" +
    "🧚 + 🌸 = 🌸 Fairy Garden\n" +
    "🌱 + ⚡ = 🌳 Giant Tree\n" +
    "🚀 + 🌟 = 🌠 Shooting Star\n\n" +
    "Edge Cases:\n" +
    "💡 + 🧦 = ❌ Nothing\n" +
    "🌪️ + 🐷 = ❌ Nothing\n\n" +
    "Do not include any explanations or extra text. Output exactly one line in the following format:\n" +
    "[Emoji] [Name]\n\n" +
    "Now, combine the elements."
  );
};

const buildValidationPrompt = (first, second, output) => {
    return (
      `**Role:** You are a down to earth Logic Guardian for a crafting game.\n\n` +
      `**Task:** Validate if combining '${first}' and '${second}' to create '${output}' makes sense.\n\n` +
      `**Rules:**\n` +
      "1. **Step Check:**\n" +
      "   - Output must require ALL core ingredients (e.g., 'Grilled Cheese' needs 🔥 Fire + 🧀 Cheese + 🍞 Bread).\n" +
      "   - If missing a key element (like heat for cooking), reject it.\n" +
      "2. **Simplification:**\n" +
      "   - Replace rare words with common alternatives (e.g., 'Panini' → 'Sandwich').\n" +
      "   - Ban complex processes (no 'fermentation', 'nuclear fusion').\n" +
      "3. **Common sense Priority:**\n" +
      "   - Prefer what common sense would expect (e.g., 🍞 + 🧀 = 🥪 Sandwich, not 🧀 Grilled Cheese).\n" +
      "   - Cooking requires heat (🔥 Fire/☀️ Sun), mixing needs tools (🥄 Spoon).\n\n" +
      "4. If these types are found, change them to appropriate alternatives:  - **No adjectives:** (e.g., ❌ `🧛♂️ Dracula + 🧄 Garlic = 🧛♂️ Weak Dracula` → ✅ `🧛♂️ Dracula + 🧄 Garlic = ⛓️ Garlic Chain`)\n" +
    "   - **No state changes:** (e.g., ❌ `💧 Water + 🏖️ Sand = 💧 Wet Sand` → ✅ `💧 Water + 🏖️ Sand = 🏰 Sandcastle`)\n" +
    "   - **No duplicate elements:** (e.g., ❌ `🪨 Rock + 💧 Water = 💧 Wet Rock` → ✅ `🪨 Rock + 💧 Water = 🪨 Boulder`)\n\n" +
    `**Enforcement Examples:**\n` +
    "- 🧟 Zombie + ☀️ Sun = ❌ Nothing (not 'Burning Zombie')\n" +
    "- 🔥 Fire + 🧊 Ice = 💧 Water (not 'Melted Ice')\n" +
    "- 🌸 Flower + 💧 Water = 🌺 Vase (not 'Watered Flower')\n\n" +
    `**Key Phrasing:** Combine elements to create **new standalone objects/concepts**, not modified states or descriptive versions of inputs. Prioritize transformations over descriptions.\n\n` +
    `**Edge Cases:**\n` +
    "- 🥛 Milk + 🍫 Cocoa = 🥤 Chocolate Milk (no cooking needed)\n" +
    "- 🪵 Wood + 🔥 Fire = 🔥 Campfire (valid without tools)\n" +
    "- 🌱 Seed + 💧 Water = 🌻 Flower (skip 'soil' for simplicity)\n\n" +
    `**Additional Test Examples:**\n` +
    "- 🧱 Brick + 🔥 Fire = 🧱 Hot Brick → ❌\n" +
    "- 🧱 Brick + 🔥 Fire = 🏺 Kiln → ✅\n" +
    "- 🌾 Wheat + 🪓 Axe = 🌾 Cut Wheat → ❌\n" +
    "- 🌾 Wheat + 🪓 Axe = 🥖 Bread → ✅ (if combined with 🔥 Fire later)\n" +
    "\n" +
      `**Examples of Valid/Invalid:**\n` +
      "✅ VALID:\n" +
      "🍞 Bread + 🧀 Cheese = 🥪 Sandwich\n" +
      "🔥 Fire + 🥪 Sandwich = 🧀 Grilled Cheese\n" +
      "❌ INVALID:\n" +
      "🍞 Bread + 🧀 Cheese = 🧀 Grilled Cheese (MISSING: 🔥 Fire)\n" +
      "🐄 Cow + 🌾 Wheat = 🍔 Burger (MISSING: 🔥 Fire)\n\n" +
      `**Response Format:**\n` +
      "If valid: Do not include any explanations or extra text. Output exactly one line in the following format:\n" +
    "[Emoji] [Name]\n\n" +
      "If invalid: Come up with something that fits all the guidelines and is close to the output generated initially and return according to the rule: Do not include any explanations or extra text. Output exactly one line in the following format:\n" +
    "[Emoji] [Name]\n\n" +
      "**Edge Cases:**\n" +
      "- 🥛 Milk + 🍫 Cocoa = 🥤 Chocolate Milk (no cooking needed)\n" +
      "- 🪵 Wood + 🔥 Fire = 🔥 Campfire (valid without tools)\n" +
      "- 🌱 Seed + 💧 Water = 🌻 Flower (skip 'soil' for simplicity)\n\n" +
      "Do not include any explanations or extra text. Output exactly one line in the following format:\n" +
    "[Emoji] [Name]\n\n" +
      `**Now Validate:** "${first} + ${second} = ${output}"` 
    );
  };
  
  exports.mixElements = async (req, res) => {
    const { first, second } = req.query;
    if (!first || !second) {
      return res
        .status(400)
        .json({ error: "Please provide both 'first' and 'second' query parameters." });
    }
  
    const prompt = buildPrompt(first, second);
  
    try {
      const mixChat = model.startChat();
      const mixResult = await mixChat.sendMessage(prompt);
      const output = mixResult.response.text();
  
      const validationPrompt = buildValidationPrompt(first, second, output);
      const validationChat = model.startChat();
      const validationResult = await validationChat.sendMessage(validationPrompt);
      const validationResponse = validationResult.response.text();
  
    //   res.json({ response: output, validation: validationResponse });
      res.json({ response: validationResponse });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to mix elements or validate combination.' });
    }
  };