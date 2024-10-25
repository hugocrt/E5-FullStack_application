FROM python:3.12.7
WORKDIR /app

# Installer pipenv
RUN pip install pipenv

# Copier le Pipfile et Pipfile.lock
COPY Pipfile Pipfile.lock ./

# Installer les dépendances avec pipenv
RUN pipenv install --system --deploy

# Copier le reste de l'application
COPY . /app

CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "5000"]
