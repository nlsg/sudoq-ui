from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from starlette.middleware.cors import CORSMiddleware

from app.api.main import api_router
from app.config import settings
from app.database import create_tables


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_tables()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    lifespan=lifespan,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)


# Set all CORS enabled origins
if settings.all_cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.all_cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


app.include_router(api_router, prefix=settings.API_V1_STR)


# Serve frontend
frontend_dist_path = Path(__file__).parent / "../public"
app.mount(
    "/assets",
    StaticFiles(directory=frontend_dist_path / "assets"),
    name="assets",
)


@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    if full_path.startswith("api"):
        return {"detail": "Not found"}
    return FileResponse(frontend_dist_path / "index.html")
