import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth import router as auth_router

app = FastAPI()
app.include_router(auth_router, prefix="/auth")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# This line is for the hardcoded API key fix.
# from dotenv import load_dotenv
# load_dotenv()

app = FastAPI()

origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

local_knowledge_base = {
    "Delhi": {
        "health": {
            "context": "Delhi's local health services include dispensaries like Mohalla Clinics, Polyclinics, and major government hospitals such as AIIMS Delhi and Safdarjung Hospital. For emergencies, dial 102.",
            "sources": ["Delhi Health Department Website", "Mohalla Clinic Initiative"]
        },
        "transport": {
            "context": "The public transport system in Delhi is extensive, featuring the Delhi Metro (DMRC), a large fleet of DTC buses, and auto-rickshaws. The Metro is considered the most efficient way to travel across the city.",
            "sources": ["Delhi Metro Rail Corporation (DMRC)", "Delhi Transport Corporation (DTC)"]
        }
    },
    "Mumbai": {
        "health": {
            "context": "In Mumbai, public health services are primarily provided by BMC-run hospitals like KEM, Sion, and Nair Hospitals. A vast network of private clinics and hospitals also operates throughout the city.",
            "sources": ["Brihanmumbai Municipal Corporation (BMC) Health Dept", "Maharashtra State Health Portal"]
        },
        "transport": {
            "context": "Mumbai's public transport is dominated by its extensive local train network, which serves as the city's lifeline. Additionally, BEST buses cover routes where trains do not reach.",
            "sources": ["Mumbai Local Railway Timetables", "BEST Bus Services Official"]
        }
    }
}

# --- MODIFIED SECTION START ---
# We are making this function smarter with more keywords.

def get_local_context(region: str, query: str):
    """
    A smarter retrieval function for our RAG system.
    It finds the best context and sources from our knowledge base.
    """
    region_data = local_knowledge_base.get(region, {})
    normalized_query = query.lower()
    
    # Expanded keywords for better matching
    health_keywords = ["health", "hospital", "doctor", "clinic", "emergency", "medical"]
    transport_keywords = ["transport", "metro", "bus", "train", "travel", "commute", "route"]
    
    if any(keyword in normalized_query for keyword in health_keywords):
        return region_data.get("health", {"context": f"I do not have specific health information for {region}.", "sources": []})
    
    if any(keyword in normalized_query for keyword in transport_keywords):
        return region_data.get("transport", {"context": f"I do not have specific transport information for {region}.", "sources": []})
    
    # Fallback if no keywords match
    return {"context": f"I do not have specific information for your query about '{query}' in {region}. Please try asking about health or transport.", "sources": ["General Knowledge"]}

# --- MODIFIED SECTION END ---

class QueryRequest(BaseModel):
    query: str
    language: str
    region: str

class QueryResponse(BaseModel):
    response: str
    sources: list[str]

# --- MODIFIED SECTION START ---
# We are making the instructions to the AI much stricter.

prompt = PromptTemplate.from_template(
    """
    You are KSHETRA, an expert AI assistant providing region-specific information.
    Your answer MUST be based ONLY on the "Local Context" provided. Do not use any external knowledge.
    If the context does not contain the answer, you MUST state that you don't have the specific local information.
    Your final response MUST be written in the following language: {language}.

    Local Context:
    "{context}"

    User's Question:
    "{query}"

    Helpful Answer in {language}:
    """
)
# --- MODIFIED SECTION END ---

# Replace "YOUR_GEMINI_API_KEY_HERE" with your actual key if you haven't already
llm = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key="YOUR_GEMINI_API_KEY_HERE")
chain = prompt | llm | StrOutputParser()

@app.post("/api/query", response_model=QueryResponse)
async def process_query(request: QueryRequest):
    retrieved_data = get_local_context(request.region, request.query)
    context = retrieved_data["context"]
    sources = retrieved_data["sources"]
    ai_response = chain.invoke({
        "language": request.language,
        "context": context,
        "query": request.query
    })
    return QueryResponse(response=ai_response, sources=sources)

@app.get("/")
def read_root():
    return {"status": "KSHETRA Backend is running!"}