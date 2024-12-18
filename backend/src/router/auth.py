from fastapi import APIRouter, Request, status
from db.schemas.user import CreateUser, LoginUserDto
from db.schemas.auth import TokenResponse

from services.auth import AuthService

auth_router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)

@auth_router.post(
        "/register", 
        tags=["auth"], 
        response_model=TokenResponse, 
        status_code=status.HTTP_201_CREATED,
        summary="Register a new user"
    )
async def register(request: Request, requestData: CreateUser):
    authService = AuthService(db=request.app.mongodb)
    return await authService.register(request_data=requestData)

@auth_router.post(
        "/login", 
        tags=["auth"], 
        response_model=TokenResponse,
        status_code=status.HTTP_200_OK,
        summary="Login a user"
    )
async def login(request: Request, requestData: LoginUserDto):
    authService = AuthService(db=request.app.mongodb)
    return await authService.login(request_data=requestData)