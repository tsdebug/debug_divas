from fastapi import FastAPI # type: ignore
from pydantic import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI
from langdetect import detect

from auth import router as auth_router  # Import your auth router

# Initialize FastAPI app
app = FastAPI(title="Gemini LangChain Backend")

app = FastAPI()

app.include_router(auth_router)       


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

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth import router as auth_router

app = FastAPI()

# Allow frontend origin, adjust URL accordingly
origins = [
    "http://localhost:3000",  # your frontend URL
    # other URLs if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # or ["*"] to allow all origins (not recommended for production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
