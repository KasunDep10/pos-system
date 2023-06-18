package lk.ijse.dep10.pos.api;

import lk.ijse.dep10.pos.dto.ItemDTO;
import lk.ijse.dep10.pos.dto.ResponseErrorDTO;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/items")
@CrossOrigin
public class ItemController {

    @Autowired
    private BasicDataSource pool;

    @GetMapping("/{code}")
    public ResponseEntity<?> getItem(@PathVariable String code){
        try(Connection connection = pool.getConnection()) {
            PreparedStatement stm = connection.prepareStatement("SELECT * FROM item WHERE code=?");
            stm.setString(1, code);
            ResultSet rst = stm.executeQuery();
            if(rst.next()){
                String description = rst.getString("description");
                BigDecimal price = rst.getBigDecimal("price").setScale(2);
                int qty = rst.getInt("qty");
                ItemDTO item = new ItemDTO(code, description, price, qty);
                return new ResponseEntity<>(item, HttpStatus.OK);
            } else {
                ResponseErrorDTO error = new ResponseErrorDTO(404, "Item not found");
                return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
            }

        } catch (SQLException e) {
            e.printStackTrace();
            ResponseErrorDTO error = new ResponseErrorDTO(404, "Item not found");
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping("/{code}")
    public ResponseEntity<?> updateItem(@PathVariable("code") String itemCode, @RequestBody ItemDTO item){
        try(Connection connection = pool.getConnection()) {
            PreparedStatement stm = connection.prepareStatement
                    ("UPDATE item SET description=?, unit_price=?, qty=? WHERE code=?");
            stm.setString(1, item.getDescription());
            stm.setBigDecimal(2, item.getPrice());
            stm.setInt(3, item.getQty());
            stm.setString(4, itemCode);
            int affectedRows = stm.executeUpdate();
            if(affectedRows == 1){
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                ResponseErrorDTO error = new ResponseErrorDTO(404, "Item Code not found");
                return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
            }

        } catch (SQLException e) {
            if(e.getSQLState().equals("23000")){
                return new ResponseEntity<>(new ResponseErrorDTO(HttpStatus.CONFLICT.value(),
                        e.getMessage()), HttpStatus.CONFLICT);
            } else {
                return new ResponseEntity<>(new ResponseErrorDTO(500, e.getMessage()),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }


    @DeleteMapping("/{code}")
    public ResponseEntity<?> deleteItem(@PathVariable("code") String itemCode){
//        System.out.println("delete " + itemCode);

        try(Connection connection = pool.getConnection()) {
            PreparedStatement stm = connection.prepareStatement("DELETE FROM item WHERE code=?");
            stm.setString(1, itemCode);
            int affectedRows = stm.executeUpdate();
            if(affectedRows == 1){
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                ResponseErrorDTO response = new ResponseErrorDTO(404, "Item code can't be found");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }


        } catch (SQLException e) {
            if(e.getSQLState().equals("23000")){
                return new ResponseEntity<>(new ResponseErrorDTO(HttpStatus.CONFLICT.value(),
                        e.getMessage()), HttpStatus.CONFLICT);
            } else {
                return new ResponseEntity<>(new ResponseErrorDTO(500, e.getMessage()),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @PostMapping
    public ResponseEntity<?> saveItem(@RequestBody ItemDTO item){
        /*try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }*/
        try(Connection connection = pool.getConnection()) {
            PreparedStatement stm = connection.prepareStatement
                    ("INSERT INTO item (code, description, unit_price, qty) VALUES (?,?,?,?)");
            stm.setString(1, item.getCode());
            stm.setString(2, item.getDescription());
            stm.setBigDecimal(3, item.getPrice());
            stm.setInt(4, item.getQty());
            stm.executeUpdate();
            /*ResultSet generatedKeys = stm.getGeneratedKeys();
            generatedKeys.next();
            int id = generatedKeys.getInt(1);
            item.setCode(id + "");*/
            return new ResponseEntity<>(item, HttpStatus.CREATED);

        } catch (SQLException e) {
            if(e.getSQLState().equals("23000")){
                return new ResponseEntity<>(new ResponseErrorDTO(HttpStatus.CONFLICT.value(), e.getMessage()), HttpStatus.CONFLICT);
            } else {
                return new ResponseEntity<>(new ResponseErrorDTO(500, e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }


    @GetMapping
    public ResponseEntity<?> getItems(@RequestParam(value = "q", required = false) String query) {
        if (query == null) query = "";
        try (Connection connection = pool.getConnection()) {
            PreparedStatement stm = connection.prepareStatement
                    ("SELECT * FROM item WHERE code LIKE ? OR description LIKE ? OR unit_price LIKE ? OR qty LIKE ?");
            query = "%" + query + "%";
            for (int i = 1; i <= 4; i++) {
                stm.setString(i, query);
            }
            ResultSet rst = stm.executeQuery();
            List<ItemDTO> ItemList = new ArrayList<>();
            while (rst.next()) {
                String id = rst.getString("code");
                String description = rst.getString("description");
                BigDecimal price = rst.getBigDecimal("price");
                int qty = rst.getInt("qty");
                ItemList.add(new ItemDTO(id, description, price, qty));
            }
            HttpHeaders headers = new HttpHeaders();
            headers.add("X-Count", ItemList.size() + "");
            return new ResponseEntity<>(ItemList, headers, HttpStatus.OK);
        } catch (SQLException e) {
            e.printStackTrace();
            return new ResponseEntity<>(new ResponseErrorDTO(500, e.getMessage()),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }



    }
}
