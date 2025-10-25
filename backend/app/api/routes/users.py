from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.user import User, UserCreate, UserUpdate
from app.services.user_service import UserService

router = APIRouter()


def get_user_service(db: AsyncSession = Depends(get_db)) -> UserService:
    # Dependency injection for UserService
    return UserService(db)


@router.post("/", response_model=User)
async def create_user(
    user: UserCreate, service: UserService = Depends(get_user_service)
):
    try:
        db_user = await service.create_user(user.username, user.email, user.password)
        return db_user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{user_id}", response_model=User)
async def read_user(user_id: int, service: UserService = Depends(get_user_service)):
    user = await service.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/", response_model=List[User])
async def read_users(
    skip: int = 0, limit: int = 100, service: UserService = Depends(get_user_service)
):
    users = await service.get_users(skip, limit)
    return users


@router.put("/{user_id}", response_model=User)
async def update_user(
    user_id: int, user: UserUpdate, service: UserService = Depends(get_user_service)
):
    db_user = await service.update_user(user_id, user.model_dump(exclude_unset=True))
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@router.delete("/{user_id}")
async def delete_user(user_id: int, service: UserService = Depends(get_user_service)):
    success = await service.delete_user(user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted"}
