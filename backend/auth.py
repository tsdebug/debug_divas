# backend/auth.py
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from jose import jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Dict

router = APIRouter(prefix="/auth", tags=["Authentication"])

# ---------------- CONFIG ----------------
SECRET_KEY = "super-secret-key-change-this"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# In-memory database (for demo)
fake_users_db: Dict[str, Dict] = {}

# ---------------- MODELS ----------------
class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    preferredLanguage: str = "en"
    region: str = "Delhi"

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: str
    name: str
    email: EmailStr
    preferredLanguage: str
    region: str

class TokenResponse(BaseModel):
    token: str
    user: UserOut

# ---------------- HELPERS ----------------
def create_access_token(data: dict, expires_minutes: int = ACCESS_TOKEN_EXPIRE_MINUTES):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ---------------- ENDPOINTS ----------------

@router.post("/register", response_model=TokenResponse)
def register(req: RegisterRequest):
    """
    Register a new user.
    """
    if req.email in fake_users_db:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_pw = pwd_context.hash(req.password)
    user_id = f"user-{int(datetime.utcnow().timestamp())}"

    fake_users_db[req.email] = {
        "id": user_id,
        "name": req.name,
        "email": req.email,
        "hashed_pw": hashed_pw,
        "preferredLanguage": req.preferredLanguage,
        "region": req.region,
    }

    token = create_access_token({"sub": req.email})
    user_out = UserOut(
        id=user_id,
        name=req.name,
        email=req.email,
        preferredLanguage=req.preferredLanguage,
        region=req.region,
    )
    return {"token": token, "user": user_out}


@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest):
    """
    Log in a registered user.
    """
    user = fake_users_db.get(req.email)
    if not user or not pwd_context.verify(req.password, user["hashed_pw"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token({"sub": req.email})
    user_out = UserOut(
        id=user["id"],
        name=user["name"],
        email=user["email"],
        preferredLanguage=user["preferredLanguage"],
        region=user["region"],
    )
    return {"token": token, "user": user_out}


@router.post("/guest", response_model=TokenResponse)
def guest_login():
    """
    Instantly allow guest access with a temporary token.
    """
    guest_id = f"guest-{int(datetime.utcnow().timestamp())}"
    guest_email = f"{guest_id}@guest.local"

    guest_user = UserOut(
        id=guest_id,
        name="Guest User",
        email=guest_email,
        preferredLanguage="en",
        region="Delhi"
    )

    token = create_access_token({"sub": guest_email}, expires_minutes=30)
    return {"token": token, "user": guest_user}
