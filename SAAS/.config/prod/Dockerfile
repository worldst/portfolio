# 이미지 pull
FROM python:3.7.0-alpine

# 작업공간 설정
#WORKDIR /home/lunch
WORKDIR .

# 환경 변수 설정
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# psycopg2 dependencies 설치
RUN apk update \
    && apk add postgresql-dev gcc python3-dev musl-dev g++

RUN apk --update add libxml2-dev libxslt-dev libffi-dev gcc musl-dev libgcc curl
RUN apk add jpeg-dev zlib-dev freetype-dev lcms2-dev openjpeg-dev tiff-dev tk-dev tcl-dev

# container timezone 설정
RUN apk add --no-cache tzdata
ENV TZ Asia/Seoul

# requirements 설치
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install Pillow
RUN pip install wheel
RUN pip install numpy
RUN pip install pandas
RUN pip install -r requirements.txt

# 프로젝트 복사
COPY . .
#RUN python manage.py collectstatic