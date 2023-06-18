import {formatPrice} from "./place-order.js";
import {showProgress, showToast} from "./main.js";

const API_BASE_URL = "http://localhost:8080/pos/api/v1/";
const tbodyElm = $('#tbl-items tbody');
const modalElm = $('#new-item-modal');
const txtCode = $('#txt-item-code');
const txtDescription = $('#txt-description');
const txtQty = $('#txt-qty');
const txtUnitPrice = $('#txt-price');
const btnSave = $('#btn-save');
const txtSearch = $('#txt-search');
tbodyElm.empty();

modalElm.on('show.bs.modal', ()=>{
    resetForm(true);
    txtCode.removeAttr('disabled');
    btnSave.text("Save Item");
    setTimeout(()=>txtCode.trigger('focus'),500)
});


getItems();
txtSearch.on('input', ()=> getItems());

[txtCode, txtDescription, txtUnitPrice, txtQty].forEach(txtElm => $(txtElm).addClass('animate__animated'));





tbodyElm.on('click', ".edit", (eventData)=> {
    let code = $(eventData.target).parents('tr').children('td:first-child').text();
    let description = $(eventData.target).parents('tr').children('td:nth-child(2)').text();
    let price = $(eventData.target).parents('tr').children('td:nth-child(3)').text();
    let qty = $(eventData.target).parents('tr').children('td:nth-child(4)').text();
    price = price.replace('LKR', '').replace(',', '');
    $('#btn-new-item').trigger('click');
    txtCode.prop('disabled', 'true');
    txtCode.val(code);
    setTimeout(()=>txtDescription.trigger('focus'),500)
    txtDescription.val(description);
    txtQty.val(qty);
    txtUnitPrice.val(price);
    btnSave.text('Update Item');
});






btnSave.on('click', ()=>{
    if(!validateData()){
        return;
    }

    const qty = +txtQty.val().trim();
    const unitPrice = +txtUnitPrice.val().trim();
    const description = txtDescription.val().trim();
    const code = txtCode.val().trim();

    let item = {
        code, description, unitPrice, qty
    };
    /* Todo: Send a request to the server to save the item*/

    /* 1. Create xhr object*/
    const xhr = new XMLHttpRequest();

    /* 2. Set an eventListener to listen */
    xhr.addEventListener('readystatechange', ()=>{
        if(xhr.readyState === 4){

            [txtCode, txtDescription, txtQty, txtUnitPrice, btnSave].forEach(txt => txt.removeAttr('disabled'));
            $('#loader').css('visibility', 'hidden');

            if(xhr.status === 201) {
                // item = JSON.parse(xhr.responseText);
                /* For successful response*/

                getItems();
                resetForm(true);
                txtCode.trigger('focus');
                showToast('success', 'Success', 'Item has been saved');

            } else if(xhr.status !== 204) {
                showToast('error', 'Failed to Save', 'Failed save the item');
            }

            if(xhr.status === 204){
                getItems();
                resetForm(true);
                txtCode.trigger('focus');
                showToast('success', 'Success', 'Item has been Updated');
            } else if(xhr.status !== 201) {
                showToast('error', 'Failed to Update', 'Failed update the item');
            }
        }
    })

    /* 3. Let's open the request*/
    if(btnSave.text() === "Save Item"){
        xhr.open('POST', `${API_BASE_URL}items`, true);
    } else {
        xhr.open('PATCH', `${API_BASE_URL}items/${code}`, true);

    }

    /* 4. Let's set some headers*/
    xhr.setRequestHeader('Content-Type', 'application/json');

    showProgress(xhr);

    /* 5. Okay time to send the request*/
    xhr.send(JSON.stringify(item));

    [txtCode, txtDescription, txtQty, txtUnitPrice, btnSave].forEach(txt => txt.attr('disabled', 'true'));
    $('#loader').css('visibility', 'visible');

});


tbodyElm.on('click', ".delete", (eventData)=> {
    /* XHR -> jQuery AJAX */
    const code = +$(eventData.target).parents("tr").children("td:first-child").text();
    const xhr = new XMLHttpRequest();
    const jqxhr = $.ajax(`${API_BASE_URL}items/${code}`, {
        method: 'DELETE',
        xhr: ()=> xhr           // This is a hack to obtain the xhr that is used by jquery
    });
    showProgress(xhr);

    jqxhr.done(()=> {
        showToast('success', 'Deleted', 'Item has been deleted successfully');
        $(eventData.target).tooltip('dispose');
        getItems();
    });
    jqxhr.fail((data)=> {
        const errMsg = JSON.parse(JSON.stringify(data.responseJSON));
        const msg = errMsg.message.replace(/(Code: \d{4}; )/, "");
        // showToast('error', 'Failed', "Failed to delete the item, try again!");
        showToast('error', 'Failed', msg);
    });
});




function validateData(){
    const price = +txtUnitPrice.val().trim();
    const description = txtDescription.val().trim();
    const code = txtCode.val().trim();
    let valid = true;
    resetForm();


    if(!price){
        valid = invalidate(txtUnitPrice, "Price can't be empty")

    } else if(price <= 0){
        valid = invalidate(txtUnitPrice, "Invalid Price")
    }

    if(!description){
        valid = invalidate(txtDescription, "Description can't be empty")

    } else if(!/^[A-Za-z0-9 _+/-]+$/.test(description)){
        valid = invalidate(txtDescription, "Invalid description")
    }

    if(!code){
        valid = invalidate(txtCode, "Item Code can't be empty")

    } else if(!/^\d+$/.test(code)){
        valid = invalidate(txtCode, "Invalid Item Code")
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
    [txtCode, txtDescription, txtQty, txtUnitPrice].forEach(txt => {
        txt.removeClass('is-invalid animate__shakeX');
        if(clearData) txt.val('');
    })

}


function getItems(){
    let size = 0;

    const xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange', ()=> {
        if (xhr.readyState === 4){
            if (xhr.status === 200){
                tbodyElm.empty();
                const itemList = JSON.parse(xhr.responseText);
                size = itemList.length;
                itemList.forEach(item => {
                    tbodyElm.append(`
                    <tr>
                        <td class="text-center">${item.code}</td>
                        <td>${item.description}</td>
                        <td class="d-none d-xl-table-cell">${formatPrice(item.unitPrice)}</td>
                        <td class="contact text-center">${item.qty}</td>
                        <td>
                            <div class="actions d-flex gap-3 justify-content-center">
                                <svg data-bs-target="#new-item-modal" data-bs-toggle="tooltip" data-bs-title="Edit Item" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                    class="bi bi-pencil-square edit" viewBox="0 0 16 16">
                                    <path
                                        d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                    <path fill-rule="evenodd"
                                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                </svg>
                                <svg data-bs-toggle="tooltip" data-bs-title="Delete Item" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                    class="bi bi-trash delete" viewBox="0 0 16 16">
                                    <path
                                        d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                                    <path
                                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                                </svg>
                            </div>
                        </td>
                    </tr>
                `);
                });

                const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
                const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

                if (!itemList.length){
                    $("#tbl-items tfoot").show();
                }else {
                    $("#tbl-items tfoot").hide();
                }
            }else{
                tbodyElm.empty();
                $("#tbl-items tfoot").show();
                showToast('error', 'Failed', 'Failed to fetch items');
                // console.log(JSON.parse(xhr.responseText));
            }
        }
    });

    const searchText = txtSearch.val().trim();
    const query = (searchText) ? `?q=${searchText}`: "";

    xhr.open('GET', `${API_BASE_URL}items/${query}`, true);

    const tfoot = $('#tbl-items tfoot tr td:first-child');
    xhr.addEventListener('loadstart', ()=> tfoot.text('Please wait!'));
    xhr.addEventListener('loadend', ()=> tfoot.text('No item records'));

    xhr.send();

    return size;
}