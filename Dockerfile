FROM python:3.10

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app
COPY requirements.txt /app/
RUN pip install -r requirements.txt
COPY . /app/

CMD gunicorn --preload --reload --bind :8000 --workers 3 classroometrics.wsgi:application --log-file=/var/log/gunicorn.log
