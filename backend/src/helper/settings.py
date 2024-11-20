from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    MONGODB_CONNECTION_STRING: str
    MONGODB_DATABASE_NAME: str
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str
    
    model_config = SettingsConfigDict(env_file=".env")

@lru_cache
def get_settings():
    return Settings()