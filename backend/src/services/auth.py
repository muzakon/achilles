from motor.motor_asyncio import AsyncIOMotorCollection, AsyncIOMotorDatabase
from fastapi import HTTPException, status
from db.schemas.user import CreateUser, LoginUserDto
from db.schemas.auth import TokenResponse
from helper.auth import AuthHelper

class AuthService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.auth_helper = AuthHelper()  # Initialize AuthHelper only once

    async def login(self, request_data: LoginUserDto) -> TokenResponse:
        """
        Registers a new user by validating input data, creating the user in the database, 
        and generating authentication tokens (access and refresh tokens).
        """
        user_collection: AsyncIOMotorCollection = self.db.get_collection("users")

        # Check if user exists or not in the database
        user = await user_collection.find_one({"email": request_data.email})
        if not user:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User does not exist")

        # Generate access and refresh tokens
        access_token, refresh_token = self._generate_tokens(user)

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="Bearer"
        )

    async def register(self, request_data: CreateUser) -> TokenResponse:
        """
        Registers a new user by validating input data, creating the user in the database, 
        and generating authentication tokens (access and refresh tokens).
        """
        user_collection: AsyncIOMotorCollection = self.db.get_collection("users")
        
        # Validate that password and password_verify match
        self._validate_passwords(request_data.password, request_data.password_verify)

        # Check if user already exists in the database
        await self._check_user_exists(user_collection, request_data.email)
        
        # Create the new user in the database
        user = await self._create_user(user_collection, request_data)

        # Generate access and refresh tokens
        access_token, refresh_token = self._generate_tokens(user)

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="Bearer"
        )

    def _validate_passwords(self, password: str, password_verify: str):
        """
        Validates that the password and password_verify fields match.
        """
        if password != password_verify:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Passwords do not match")

    async def _check_user_exists(self, user_collection: AsyncIOMotorCollection, email: str):
        """
        Checks if the user already exists in the database by email.
        """
        user = await user_collection.find_one({"email": email})
        if user:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")

    async def _create_user(self, user_collection: AsyncIOMotorCollection, request_data: CreateUser):
        """
        Creates a new user in the database and returns the created user document.
        """
        hashed_password = self.auth_helper.get_password_hash(request_data.password)
        result = await user_collection.insert_one({
            "name": request_data.name,
            "last_name": request_data.last_name,
            "email": request_data.email,
            "password": hashed_password
        })

        # Retrieve the inserted user document
        return await user_collection.find_one({"_id": result.inserted_id})

    def _generate_tokens(self, user: dict) -> tuple:
        """
        Generates access and refresh tokens for the user.
        """
        user_id = str(user["_id"])
        access_token = self.auth_helper.create_token(data={"id": user_id}, token_type="access")
        refresh_token = self.auth_helper.create_token(data={"id": user_id}, token_type="refresh")
        return access_token, refresh_token