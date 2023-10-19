from system.models import Account

def session_account(request):
    try:
        account = Account.objects.get(
            id=request.session['account_id'],
            introducing_company=request.session['introducing_company_id'],
        )
    except:
        account = ''
        
    return {
        'session_account': account
    }