FROM python:3.10-slim
WORKDIR /code
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn
COPY . .
CMD ["gunicorn", "-w", "4", "app:app", "--bind", "0.0.0.0:5000"]