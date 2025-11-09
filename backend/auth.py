from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr, Field, validator
from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlmodel import SQLModel, Field as SQLField, Session, create_engine, select
import os
from dotenv import load_dotenv
import aiosmtplib
from email.message import EmailMessage

load_dotenv()

# Configuration from environment variables
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
RESET_TOKEN_EXPIRE_MINUTES = int(os.getenv("RESET_TOKEN_EXPIRE_MINUTES", "30"))
SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
FROM_EMAIL = os.getenv("FROM_EMAIL", "no-reply@example.com")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./ksh_Auth.db")

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Database setup
engine = create_engine(DATABASE_URL, echo=False)

class User(SQLModel, table=True):
    id: Optional[int] = SQLField(default=None, primary_key=True)
    name: str
    email: EmailStr = SQLField(index=True, nullable=False, unique=True)
    hashed_pw: str
    preferredLanguage: str = "en"
    region: str = "Delhi"
    created_at: datetime = SQLField(default_factory=datetime.utcnow)

# Pydantic models
class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=72)
    preferredLanguage: str = "en"
    region: str = "Delhi"

    @validator("password")
    def ensure_length(cls, v):
        if len(v.encode("utf-8")) > 72:
            raise ValueError("Password too long (max 72 bytes for bcrypt)")
        return v

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    token: str
    user: dict

class RequestPasswordReset(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

# Create tables before serving
SQLModel.metadata.create_all(engine)

router = APIRouter(prefix="/auth", tags=["Authentication"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Helpers
def hash_password(password: str) -> str:
    return pwd_context.hash(password[:72])

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict, expires_minutes: int = ACCESS_TOKEN_EXPIRE_MINUTES) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_reset_token(email: str, expires_minutes: int = RESET_TOKEN_EXPIRE_MINUTES) -> str:
    payload = {"sub": email, "type": "reset", "exp": datetime.utcnow() + timedelta(minutes=expires_minutes)}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def verify_reset_token(token: str) -> str:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "reset":
            raise HTTPException(status_code=400, detail="Invalid token type")
        return payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

async def send_reset_email(to_email: str, token: str):
    reset_link = f"{FRONTEND_URL}/reset-password?token={token}"
    message = EmailMessage()
    message["From"] = FROM_EMAIL
    message["To"] = to_email
    message["Subject"] = "Reset your KSHETRA password"
    message.set_content(
        f"Hi,\n\nYou requested a password reset. Click the link below to reset your password (valid for {RESET_TOKEN_EXPIRE_MINUTES} minutes):\n\n{reset_link}\n\nIf you did not request this, ignore this email.\n\nKSHETRA Team"
    )

    if not SMTP_HOST:
        # Dev fallback
        print("SMTP is not configured; printing reset link to console:")
        print(reset_link)
        return

    await aiosmtplib.send(
        message,
        hostname=SMTP_HOST,
        port=SMTP_PORT,
        username=SMTP_USER,
        password=SMTP_PASSWORD,
        start_tls=True,
    )

# Endpoints
@router.post("/register", response_model=TokenResponse)
def register(req: RegisterRequest):
    with Session(engine) as session:
        statement = select(User).where(User.email == req.email)
        existing = session.exec(statement).first()
        if existing:
            raise HTTPException(status_code=400, detail="User already exists")
        hashed_pw = hash_password(req.password)
        user = User(
            name=req.name,
            email=req.email,
            hashed_pw=hashed_pw,
            preferredLanguage=req.preferredLanguage,
            region=req.region,
        )
        session.add(user)
        session.commit()
        session.refresh(user)

        token = create_access_token({"sub": user.email})
        return TokenResponse(token=token, user={
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "preferredLanguage": user.preferredLanguage,
            "region": user.region
        })

@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest):
    with Session(engine) as session:
        statement = select(User).where(User.email == req.email)
        user = session.exec(statement).first()
        if not user or not verify_password(req.password, user.hashed_pw):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        token = create_access_token({"sub": user.email})
        return TokenResponse(token=token, user={
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "preferredLanguage": user.preferredLanguage,
            "region": user.region
        })

@router.post("/request-password-reset")
async def request_password_reset(body: RequestPasswordReset):
    with Session(engine) as session:
        statement = select(User).where(User.email == body.email)
        user = session.exec(statement).first()
        # Respond success even if user not found (avoid user enumeration)
        if not user:
            return {"msg": "If an account with that email exists, you will receive a reset link."}
        token = create_reset_token(user.email)
        await send_reset_email(user.email, token)
        return {"msg": "If an account with that email exists, you will receive a reset link."}

@router.post("/reset-password")
def reset_password(body: ResetPasswordRequest):
    email = verify_reset_token(body.token)
    with Session(engine) as session:
        statement = select(User).where(User.email == email)
        user = session.exec(statement).first()
        if not user:
            raise HTTPException(status_code=400, detail="Invalid token or user not found")
        user.hashed_pw = hash_password(body.new_password)
        session.add(user)
        session.commit()
    return {"msg": "Password changed successfully."}

def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid auth token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid auth token")
    with Session(engine) as session:
        statement = select(User).where(User.email == email)
        user = session.exec(statement).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user

@router.get("/me")
def me(user: User = Depends(get_current_user)):
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "preferredLanguage": user.preferredLanguage,
        "region": user.region,
    }
