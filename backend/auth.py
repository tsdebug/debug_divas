# backend/auth.py
from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta

router = APIRouter()

# In a real app, use a database. For demo, store users in memory.
fake_users_db = {}

SECRET_KEY = "super-secret-key-change-this"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(BaseModel):
    id: str
    name: str
    email: str
    preferredLanguage: str
    region: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    preferredLanguage: str = "en"
    region: str = "Delhi"

class LoginRequest(BaseModel):
    email: str
    password: str

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/register")
def register(req: RegisterRequest):
    if req.email in fake_users_db:
        raise HTTPException(status_code=400, detail="User already exists")
    hashed_pw = pwd_context.hash(req.password)
    fake_users_db[req.email] = {"hashed_pw": hashed_pw, "name": req.name}
    token = create_access_token({"sub": req.email})
    return {"token": token, "user": req.dict(exclude={"password"})}

@router.post("/login")
def login(req: LoginRequest):
    user = fake_users_db.get(req.email)
    if not user or not pwd_context.verify(req.password, user["hashed_pw"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": req.email})
    return {"token": token, "user": {"email": req.email, "name": user["name"]}}
