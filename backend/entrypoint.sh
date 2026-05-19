#!/bun/bash
python manage.py collectstatic --noinput
exec "$@"
