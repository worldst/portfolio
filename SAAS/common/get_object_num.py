from datetime import datetime

def get_object_num(num_type):
    return num_type + datetime.now().strftime("-%y%m%d-%H%M%S")