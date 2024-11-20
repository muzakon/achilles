from pydantic import BaseModel, EmailStr

class CreateUser(BaseModel):
    name: str
    last_name: str
    email: EmailStr
    password: str
    password_verify: str

class LoginUserDto(BaseModel):
    email: EmailStr
    password: str