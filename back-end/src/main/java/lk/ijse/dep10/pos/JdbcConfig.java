package lk.ijse.dep10.pos;

import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;

@Configuration
@EnableTransactionManagement
public class JdbcConfig {

    @Bean
    public JdbcTemplate jdbcTemplate(DataSource dataSource){
        return new JdbcTemplate(dataSource){
            @Override
            public <T> T queryForObject(String sql, RowMapper<T> rowMapper, Object... args) throws DataAccessException {
                try {
                    return super.queryForObject(sql, rowMapper, args);
                } catch (EmptyResultDataAccessException e){
                    return null;
                }
            }
        };
    }

    @Bean
    public PlatformTransactionManager platformTransactionManager(DataSource dataSource){
        return new DataSourceTransactionManager(dataSource);
    }

    @Bean
    public BasicDataSource dataSource(Environment env){
        BasicDataSource bds = new BasicDataSource();
        bds.setUsername(env.getRequiredProperty("spring.datasource.username"));
        bds.setPassword(env.getRequiredProperty("spring.datasource.password"));
        bds.setDriverClassName(env.getRequiredProperty("spring.datasource.driver-class-name"));
        bds.setUrl(env.getRequiredProperty("spring.datasource.url"));
        bds.setMaxTotal(env.getRequiredProperty("spring.datasource.dbcp2.max-total",
                Integer.class));
        bds.setInitialSize(env.getRequiredProperty("spring.datasource.dbcp2.initial-size",
                Integer.class));
        return bds;
    }
}
