from fastapi import APIRouter
from router.api.user import router as UserRouter

api_router = APIRouter(
    prefix="/api"
)

api_router.include_router(
    router=UserRouter
)