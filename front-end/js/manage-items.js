import {showToast} from "./alertDisplay";

const tbodyElm = $('#tbl-items tbody');
const modalElm = $('#new-item-modal');
const txtCode = $('#txt-code');
const txtDescription = $('#txt-description');
const txtQty = $('#txt-qty');
const txtPrice = $('#txt-price');
const btnSave = $('#btn-save');
tbodyElm.empty();

function formatItemCode(code){
    return `I${code.toString().padStart(3, '0')}`;
}

modalElm.on('show.bs.modal', ()=>{
    resetForm(true);
    txtCode.parent().hide();
    setTimeout(()=>txtDescription.trigger('focus'),500)
});

[txtDescription, txtPrice, txtQty].forEach(txtElm => $(txtElm).addClass('animate__animated'));

btnSave.on('click', ()=>{
    if(!validateData()){
        return;
    }

    const qty = +txtQty.val().trim();
    const price = +txtPrice.val().trim();
    const description = txtDescription.val().trim();
    const code = txtCode.val().trim();

    let item = {
        description, price, qty
    };
    /* Todo: Send a request to the server to save the item*/

    /* 1. Create xhr object*/
    const xhr = new XMLHttpRequest();

    /* 2. Set an eventListener to listen */
    xhr.addEventListener('readystatechange', ()=>{
        if(xhr.readyState === 4){

            [txtDescription, txtQty, txtPrice, btnSave].forEach(txt => txt.removeAttr('disabled'));
            $('#loader').css('visibility', 'hidden');

            if(xhr.status === 201){
                showToast('success', 'Success', 'Item has been saved');
                item = JSON.parse(xhr.responseText);
                /* For successful response*/
                tbodyElm.append(`
                            <tr>
                                <td class="text-center">${formatItemCode(item.code)}</td>
                                <td>${item.description}</td>
                                <td class="d-none d-xl-table-cell">${item.price}</td>
                                <td class="contact text-center">${item.qty}</td>
                                <td>
                                    <div class="actions d-flex gap-3 justify-content-center">
                                        <svg data-bs-toggle="tooltip" data-bs-title="Edit Item" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                            class="bi bi-pencil-square" viewBox="0 0 16 16">
                                            <path
                                                d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                            <path fill-rule="evenodd"
                                                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                        </svg>
                                        <svg data-bs-toggle="tooltip" data-bs-title="Delete Item" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                            class="bi bi-trash" viewBox="0 0 16 16">
                                            <path
                                                d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                                            <path
                                                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                                        </svg>
                                    </div>
                                </td>
                            </tr>
                `);


            } else {
                showToast('error', 'Failed to Save', 'Failed save the item');
            }
        }
    })

    /* 3. Let's open the request*/
    xhr.open('POST', 'http://localhost:8080/pos/items', true);

    /* 4. Let's set some headers*/
    xhr.setRequestHeader('Content-Type', 'application/json');

    /* 5. Okay time to send the request*/
    xhr.send(JSON.stringify(item));

    [txtDescription, txtQty, txtPrice, btnSave].forEach(txt => txt.attr('disabled', 'true'));
    $('#loader').css('visibility', 'visible');

    resetForm(true);
    txtDescription.trigger('focus');
    showToast('Success', 'Saved', 'Item has been saved successfully');

});



function validateData(){
    const price = +txtPrice.val().trim();
    const description = txtDescription.val().trim();
    let valid = true;
    resetForm();


    if(!price){
        valid = invalidate(txtPrice, "Price can't be empty")

    } else if(price <= 0){
        valid = invalidate(txtPrice, "Invalid Price")
    }

    if(!description){
        valid = invalidate(txtDescription, "Description can't be empty")

    } else if(!/^[A-Za-z0-9 _+/-]+$/.test(description)){
        valid = invalidate(txtDescription, "Invalid description")
    }
    return valid;
}



function invalidate(txt, msg){
    setTimeout(()=>txt.addClass('is-invalid animate__shakeX'),0);
    txt.trigger('select');
    txt.next().text(msg);
    return false;
}



function resetForm(clearData){
    [txtCode, txtDescription, txtQty, txtPrice].forEach(txt => {
        txt.removeClass('is-invalid animate__shakeX');
        if(clearData) txt.val('');
    })

}



/*function showToast(toastType, header, message){
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
}*/



