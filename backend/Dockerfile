FROM python:3.12.7
WORKDIR /backend

# Installer pipenv
RUN pip install pipenv

# Copier le Pipfile et Pipfile.lock
COPY Pipfile Pipfile.lock ./

# Installer les dépendances avec pipenv
RUN pipenv install --system --deploy

# Copier le reste de l'application
COPY . /backend

ENV PYTHONPATH="/backend"

CMD ["python", "api/main.py"]
