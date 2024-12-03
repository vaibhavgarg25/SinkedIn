// const GEMINI_API_URL =
//   "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
const API_KEY = "AIzaSyB4PM84wBW1ZQaRD2Zxl2AtAnEJCSbRni0";


const { GoogleGenerativeAI } = require("@google/generative-ai");
const { type } = require("os");
const genAI = new GoogleGenerativeAI(API_KEY);

const validate = async (req, res) => {
  let text = req.body;
  console.log(text) 
  console.log(typeof(JSON.stringify(text)))
  
  //   if (!text || typeof text !== "string") {
    //     return res.status(400).json({ message: "Invalid input" });
    //   }
    
    text=JSON.stringify(text)
    try {
    console.log("Sending request to Gemini API:", { text });
    const prompt=`Evaluate the statement below and figure out if it is sad or not .send 0 if Not sad else send 1 and the statement is ${text}. return as 1 or 0 only. no other text`
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);


    console.log(result.response.text())
    // if (!result.ok) {
    //   console.error(
    //     "Error from Gemini API:",
    //     result.status,
    //     result.statusText
    //   );
    //   throw new Error(`Gemini API error: ${response.statusText}`);
    // }
  
    const response = result.response.text()
    console.log(response)
    console.log("Gemini API Response:", response);
  
    // Adjust based on actual API response format
    // const isSad = response?.sentiment === "negative";
    // res.status(200).json({ sad: 'isSad' });
  return res.status(200).json(response)
  } catch (error) {
    console.error("Error while calling Gemini API:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
};

module.exports = { validate };