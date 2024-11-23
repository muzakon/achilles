from fastapi import APIRouter
from router.api.user import router as UserRouter
from router.api.images import router as ImageRouter

api_router = APIRouter(
    prefix="/api"
)

api_router.include_router(
    router=UserRouter
)

api_router.include_router(
    router=ImageRouter
)