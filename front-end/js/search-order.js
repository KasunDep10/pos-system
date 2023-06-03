import {showToast} from "./main.js";
import {formatPrice, formatNumber} from "./place-order.js";
import {Big} from '../node_modules/big.js/big.mjs';

const orderTbodyElm = $('#tbl-order tbody');
const ODTbodyElm = $('#tbl-order-detail tbody');
const txtSearch = $('#txt-search');
const totalElm = $('#net-total');
orderTbodyElm.empty();
ODTbodyElm.empty();

getOrders();
txtSearch.on('input', ()=> getOrders());

orderTbodyElm.on('click', '.view-order', (eventData)=>{
    const orderId = +$(eventData.target).parents("tr").children("td:first-child").text()
        .replace("OD-","");

    const xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange', ()=> {
        let total = 0;
        if (xhr.readyState === 4){
            if (xhr.status === 200){
                ODTbodyElm.empty();
                const itemList = JSON.parse(xhr.responseText);
                itemList.forEach(item => {
                    ODTbodyElm.append(`
                    <tr>
                        <td>
                            ${item.code}
                        </td>
                        <td>
                            ${item.qty}
                        </td>
                        <td>
                            ${formatNumber(item.price)}
                        </td>
                        <td>
                            ${formatNumber(Big(item.price).times(Big(item.qty)))}
                        </td>
                    </tr>
                    `);
                    total += +Big(item.price).times(Big(item.qty));
                });

                totalElm.text(formatPrice(total));


                if (!itemList.length){
                    $("#tbl-order-detail tfoot").show();
                }else {
                    $("#tbl-order-detail tfoot").hide();
                }
            }else{
                orderTbodyElm.empty();
                $("#tbl-order-detail tfoot").show();
                showToast('error', 'Failed', 'Failed to fetch order details');
                // console.log(JSON.parse(xhr.responseText));
            }
        }
    });


    xhr.open('GET', `http://localhost:8080/pos/searchOrder/${orderId}`, true);

    const tfoot = $('#tbl-order-detail tfoot tr td:first-child');
    xhr.addEventListener('loadstart', ()=> tfoot.text('Please wait!'));
    xhr.addEventListener('loadend', ()=> tfoot.text('No item records'));

    xhr.send();



});



function getOrders(){
    const xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange', ()=> {
        if (xhr.readyState === 4){
            if (xhr.status === 200){
                orderTbodyElm.empty();
                const orderList = JSON.parse(xhr.responseText);
                orderList.forEach(order => {
                    orderTbodyElm.append(`
                    <tr>
                        <td>
                            OD-${order.id.toString().padStart(3, '0')}
                        </td>
                        <td>
                            ${order.dateTime}
                        </td>
                        <td>
                            <div class="actions d-flex justify-content-center align-items-center p-1">
                                <svg data-bs-toggle="tooltip" data-bs-title="View Order" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-right-square view-order" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5.854 3.146a.5.5 0 1 0-.708.708L9.243 9.95H6.475a.5.5 0 1 0 0 1h3.975a.5.5 0 0 0 .5-.5V6.475a.5.5 0 1 0-1 0v2.768L5.854 5.146z"/>
                                </svg>
                            </div>
                        </td>
                    </tr>
                `);
                });

                const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
                const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
                if (!orderList.length){
                    $("#tbl-order tfoot").show();
                }else {
                    $("#tbl-order tfoot").hide();
                }
            }else{
                orderTbodyElm.empty();
                $("#tbl-items tfoot").show();
                showToast('error', 'Failed', 'Failed to fetch orders');
                // console.log(JSON.parse(xhr.responseText));
            }
        }
    });

    const searchText = txtSearch.val().trim().replace("OD-", "");
    const query = (searchText) ? `?q=${searchText}`: "";

    xhr.open('GET', 'http://localhost:8080/pos/searchOrder' + query, true);

    const tfoot = $('#tbl-order tfoot tr td:first-child');
    xhr.addEventListener('loadstart', ()=> tfoot.text('Please wait!'));
    xhr.addEventListener('loadend', ()=> tfoot.text('No item records'));

    xhr.send();
}