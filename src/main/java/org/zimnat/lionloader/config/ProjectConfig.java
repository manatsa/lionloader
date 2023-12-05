package org.zimnat.lionloader.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * @author :: codemaster
 * created on :: 30/11/2023
 * Package Name :: org.zimnat.lionloader.config
 */

@Configuration
public class ProjectConfig {

    @Bean(name = "ZWL")
    public Connection createConnection() throws SQLException{
        String connectionUrl =
                "jdbc:sqlserver://10.200.4.103:1433;"
                        + "database=ZIMNAT;"
                        + "user=sa;"
                        + "password=P@8812345;"
                        + "encrypt=false;"
                        + "trustServerCertificate=true;"
                        + "loginTimeout=30;";

       Connection connection = DriverManager.getConnection(connectionUrl);
        System.err.println(" ----- connected to database to retrieve policies inorder to update excel spreadsheet ---- ");

       return connection;

    }
}
