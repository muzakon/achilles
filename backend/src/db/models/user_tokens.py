from typing import Optional
from pydantic import BaseModel, Field, EmailStr
from pydantic.functional_validators import BeforeValidator
from typing_extensions import Annotated

PyObjectId = Annotated[str, BeforeValidator(str)]

class UserTokenModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: PyObjectId
    token: str

    @property
    def get_collection_name(self) -> str:
        return "user_tokens"