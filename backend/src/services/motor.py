from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import FastAPI
from helper.settings import get_settings


settings = get_settings()

class MotorService:
    @staticmethod
    async def startup_db_client(app: FastAPI):
        app.mongodb_client = AsyncIOMotorClient(
            settings.MONGODB_CONNECTION_STRING
        )
        
        app.mongodb = app.mongodb_client.get_database(settings.MONGODB_DATABASE_NAME)
        print("MongoDB connected.")

    @staticmethod
    async def shutdown_db_client(app: FastAPI):
        app.mongodb_client.close()
        print("Database disconnected.")