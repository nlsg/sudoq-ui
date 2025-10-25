from fastapi import APIRouter

from app.api.routes import users, boards

api_router = APIRouter()
api_router.include_router(users.router)
api_router.include_router(boards.router, prefix="/boards", tags=["boards"])
