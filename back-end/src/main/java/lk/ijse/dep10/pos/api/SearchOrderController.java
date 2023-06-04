package lk.ijse.dep10.pos.api;

import lk.ijse.dep10.pos.dto.IncomeDTO;
import lk.ijse.dep10.pos.dto.ItemDTO;
import lk.ijse.dep10.pos.dto.ResponseErrorDTO;
import lk.ijse.dep10.pos.dto.SearchDTO;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/searchOrder")
@CrossOrigin
public class SearchOrderController {

    @Autowired
    private BasicDataSource pool;


    @GetMapping("/income/{date}")
    public ResponseEntity<?> getTodayIncome(@PathVariable String date){
        try(Connection connection = pool.getConnection()) {
            PreparedStatement stm = connection.prepareStatement("SELECT * FROM `order` INNER JOIN order_details od on `order`.id = od.order_id WHERE datetime LIKE ?");
            date = "%" + date + "%";
            stm.setString(1, date);
            ResultSet rst = stm.executeQuery();
            BigDecimal total = BigDecimal.valueOf(0);
            while(rst.next()){
                int qty = rst.getInt("qty");
                BigDecimal price = rst.getBigDecimal("unit_price").setScale(2);
                total = total.add(new BigDecimal(qty).multiply(price));
                System.out.println("total = " +total);
            }
            IncomeDTO incomeDTO = new IncomeDTO(total);
            return new ResponseEntity<>(incomeDTO, HttpStatus.OK);

        } catch (SQLException e) {
            e.printStackTrace();
            ResponseErrorDTO error = new ResponseErrorDTO(404, "Order details not found");
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/{orderId}")
    public ResponseEntity<?> getItem(@PathVariable String orderId){
        try(Connection connection = pool.getConnection()) {
            PreparedStatement stm = connection.prepareStatement("SELECT * FROM order_details WHERE order_id=?");
            stm.setString(1, orderId);
            ResultSet rst = stm.executeQuery();
            List<ItemDTO> itemList = new ArrayList<>();
            while(rst.next()){
                String code = rst.getString("item_code");
                BigDecimal price = rst.getBigDecimal("unit_price").setScale(2);
                int qty = rst.getInt("qty");
                itemList.add(new ItemDTO(code, "", price, qty));
            }
            return new ResponseEntity<>(itemList, HttpStatus.OK);

        } catch (SQLException e) {
            e.printStackTrace();
            ResponseErrorDTO error = new ResponseErrorDTO(404, "Order details not found");
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping
    public ResponseEntity<?> getItems(@RequestParam(value = "q", required = false) String query) {
        if (query == null) query = "";
        try (Connection connection = pool.getConnection()) {
            PreparedStatement stm = connection.prepareStatement
                    ("SELECT * FROM `order` WHERE id LIKE ? OR datetime LIKE ?");
            query = "%" + query + "%";
            for (int i = 1; i <= 2; i++) {
                stm.setString(i, query);
            }
            ResultSet rst = stm.executeQuery();
            List<SearchDTO> orderList = new ArrayList<>();
            while (rst.next()) {
                int id = rst.getInt("id");
                Timestamp datetime = rst.getTimestamp("datetime");
                orderList.add(new SearchDTO(id, datetime.toLocalDateTime()));
            }
            return new ResponseEntity<>(orderList, HttpStatus.OK);
        } catch (SQLException e) {
            e.printStackTrace();
            return new ResponseEntity<>(new ResponseErrorDTO(500, e.getMessage()),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }



    }
}
