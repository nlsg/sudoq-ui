from fastapi import APIRouter

from app.users.routes import router as users_router
from app.boards.routes import router as boards_router

api_router = APIRouter()
api_router.include_router(users_router)
api_router.include_router(boards_router, prefix="/boards", tags=["boards"])
