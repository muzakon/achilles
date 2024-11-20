from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta, timezone
from helper.settings import get_settings
from fastapi import Depends, HTTPException, status
from typing import Annotated, Union, Literal
import jwt, bcrypt
from jwt.exceptions import InvalidTokenError
from pydantic import BaseModel
from dataclasses import dataclass

settings = get_settings()

@dataclass
class SolveBugBcryptWarning:
    __version__: str = getattr(bcrypt, "__version__")

setattr(bcrypt, "__about__", SolveBugBcryptWarning())

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Union[str, None] = None

class AuthHelper:
    oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def verify_password(self, plain_password, hashed_password):
        return self.pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password):
        return self.pwd_context.hash(password)
    
    @staticmethod
    def create_token(data: dict, token_type: str = Literal["access", "refresh"]):
        tokenData = {
            "sub": data,
            "exp": datetime.now(timezone.utc) + timedelta(minutes=1) if token_type == "access" else datetime.now(timezone.utc) + timedelta(days=7)
        }

        encoded_jwt = jwt.encode(tokenData, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
        return encoded_jwt
    
    @staticmethod
    async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
            username: str = payload.get("sub")
            if username is None:
                raise credentials_exception
            
            token_data = TokenData(username=username)

        except InvalidTokenError:
            raise credentials_exception
        
        user = {
            "username": token_data.username
        }

        if user is None:
            raise credentials_exception
        return user