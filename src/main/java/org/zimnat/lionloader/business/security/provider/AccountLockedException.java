package org.zimnat.lionloader.business.security.provider;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * @author :: codemaster
 * created on :: 10/5/2023
 */

@AllArgsConstructor
public class AccountLockedException extends Exception{

    private String username;

    public AccountLockedException(){
        super("The account has been locked. Please get the administrator for assistance.");
    }

}
