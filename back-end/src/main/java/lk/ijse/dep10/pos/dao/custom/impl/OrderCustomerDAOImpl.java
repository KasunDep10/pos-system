package lk.ijse.dep10.pos.dao.custom.impl;

import lk.ijse.dep10.pos.dao.custom.OrderCustomerDAO;
import lk.ijse.dep10.pos.entity.OrderCustomer;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.util.List;
import java.util.Optional;

import static lk.ijse.dep10.pos.dao.util.Mappers.ORDER_CUSTOMER_ROW_MAPPER;

@Repository
public class OrderCustomerDAOImpl implements OrderCustomerDAO {

    private final JdbcTemplate jdbcTemplate;

    public OrderCustomerDAOImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }


    public long count() throws Exception {
        return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM order_customer", Long.class);
    }

    public OrderCustomer save(OrderCustomer orderCustomer) throws Exception {
        jdbcTemplate.update("INSERT INTO order_customer (order_id, customer_id) VALUES (?, ?)", orderCustomer.getOrderId(), orderCustomer.getCustomerId());
        return orderCustomer;
    }

    public void update(OrderCustomer orderCustomer) throws Exception {
        jdbcTemplate.update("UPDATE order_customer SET customer_id = ? WHERE order_id=?", orderCustomer.getCustomerId(), orderCustomer.getOrderId());
    }

    public void deleteById(Integer orderId) throws Exception {
        jdbcTemplate.update("DELETE FROM order_customer WHERE order_id = ?", orderId);
    }

    public Optional<OrderCustomer> findById(Integer orderId) throws Exception {
        return Optional.ofNullable(jdbcTemplate.queryForObject("SELECT * FROM order_customer WHERE order_id = ?", ORDER_CUSTOMER_ROW_MAPPER, orderId));
    }

    public List<OrderCustomer> findAll() throws Exception {
        return jdbcTemplate.query("SELECT * FROM order_customer", ORDER_CUSTOMER_ROW_MAPPER);
    }

    public boolean existsById(Integer orderId) throws Exception {
        return findById(orderId).isPresent();
    }

    @Override
    public boolean existsOrderByCustomerId(int customerId) throws Exception {
        return jdbcTemplate.queryForObject("SELECT * FROM order_customer WHERE customer_id = ?",
                ORDER_CUSTOMER_ROW_MAPPER, customerId) != null;
    }
}
