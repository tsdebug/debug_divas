import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from auth import router as auth_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth import router as auth_router



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

@app.get("/")
def home():
    return {"status": "Backend running successfully"}



# --- LangChain imports ---
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI

# --- Auth import ---
from auth import router as auth_router

# --- Load environment variables ---
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "YOUR_GEMINI_API_KEY_HERE")

# --- Initialize FastAPI app ---
app = FastAPI(title="KSHETRA - Localized GenAI System")
app.include_router(auth_router, prefix="/auth")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Local Knowledge Base ---
local_knowledge_base = {
    "Delhi": {
        "health": {
            "context": (
                "Delhi's public healthcare network includes Mohalla Clinics, Polyclinics, "
                "and large hospitals like AIIMS Delhi and Safdarjung Hospital. "
                "For emergencies, dial 102 or visit the nearest government facility."
            ),
            "sources": [
                "Delhi Health Department Website",
                "Mohalla Clinic Initiative"
            ]
        },
        "transport": {
            "context": (
                "Delhi has an advanced transport system, including the Delhi Metro (DMRC), "
                "DTC buses, and auto-rickshaws. The Metro is considered the fastest and safest way "
                "to travel across the city."
            ),
            "sources": [
                "Delhi Metro Rail Corporation (DMRC)",
                "Delhi Transport Corporation (DTC)"
            ]
        }
    },
    "Mumbai": {
        "health": {
            "context": (
                "Mumbai's public health services are primarily provided by BMC-run hospitals such as "
                "KEM, Sion, and Nair. Numerous private clinics and hospitals also operate citywide."
            ),
            "sources": [
                "Brihanmumbai Municipal Corporation (BMC) Health Dept",
                "Maharashtra State Health Portal"
            ]
        },
        "transport": {
            "context": (
                "Mumbai's public transport is centered around its local train network, supported by "
                "BEST buses and auto-rickshaws. The suburban railway is known as Mumbai's lifeline."
            ),
            "sources": [
                "Mumbai Local Railway Timetables",
                "BEST Bus Services Official"
            ]
        }
    }
}

# --- Smarter context retriever ---
def get_local_context(region: str, query: str):
    region_data = local_knowledge_base.get(region, {})
    normalized_query = query.lower()

    health_keywords = ["health", "hospital", "doctor", "clinic", "emergency", "medical", "medicine"]
    transport_keywords = ["transport", "metro", "bus", "train", "travel", "commute", "route"]

    if any(keyword in normalized_query for keyword in health_keywords):
        return region_data.get("health", {
            "context": f"I do not have health info for {region}.",
            "sources": []
        })

    if any(keyword in normalized_query for keyword in transport_keywords):
        return region_data.get("transport", {
            "context": f"I do not have transport info for {region}.",
            "sources": []
        })

    return {
        "context": f"No data found for your query about '{query}' in {region}.",
        "sources": ["General Knowledge"]
    }

# --- LangChain prompt ---
prompt = PromptTemplate.from_template("""
You are *KSHETRA*, a region-aware multilingual assistant.

Your tasks:
1. Always answer ONLY in {language} (e.g., if language=Hindi, write fully in Hindi, not English or Bengali).
2. Use only the local context provided below — do NOT invent facts.
3. If the local context does not answer the query, say clearly in {language}:
   "Mujhe is vishay par {region} ke liye jaankari nahi hai." (if Hindi)
4. Be concise and helpful.

---------------------
📍 Local Context:
{context}

🧠 User Query:
{query}

💬 Final Answer (in {language}):
""")

# --- Initialize Gemini LLM ---
llm = ChatGoogleGenerativeAI(
    model="gemini-pro",
    google_api_key=GOOGLE_API_KEY,
    temperature=0,          # make responses consistent
    max_output_tokens=256,  # keep answers concise
)

chain = prompt | llm | StrOutputParser()

# --- Request/Response Models ---
class QueryRequest(BaseModel):
    query: str
    language: str
    region: str

class QueryResponse(BaseModel):
    response: str
    sources: list[str]

# --- Endpoint for queries ---
@app.post("/api/query", response_model=QueryResponse)
async def process_query(request: QueryRequest):
    retrieved_data = get_local_context(request.region, request.query)
    context = retrieved_data["context"]
    sources = retrieved_data["sources"]

    response = chain.invoke({
        "language": request.language,
        "context": context,
        "query": request.query,
        "region": request.region
    })

    return QueryResponse(response=response.strip(), sources=sources)

@app.get("/")
def read_root():
    return {"status": "✅ KSHETRA Backend is running!"}
