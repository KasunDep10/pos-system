package lk.ijse.dep10.pos.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    CustomerDTO customer;
    List<ItemDTO> itemList = new ArrayList<>();
}
