import {showToast} from "./alertDisplay";

const tbodyElm = $('#tbl-customers tbody');
const modalElm = $('#new-customer-modal');
const txtId = $('#txt-id');
const txtName = $('#txt-name');
const txtAddress = $('#txt-address');
const txtContact = $('#txt-contact');
const btnSave = $('#btn-save');
tbodyElm.empty();

function formatCustomerId(id){
    return `C${id.toString().padStart(3, '0')}`;
}

modalElm.on('show.bs.modal', ()=>{
    resetForm(true);
    txtId.parent().hide();
    setTimeout(()=>txtName.trigger('focus'),500)
});

[txtName, txtContact, txtAddress].forEach(txtElm => $(txtElm).addClass('animate__animated'));

btnSave.on('click', ()=>{
    if(!validateData()){
        return;
    }

    const address = txtAddress.val().trim();
    const contact = txtContact.val().trim();
    const name = txtName.val().trim();
    const id = txtId.val().trim();

    let customer = {
        name, contact, address
    };
    /* Todo: Send a request to the server to save the customer*/

    /* 1. Create xhr object*/
    const xhr = new XMLHttpRequest();

    /* 2. Set an eventListener to listen */
    xhr.addEventListener('readystatechange', ()=>{
        if(xhr.readyState === 4){

            [txtName, txtAddress, txtContact, btnSave].forEach(txt => txt.removeAttr('disabled'));
            $('#loader').css('visibility', 'hidden');

            if(xhr.status === 201){
                showToast('success', 'Success', 'Customer has been saved');
                customer = JSON.parse(xhr.responseText);
                /* For successful response*/
                tbodyElm.append(`
                            <tr>
                                <td class="text-center">${formatCustomerId(customer.id)}</td>
                                <td>${customer.name}</td>
                                <td class="d-none d-xl-table-cell">${customer.name}</td>
                                <td class="contact text-center">${customer.contact}</td>
                                <td>
                                    <div class="actions d-flex gap-3 justify-content-center">
                                        <svg data-bs-toggle="tooltip" data-bs-title="Edit Customer" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                            class="bi bi-pencil-square" viewBox="0 0 16 16">
                                            <path
                                                d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                            <path fill-rule="evenodd"
                                                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                        </svg>
                                        <svg data-bs-toggle="tooltip" data-bs-title="Delete Customer" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
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
                showToast('error', 'Failed to Save', 'Failed save the customer');
            }
        }
    })

    /* 3. Let's open the request*/
    xhr.open('POST', 'http://localhost:8080/pos/customers', true);

    /* 4. Let's set some headers*/
    xhr.setRequestHeader('Content-Type', 'application/json');

    /* 5. Okay time to send the request*/
    xhr.send(JSON.stringify(customer));

    [txtName, txtAddress, txtContact, btnSave].forEach(txt => txt.attr('disabled', 'true'));
    $('#loader').css('visibility', 'visible');

    resetForm(true);
    txtName.trigger('focus');
    showToast('Success', 'Saved', 'Customer has been saved successfully');

});



function validateData(){
    const address = txtAddress.val().trim();
    const contact = txtContact.val().trim();
    const name = txtName.val().trim();
    let valid = true;
    resetForm();

    if(!address){
        valid = invalidate(txtAddress, "Address can't be empty")

    } else if(!/^.{3,}$/.test(address)){
        valid = invalidate(txtAddress, "Invalid address")
    }

    if(!contact){
        valid = invalidate(txtContact, "Contact can't be empty")

    } else if(!/^\d{3}-\d{7}$/.test(contact)){
        valid = invalidate(txtContact, "Invalid Contact number")
    }

    if(!name){
        valid = invalidate(txtName, "Name can't be empty")

    } else if(!/^[A-za-z ]+$/.test(name)){
        valid = invalidate(txtName, "Invalid name")
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
    [txtId, txtName, txtAddress, txtContact].forEach(txt => {
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



