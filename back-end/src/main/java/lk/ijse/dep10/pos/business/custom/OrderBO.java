package lk.ijse.dep10.pos.business.custom;

import lk.ijse.dep10.pos.business.SuperBO;
import lk.ijse.dep10.pos.dto.ItemDTO;
import lk.ijse.dep10.pos.dto.OrderDTO;
import lk.ijse.dep10.pos.dto.OrderDTO2;
import lk.ijse.dep10.pos.dto.OrderDetailDTO;

import java.util.List;

public interface OrderBO extends SuperBO {

    Integer placeOrder(OrderDTO orderDTO) throws Exception;

    List<OrderDTO2> searchOrders(String query) throws Exception;

    List<OrderDetailDTO> searchOrderByOrderId(String id) throws Exception;

    Long getIncome(String query) throws Exception;
}
