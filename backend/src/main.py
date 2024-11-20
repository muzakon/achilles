from fastapi import FastAPI
from contextlib import asynccontextmanager
from services.motor import MotorService


# Routers
from router.base import api_router
from router.auth import auth_router

# define a lifespan method for fastapi
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start the database connection
    await MotorService.startup_db_client(app=app)
    yield
    # Close the database connection
    await MotorService.shutdown_db_client(app=app)


app = FastAPI(lifespan=lifespan)
app.include_router(api_router)
app.include_router(auth_router)


@app.get("/")
async def read_root():
    return {"Hello": "World"}