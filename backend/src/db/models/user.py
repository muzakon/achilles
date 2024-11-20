from typing import Optional
from pydantic import BaseModel, Field, EmailStr
from pydantic.functional_validators import BeforeValidator
from typing_extensions import Annotated

PyObjectId = Annotated[str, BeforeValidator(str)]

class UserModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str = Field(...)
    last_name: str = Field(...)
    email: EmailStr = Field(...)
    password: str = Field(..., exclude=True)
    

    # model_config = ConfigDict(
    #     populate_by_name=True,
    #     arbitrary_types_allowed=True,
    #     json_schema_extra={
    #         "example": {
    #             "name": "Jane Doe",
    #             "email": "jdoe@example.com",
    #             "course": "Experiments, Science, and Fashion in Nanophotonics",
    #             "gpa": 3.0,
    #         }
    #     },
    # )

class UserCollection(BaseModel):
    users: list[UserModel]