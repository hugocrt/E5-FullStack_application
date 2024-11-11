import uvicorn
from contextlib import asynccontextmanager
from models.database import BaseSQL, engine
from fastapi import FastAPI
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware

import routes

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


@asynccontextmanager
async def lifespan(the_app):
    print('starting lifespan')
    BaseSQL.metadata.create_all(bind=engine)
    yield

app = FastAPI(lifespan=lifespan, debug=True)

app.include_router(routes.auth_router)

app.include_router(routes.user_router)
app.include_router(routes.post_router)
app.include_router(routes.comment_router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Hello World"}


def main():
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=5000,
    )


if __name__ == '__main__':
    main()
