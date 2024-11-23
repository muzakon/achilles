from google.cloud import storage
from google.cloud.storage.bucket import Bucket
from helper.settings import get_settings
import requests

class StorageHelper:
    def __init__(self):
        settings = get_settings()
        storage_client = storage.Client()
        self.bucket: Bucket = storage_client.bucket(settings.GCS_BUCKET_NAME)

    def upload_image_from_url(self, destination: str, url: str):
        try:
            request = requests.get(url)
            request.raise_for_status()

            blob = self.bucket.blob(destination)

            blob.upload_from_string(
                data=request.content, 
                content_type="image/jpeg", 
            )
            
            blob.make_public()
            return blob.public_url
        
        except Exception as e:
            print(e)
            return False
