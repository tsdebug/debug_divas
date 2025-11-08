from fastapi import FastAPI # type: ignore
from pydantic import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI
from langdetect import detect

# Initialize FastAPI app
app = FastAPI(title="Gemini LangChain Backend")

# Replace with your actual Gemini API key
GOOGLE_API_KEY = "AIzaSyAQT1_Ne_53pkaa6lgl3ZjPSOetL7Ey-2U"

# Initialize Gemini LLM via LangChain
llm = ChatGoogleGenerativeAI(
    model="gemini-pro",
    google_api_key=GOOGLE_API_KEY,
    temperature=0.7,
)

# Request model
class Query(BaseModel):
    prompt: str

# Root route
@app.get("/")
def root():
    return {"message": "✅ Gemini LangChain Backend is running successfully!"}

# POST endpoint for generating AI responses
@app.post("/generate")
def generate_text(data: Query):
    detected_lang = detect(data.prompt)  # auto-detect language
    # explicitly tell Gemini to respond in detected language
    system_instruction = f"Reply only in this language: {detected_lang}. Respond in {detected_lang} no matter what."
    prompt_with_instruction = system_instruction + "\n" + data.prompt
    response = llm.invoke(data.prompt)
    return {"response": response}
