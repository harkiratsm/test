# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.main import api_router
from core.database import init_db

app = FastAPI()    

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(api_router)

if __name__ == "__main__":
    init_db()
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)