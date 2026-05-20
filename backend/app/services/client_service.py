from sqlalchemy.exc import IntegrityError, ProgrammingError
from sqlalchemy.orm import Session

from app.models.client import Client
from app.models.user import User, UserRole
from app.schemas.client import ClientCreate
from app.schemas.user import UserCreate
from app.services.auth_service import create_user, get_user_by_email


def create_client_with_optional_portal(db: Session, data: ClientCreate) -> Client:
    payload = data.model_dump(exclude={"create_portal_account", "portal_password"})
    db_client = Client(**payload)
    db.add(db_client)
    db.flush()

    if data.create_portal_account:
        if not data.email:
            db.rollback()
            raise ValueError("Email обязателен для доступа в личный кабинет")
        if not data.portal_password:
            db.rollback()
            raise ValueError("Укажите пароль для личного кабинета")

        if get_user_by_email(db, data.email):
            db.rollback()
            raise ValueError("Пользователь с таким email уже существует")

        try:
            create_user(
                db,
                UserCreate(
                    email=data.email,
                    password=data.portal_password,
                    full_name=data.full_name,
                    role=UserRole.CLIENT,
                ),
                client_id=db_client.id,
                role=UserRole.CLIENT,
            )
        except IntegrityError as exc:
            db.rollback()
            raise ValueError(
                "Не удалось создать аккаунт. Обновите backend на Render "
                "(нужна колонка users.client_id) и повторите."
            ) from exc

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise ValueError("Клиент с такими данными уже существует") from exc

    db.refresh(db_client)
    return db_client


def client_has_portal_account(db: Session, client_id: int) -> bool:
    try:
        return (
            db.query(User)
            .filter(User.client_id == client_id, User.role == UserRole.CLIENT)
            .first()
            is not None
        )
    except ProgrammingError:
        db.rollback()
        return False


def serialize_client(db: Session, db_client: Client) -> dict:
    data = {
        "id": db_client.id,
        "full_name": db_client.full_name,
        "phone": db_client.phone,
        "email": db_client.email,
        "company": db_client.company,
        "address": db_client.address,
        "notes": db_client.notes,
        "created_at": db_client.created_at,
        "updated_at": db_client.updated_at,
        "has_portal_account": client_has_portal_account(db, db_client.id),
    }
    return data
