from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base

from app.config import settings

DATABASE_URL = (
    f"sqlite+aiosqlite:///./{settings.PROJECT_NAME}.db"
    if settings.ENVIRONMENT == "local"
    else f"{settings.SQLALCHEMY_DATABASE_URI}"
)

engine = create_async_engine(DATABASE_URL)  # , echo=True)

AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

Base = declarative_base()


# Import models to register them
from app.db import User, SudokuBoard  # ignore: F401


# Dependency for FastAPI
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session


# Function to create all tables
async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
