from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str 
    db_username: str
    db_password: str
    db_host: str
    db_name: str
    SECRET_KEY: str
    port: int

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'

settings = Settings()



