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
        if get_user_by_email(db, data.email):
            db.rollback()
            raise ValueError("Пользователь с таким email уже существует")

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

    db.commit()
    db.refresh(db_client)
    return db_client


def client_has_portal_account(db: Session, client_id: int) -> bool:
    return (
        db.query(User)
        .filter(User.client_id == client_id, User.role == UserRole.CLIENT)
        .first()
        is not None
    )
