// import {LocalDateTime, DateTimeFormatter} from '@js-joda/core';
import {DateTimeFormatter, LocalDateTime} from '../node_modules/@js-joda/core/dist/js-joda.esm.js';

/* Module Level Variables, Constants */
const REST_API_BASE_URL = 'http://localhost:8080/pos';
const WS_API_BASE_URL = 'ws://localhost:8080/pos';
const orderDateTimeElm = $("#order-date-time");
const tbodyElm = $("#tbl-order tbody");
const txtCustomer = $("#txt-customer");
const txtCode = $("#txt-code");

let customer = null;
let socket = null;

/* Initialization Logic */
setDateTime();
tbodyElm.empty();
socket = new WebSocket(`${WS_API_BASE_URL}/customers-ws`);

/* Event Handlers & Timers */
setInterval(setDateTime, 1000);
txtCustomer.on('input', () => findCustomer());

txtCustomer.on('blur', ()=> {
    if (txtCustomer.val() && !customer){
        txtCustomer.addClass("is-invalid");
    }
});

$("#btn-clear-customer").on('click', ()=> {
    customer = null;
    $("#customer-name").text("Walk-in Customer");
    txtCustomer.val("");
    txtCustomer.removeClass("is-invalid");
    txtCustomer.trigger("focus");
});
socket.addEventListener('message', (eventData)=> {
    customer = JSON.parse(eventData.data);
    $("#customer-name").text(customer.name);
});


txtCode.on('change', ()=> findItem());




/* Functions */

function findItem(){
    const description = $('#description');
    const stock = $('#stock');
    const unitPrice = $('#unit-price');
    const itemInfo = $('#item-info');
    const code = txtCode.val().trim();
    description.text("");
    stock.text("");
    unitPrice.text("");
    itemInfo.addClass("d-none");
    txtCode.removeClass('is-invalid');


    if(!code) return;

    const jqxhr = $.ajax(`${REST_API_BASE_URL}/items/${code}`);
    jqxhr.done((item) => {
        description.text(item.description);
        stock.text(item.qty ? `In Stock: ${item.qty}`: 'Out of Stock');
        unitPrice.text(formatPrice(item.price));
        itemInfo.removeClass("d-none");

    });

    jqxhr.fail(() => {
        txtCode.addClass('is-invalid');
        txtCode.trigger('focus');
    });
}


function formatPrice(price){
    return new Intl.NumberFormat('en-lk', {
        style:'currency',
        currency: 'LKR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(price)
}


function setDateTime() {
    const now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    orderDateTimeElm.text(now);
}

function findCustomer() {
    const customerNameElm = $("#customer-name");
    const idOrContact = txtCustomer.val().trim().replace('C', '');

    txtCustomer.removeClass("is-invalid");
    if (!idOrContact) return;
    customer = null;
    customerNameElm.text("Walk-in Customer");

    if (socket.readyState === socket.OPEN) socket.send(idOrContact);
}