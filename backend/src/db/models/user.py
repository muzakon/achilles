from typing import Optional
from pydantic import BaseModel, Field, EmailStr
from pydantic.functional_validators import BeforeValidator
from typing_extensions import Annotated

PyObjectId = Annotated[str, BeforeValidator(str)]

# TODO: add is_active
class UserModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str = Field(...)
    last_name: str = Field(...)
    email: EmailStr = Field(...)
    password: str = Field(..., exclude=True)
    is_active: bool = Field(default=True)
    

    @property
    def get_collection_name(self) -> str:
        return "users"