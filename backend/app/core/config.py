from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "ELT Application"
    DATABASE_URL: str = "postgresql://username:password@localhost/dbname"

    class Config:
        env_file = ".env"

settings = Settings()