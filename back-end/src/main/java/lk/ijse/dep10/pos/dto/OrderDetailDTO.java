package lk.ijse.dep10.pos.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailDTO {
    @NotBlank(message = "Order id can't be empty or null")
    private Integer orderId;
    @NotBlank(message = "Item code can't be empty or null")
    private String itemCode;
    @NotNull(message = "Unit Price can't be empty or null")
    @Min(value = 0, message = "Unit price can't be a negative value")
    private BigDecimal unitPrice;
    @NotNull(message = "Qty. can't be empty or null")
    @Min(value = 0, message = "Qty. can't be a negative value")
    private Integer qty;

}
