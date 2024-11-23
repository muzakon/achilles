from pydantic import BaseModel

class GenerateImage(BaseModel):
    prompt: str