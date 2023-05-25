package lk.ijse.dep10.pos;

import lk.ijse.dep10.pos.api.CustomerController;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class WebAppConfig {

    @Bean
    public CustomerController customerController(){
        return new CustomerController();
    }
}
