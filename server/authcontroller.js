const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
const API_KEY = "AIzaSyAy8EQnDP5J4YPKQzXMLAf5Z7WYGqrZtTE";
const validate = async (req, res) => {
  const text = req.body;
  console.log(text) 
//   if (!text || typeof text !== "string") {
//     return res.status(400).json({ message: "Invalid input" });
//   }

  try {
    console.log("Sending request to Gemini API:", { text });
  
    const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: {
          text: `Analyze the sentiment of this text: "${text}"`,
        },
      }),
    });
  
    if (!response.ok) {
      console.error(
        "Error from Gemini API:",
        response.status,
        response.statusText
      );
      throw new Error(`Gemini API error: ${response.statusText}`);
    }
  
    const result = await response.json();
    console.log("Gemini API Response:", result);
  
    // Adjust based on actual API response format
    const isSad = result?.sentiment === "negative";
    // res.status(200).json({ sad: 'isSad' });
  return res.status
  } catch (error) {
    console.error("Error while calling Gemini API:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
};

module.exports = { validate };
