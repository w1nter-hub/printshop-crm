@echo off
echo ========================================
echo Очистка базы данных PrintShop CRM
echo ========================================
echo.

cd /d "%~dp0backend"

echo Удаление базы данных...
if exist printshop.db (
    del printshop.db
    echo База данных удалена!
) else (
    echo База данных не найдена.
)

echo.
echo Пересоздание базы данных...
call venv\Scripts\activate.bat
alembic upgrade head

echo.
echo ========================================
echo База данных очищена и пересоздана!
echo ========================================
echo.
echo Теперь запустите backend:
echo uvicorn main:app --host 0.0.0.0 --reload
echo.
pause
