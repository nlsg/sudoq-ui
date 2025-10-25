from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.users.models import User as UserModel


class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_user_by_email(self, email: str):
        result = await self.db.execute(
            select(UserModel).where(UserModel.email == email)
        )
        return result.scalar_one_or_none()

    async def create_user(self, username: str, email: str, password: str):
        existing = await self.get_user_by_email(email)
        if existing:
            raise ValueError("Email already registered")
        db_user = UserModel(
            username=username,
            email=email,
            hashed_password=password,  # Note: In real app, hash this
        )
        self.db.add(db_user)
        await self.db.commit()
        await self.db.refresh(db_user)
        return db_user

    async def get_user(self, user_id: int):
        result = await self.db.execute(select(UserModel).where(UserModel.id == user_id))
        return result.scalar_one_or_none()

    async def get_users(self, skip: int = 0, limit: int = 100):
        result = await self.db.execute(select(UserModel).offset(skip).limit(limit))
        return result.scalars().all()

    async def update_user(self, user_id: int, update_data: dict):
        user = await self.get_user(user_id)
        if not user:
            return None
        for key, value in update_data.items():
            if hasattr(user, key):
                setattr(user, key, value)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def delete_user(self, user_id: int):
        user = await self.get_user(user_id)
        if not user:
            return False
        await self.db.delete(user)
        await self.db.commit()
        return True
