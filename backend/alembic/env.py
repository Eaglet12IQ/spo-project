import os
from logging.config import fileConfig
from sqlalchemy import create_engine
from sqlalchemy import pool
from alembic import context

# Импортируйте ваши модели
from app.models.base import Base
from app.models.user import User
from app.models.role import Role
from app.models.collector import Collector
from app.models.collection import Collection
from app.models.stamp import Stamp

# Установите target_metadata
target_metadata = Base.metadata

# Получение конфигурации Alembic
config = context.config

# Настройка логирования из alembic.ini
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    # Используем DATABASE_URL из переменной окружения
    url = os.getenv("DATABASE_URL", "postgresql://postgres:12345@localhost:5432/marki")
    if not url:
        raise ValueError("DATABASE_URL environment variable is not set")

    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    # Используем DATABASE_URL из переменной окружения
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise ValueError("DATABASE_URL environment variable is not set")

    # Создаем движок напрямую
    connectable = create_engine(database_url, poolclass=pool.NullPool)

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()