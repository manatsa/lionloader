package org.zimnat.lionloader;

import org.apache.log4j.BasicConfigurator;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

/**
 * @author :: codemaster
 * created on :: 23/3/2023
 */

@SpringBootApplication
public class LionLoaderApplication {

    public static void main(String[] args) {
        SpringApplication.run(LionLoaderApplication.class, args);
    }

    @Bean
    public void init(){
        BasicConfigurator.configure();
    }

}
