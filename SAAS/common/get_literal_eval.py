from ast import literal_eval

def get_literal_eval(eval_list):
    for data in eval_list:
        ret_list = literal_eval(data)  

    return ret_list
