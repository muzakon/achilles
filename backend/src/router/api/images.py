from fastapi import APIRouter, Request, HTTPException
from db.models.user import UserModel
from db.models.image import ImageModel
from db.schemas.image import GenerateImage

from motor.motor_asyncio import AsyncIOMotorCollection
from helper.gcs import StorageHelper
import random

router = APIRouter(
    prefix="/images",
    tags=["images"],
)

image_urls = [
    "https://cdn.leonardo.ai/users/cc5e51d8-282c-4d02-b7fd-2e13a2e2c743/generations/07344a57-c4f0-4303-98b7-46c50a4e3607/AlbedoBase_XL_a_closeup_photograph_featuring_a_reflective_surf_0.jpg",
    "https://cdn.leonardo.ai/users/20cceea6-0e97-493e-96a5-9dbea040a87d/generations/94a174b7-cf59-4474-86dc-d05f30a38159/Leonardo_Phoenix_a_cinematic_highcontrast_photograph_of_desola_1.jpg",
    "https://cdn.leonardo.ai/users/94988fc4-e976-446a-bc3e-63b711f0b679/generations/94a1c1cc-3c4b-4000-a990-194cd49a7bd3/Leonardo_Anime_XL_Viral_anime_nature_wallpaper_in_4K_quality_i_3.jpg",
    "https://cdn.leonardo.ai/users/02faef4d-e8dc-47e4-aa80-88fceede6e12/generations/2a0a5091-e787-404b-84b8-e10bf907b315/AlbedoBase_XL_interior_view_of_a_whimsical_cozy_warm_enchanted_2.jpg"
]

@router.post("/generate")
async def generate_image(request: Request, request_data: GenerateImage):
    random_number = random.randint(0, len(image_urls) - 1)
    random_image = image_urls[random_number]

    storageHelper = StorageHelper()
    result = storageHelper.upload_image_from_url(destination="test/test.jpg", url=random_image)
    if result:
        return {
            "url": result
        }

    raise HTTPException(
        status_code=400,
        detail="Failed to generate image"
    )