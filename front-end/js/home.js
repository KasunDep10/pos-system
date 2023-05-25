const newCustomer = $('#new-customer');
const btnCustomer = $('#btn-customer');
const windowClose = $('.window-close');
const btnSave = $('#btn-save');


btnCustomer.on('click', ()=>{
    newCustomer.css('display', 'block');
});

windowClose.on('click', ()=>{
    newCustomer.css('display', 'none');
})

