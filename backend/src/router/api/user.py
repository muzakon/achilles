from fastapi import APIRouter, Request
from db.models.user import UserModel
from motor.motor_asyncio import AsyncIOMotorCollection
from typing import List

router = APIRouter(
    prefix="/users",
    tags=["users"],
)

@router.get("/all", tags=["users"], response_model=list[UserModel])
async def get_all_users(request: Request):
    user_collection: AsyncIOMotorCollection = request.app.mongodb.get_collection(UserModel.get_collection_name)

    return await user_collection.find().to_list()