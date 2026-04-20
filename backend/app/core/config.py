"""
Configuration module for PrintShop CRM application.

This module uses pydantic_settings to manage application configuration
from environment variables and .env files.
"""

from typing import List
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings class.
    
    All settings can be overridden via environment variables or .env file.
    """
    
    # Database Configuration
    PRINTSHOP_DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/postgres"
    PRINTSHOP_DIRECT_URL: str | None = None
    
    # JWT Configuration
    SECRET_KEY: str = "your-secret-key-here-change-in-production-use-openssl-rand-hex-32"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS Configuration
    BACKEND_CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost",
        "http://127.0.0.1",
        "capacitor://localhost",
        "ionic://localhost",
        "http://localhost:8100",
        "http://192.168.0.101:5173",
    ]
    
    # Optional: Additional settings
    PROJECT_NAME: str = "PrintShop CRM"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: str | List[str]) -> List[str]:
        """
        Parse CORS origins from string or list.
        
        Allows BACKEND_CORS_ORIGINS to be provided as a comma-separated string
        or as a list in the .env file.
        """
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8-sig",
        case_sensitive=True,
        extra="ignore"
    )

    @staticmethod
    def _normalize_postgres_url(url: str) -> str:
        """
        Normalize Supabase/PostgreSQL URLs for SQLAlchemy/psycopg2.

        Supabase pooling strings can contain `pgbouncer=true`, which is not a valid
        psycopg2 DSN argument and causes startup failure.
        """
        if not url.startswith("postgresql://") and not url.startswith("postgres://"):
            return url

        split_url = urlsplit(url)
        query_params = dict(parse_qsl(split_url.query, keep_blank_values=True))
        query_params.pop("pgbouncer", None)
        query_params.setdefault("sslmode", "require")

        return urlunsplit(
            (
                split_url.scheme,
                split_url.netloc,
                split_url.path,
                urlencode(query_params),
                split_url.fragment,
            )
        )

    @property
    def sqlalchemy_database_url(self) -> str:
        return self._normalize_postgres_url(self.PRINTSHOP_DATABASE_URL)

    @property
    def sqlalchemy_direct_url(self) -> str | None:
        if not self.PRINTSHOP_DIRECT_URL:
            return None
        return self._normalize_postgres_url(self.PRINTSHOP_DIRECT_URL)


# Create settings instance for use throughout the application
settings = Settings()
