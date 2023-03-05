FROM python:3.8

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY *.py ./

VOLUME database.pickle
EXPOSE 8300

ENV PYTHONUNBUFFERED=1

CMD ["python", "main.py"]
