package org.zimnat.lionloader.business.domain.enums;

import org.zimnat.lionloader.utils.StringUtils;

/**
 * @author :: codemaster
 * created on :: 23/3/2023
 */

public enum UserLevel {
    ADMIN(1), USER(2), MANAGER(3),EXECUTIVE(4), OTHER(5);

    private final Integer code;

    private UserLevel(Integer code){
        this.code = code;
    }

    public Integer getCode(){
        return code;
    }

    public static UserLevel get(Integer code){
        switch(code){
            case 1:
                return ADMIN;
            case 2:
                return USER;
            case 3:
                return MANAGER;
            case 4:
                return EXECUTIVE;
            case 5:
                return OTHER;
            default:
                throw new IllegalArgumentException("Illegal parameter passed to method :" + code);
        }
    }

    public String getName(){
        return StringUtils.toCamelCase3(super.name());
    }
}