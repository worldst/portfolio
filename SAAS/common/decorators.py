from django.shortcuts import redirect


def login_required(function):
    def wrap(request, *args, **kwargs):
        user = request.session.get('account_id')

        if user is None or not user:
            return redirect('/')
        return function(request, *args, **kwargs)

    return wrap
