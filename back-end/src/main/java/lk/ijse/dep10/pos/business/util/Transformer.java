package lk.ijse.dep10.pos.business.util;

import lk.ijse.dep10.pos.dto.CustomerDTO;
import lk.ijse.dep10.pos.dto.ItemDTO;
import lk.ijse.dep10.pos.dto.OrderDetailDTO;
import lk.ijse.dep10.pos.entity.Customer;
import lk.ijse.dep10.pos.entity.Item;
import lk.ijse.dep10.pos.entity.OrderDetail;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class Transformer {

    private final ModelMapper mapper = new ModelMapper();

    public Transformer() {
        /* Let's provide some type intelligence */
        mapper.typeMap(ItemDTO.class, OrderDetail.class)
        .addMapping(ItemDTO::getCode,
                (orderDetail, code) -> orderDetail.getOrderDetailPK().setItemCode((String)code));

        mapper.typeMap(OrderDetail.class, OrderDetailDTO.class)
                .addMappings(mapping -> mapping
                        .map((orderdetail)->orderdetail.getOrderDetailPK().getItemCode(),
                                OrderDetailDTO::setItemCode));
    }

    public Customer toCustomerEntity(CustomerDTO customerDTO){
        return mapper.map(customerDTO, Customer.class);
    }

    public CustomerDTO fromCustomerEntity(Customer customerEntity){
        return mapper.map(customerEntity, CustomerDTO.class);
    }

    public Item toItemEntity(ItemDTO itemDTO){
        return mapper.map(itemDTO, Item.class);
    }

    public ItemDTO fromItemEntity(Item itemEntity){
        return mapper.map(itemEntity, ItemDTO.class);
    }

    public OrderDetail toOrderDetailEntity(ItemDTO itemDTO){
        return mapper.map(itemDTO, OrderDetail.class);
    }

    public OrderDetailDTO fromOrderDetailEntity(OrderDetail orderDetail){
        return mapper.map(orderDetail, OrderDetailDTO.class);
    }
}
