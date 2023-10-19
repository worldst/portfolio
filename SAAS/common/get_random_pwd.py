import string
import random


def get_random_pwd():
    """
    비밀번호 랜덤 생성 후 반환 함수
        
    Parameters
    ----------
            
    Returns
    -------
    생성된 비밀번호 반환
    """
    new_pw_len = 10 # 새 비밀번호 길이

    pw_candidate = string.ascii_letters + string.digits + string.punctuation 

    new_pw = ""
    for i in range(new_pw_len):
        new_pw += random.choice(pw_candidate)

    return new_pw