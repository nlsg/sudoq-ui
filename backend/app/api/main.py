from fastapi import APIRouter

from app.api.routes import items, login, users, utils, boards

api_router = APIRouter()
api_router.include_router(login.router)
api_router.include_router(users.router)
api_router.include_router(utils.router)
api_router.include_router(items.router)
api_router.include_router(boards.router, prefix="/boards", tags=["boards"])
