from fastapi import APIRouter

router = APIRouter()


@router.get("/test")
def test_utils():
    return {"message": "Utils test endpoint"}
