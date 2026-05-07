from pathlib import Path
from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "lgu-risk-scanner"
    supabase_url: str = ""
    supabase_service_role_key: str = ""
    supabase_verify_ssl: bool = True
    llm_api_url: Optional[str] = None
    llm_api_key: Optional[str] = None
    llm_model: str = "llama3.2:3b"
    database_url: Optional[str] = None
    cors_origins: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000"
    cors_origin_regex: Optional[str] = r"^http://(localhost|127\.0\.0\.1):\d+$"

    model_config = SettingsConfigDict(env_file=Path(__file__).resolve().parents[1] / ".env", extra="ignore")

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
