# check_models.py
import os
import google.generativeai as genai

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

print("Listing available models for this API key:\n")
models = genai.list_models()
for m in models:
    print("-", m.name)
