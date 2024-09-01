from fastapi import APIRouter

from api.routes import process, get_processed_data

api_router = APIRouter()
api_router.include_router(process.router, prefix="/process", tags=["process"])
api_router.include_router(get_processed_data.router, prefix="/get_processed_data", tags=["get-processed"])