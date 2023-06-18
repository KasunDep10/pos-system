package lk.ijse.dep10.pos.dao.custom;

import lk.ijse.dep10.pos.dao.CrudDAO;
import lk.ijse.dep10.pos.dto.OrderDTO;
import lk.ijse.dep10.pos.entity.Item;
import lk.ijse.dep10.pos.entity.OrderDetail;
import lk.ijse.dep10.pos.entity.OrderDetailPK;

import java.util.List;

public interface OrderDetailDAO extends CrudDAO<OrderDetail, OrderDetailPK> {

    boolean existsOrderDetailByItemCode(String itemCode) throws Exception;

    List<OrderDetail> getOrderByOrderId(String orderId) throws Exception;
}
