"""
리모트 개발 환경 설정입니다.
ALLOWED_HOSTS 필드를 수정 후 사용하시는걸 추천드립니다.
원격 서버에 맞게 데이터베이스 설정 또한 바꾸시면 됩니다.
"""

from main.settings.base import *
import json

DEBUG = False

ALLOWED_HOSTS = ['*']
CONFIG_DIR = os.path.join(BASE_DIR, '.config')
CONFIG_FILE = os.path.join(CONFIG_DIR, 'common_setting.json')
config_load = json.loads(open(CONFIG_FILE).read())

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': config_load['DB_NAME'],
        'USER' : config_load['DB_USER'],
        'PASSWORD' : config_load['DB_PASSWORD'],
        'HOST' : config_load['DB_HOST'],
        'PORT' : config_load['DB_PORT'],
    }
}

# 도커 미적용 설정
'''
# 로컬 데이터베이스 설정을 해주시면 됩니다
CONFIG_DIR = os.path.join(BASE_DIR, '.db_config')
CONFIG_FILE = os.path.join(CONFIG_DIR, 'common_setting.json')

config_load = json.loads(open(CONFIG_FILE).read())

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': config_load['DB_NAME'],
        'USER' : config_load['DB_USER'],
        'PASSWORD' : config_load['DB_PASSWORD'],
        'HOST' : config_load['DB_HOST'],
        'PORT' : config_load['DB_PORT'],
    }
}
'''