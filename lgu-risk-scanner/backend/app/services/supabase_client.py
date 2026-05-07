from functools import lru_cache
from typing import Any

import httpx
from supabase import Client, create_client
from supabase.lib.client_options import SyncClientOptions

from app.config import settings


class SupabaseRepository:
    def __init__(self) -> None:
        if not settings.supabase_url or not settings.supabase_service_role_key:
            raise RuntimeError(
                "Supabase backend configuration is missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env."
            )
        self.http_client = httpx.Client(verify=settings.supabase_verify_ssl)
        options = SyncClientOptions(httpx_client=self.http_client)
        self.client: Client = create_client(settings.supabase_url, settings.supabase_service_role_key, options)

    def _table(self, table_name: str):
        query = self.client.table(table_name)
        query.session = self.http_client
        return query

    def select_all(self, table_name: str):
        return self._table(table_name).select("*").execute().data or []

    def select_one(self, table_name: str, column: str, value: Any):
        rows = self._table(table_name).select("*").eq(column, value).limit(1).execute().data or []
        return rows[0] if rows else None

    def insert(self, table_name: str, payload: dict[str, Any]):
        result = self._table(table_name).insert(payload).execute().data or []
        return result[0] if isinstance(result, list) and len(result) == 1 else result

    def upsert(self, table_name: str, payload: dict[str, Any], on_conflict: str = "id"):
        result = self._table(table_name).upsert(payload, on_conflict=on_conflict).execute().data or []
        return result[0] if isinstance(result, list) and len(result) == 1 else result

    def update(self, table_name: str, payload: dict[str, Any], filters: dict[str, Any]):
        query = self._table(table_name).update(payload)
        for column, value in filters.items():
            query = query.eq(column, value)
        result = query.execute().data or []
        return result[0] if isinstance(result, list) and len(result) == 1 else result


@lru_cache(maxsize=1)
def get_supabase_repository() -> SupabaseRepository:
    return SupabaseRepository()


supabase = get_supabase_repository().client
