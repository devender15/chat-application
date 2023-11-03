from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes.urls import router

app = FastAPI()

# including  routing
app.include_router(router, prefix="/v1")

# Allow requests from any domain
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)