from typing import Optional
from pydantic import BaseModel, Field
from pydantic.functional_validators import BeforeValidator
from typing_extensions import Annotated

PyObjectId = Annotated[str, BeforeValidator(str)]

class Upscale(BaseModel):
    url: str

class ImageMeta(BaseModel):
    upscale: Optional[Upscale] = None

class ImageModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: PyObjectId
    prompt: str
    model: str
    meta: Optional[ImageMeta] = None
    created_at: str
    updated_at: str

    @property
    def get_collection_name(self) -> str:
        return "images"