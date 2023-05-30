package lk.ijse.dep10.pos.api;

import lk.ijse.dep10.pos.dto.OrderDTO;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping("/orders")
public class OrderController {

    @PostMapping
    public void saveOrder(@RequestBody OrderDTO order){
        System.out.println(order);


    }
}
