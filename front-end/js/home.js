import {showToast} from "./main.js";
import {LocalDate} from '../node_modules/@js-joda/core/dist/js-joda.esm.js';
import {formatPrice} from "./place-order.js";

const totalItem = $('#total-items');
const totalCustomer = $('#total-customers');
const totalOrder = $('#total-orders');
const todayIncome = $('#today-income');
const date = $('#txt-search-date');
const time = $('#time');
const orders = $('#orders');
const totalIncome = $('#total-income');

getTotalItems();
getTotalCustomers();
getTotalOrders();
getTotalIncome();

date.on('change', ()=> {
    getTotalIncome();
    getTotalOrders();
});


function getTotalItems(){
    let totalItems = 0;

    const jqxhr = $.ajax(`http://localhost:8080/pos/items?q= `);

    jqxhr.done((itemList)=>{
        totalItems = itemList.length;
        totalItem.text(`${totalItems} Total Items`);
    });
    jqxhr.fail(()=> showToast('error', 'Failed', 'Failed to get total items'));

}


function getTotalCustomers(){
    let totalCustomers = 0;

    const jqxhr = $.ajax(`http://localhost:8080/pos/customers?q= `);

    jqxhr.done((customerList)=>{
        totalCustomers = customerList.length;
        totalCustomer.text(`${totalCustomers} Total Customers`);
    });
    jqxhr.fail(()=> showToast('error', 'Failed', 'Failed to get total Customers'));

}

function getTotalOrders(){
    if(date.val() === ""){
        orders.text(`Total Orders:`);
        let totalOrders = 0;

        const jqxhr = $.ajax(`http://localhost:8080/pos/searchOrder?q= `);

        jqxhr.done((customerList)=>{
            totalOrders = customerList.length;
            totalOrder.text(`${totalOrders} Total Orders`);
        });
        jqxhr.fail(()=> showToast('error', 'Failed', 'Failed to get total Orders'));
    } else {
        let searchTime = date.val().trim();
        let order = 0;

        const jqxhr = $.ajax(`http://localhost:8080/pos/searchOrder?q=${searchTime}`);

        jqxhr.done((customerList)=>{
            order = customerList.length;
            orders.text(`Total Orders: ${order}`);
        });
        jqxhr.fail(()=> showToast('error', 'Failed', 'Failed to get Orders'));
    }

}

function getTotalIncome(){
    if(date.val() === ""){
        const now = LocalDate.now();
        totalIncome.text(`Total income: `);
        time.text(`Time (Date | Month | Year):`);
        const jqxhr = $.ajax(`http://localhost:8080/pos/searchOrder/income/${now.toString()}`);

        jqxhr.done((dayIncome)=>{
            todayIncome.text(`Today Net income: ${formatPrice(dayIncome.income)}`);

        });
        jqxhr.fail(()=> showToast('error', 'Failed', 'Failed to get today income'));
    } else {
        let searchTime = date.val().trim();
        time.text(`Time (Date | Month | Year): ${searchTime}`);
        const jqxhr = $.ajax(`http://localhost:8080/pos/searchOrder/income/${searchTime}`);

        jqxhr.done((income)=>{
            totalIncome.text(`Total income: ${formatPrice(income.income)}`);
        });
        jqxhr.fail(()=> showToast('error', 'Failed', 'Failed to get income'));
    }


}

