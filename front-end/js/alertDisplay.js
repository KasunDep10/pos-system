function showToast(toastType, header, message){
    const toast = $('#toast .toast');
    toast.removeClass('text-bg-success text-bg-warning text-bg-danger')
    switch(toastType){
        case 'success':
            toast.addClass('text-bg-success');
            break;
        case 'warning':
            toast.addClass('text-bg-warning');
            break;
        case 'error':
            toast.addClass('text-bg-danger');
            break;
        default:
    }
    $('#toast .toast-header > strong').text(header);
    $('#toast .toast-body').text(message);
    toast.toast('show');
}

export {showToast};