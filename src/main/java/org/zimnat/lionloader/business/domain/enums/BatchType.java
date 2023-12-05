package org.zimnat.lionloader.business.domain.enums;

import org.zimnat.lionloader.utils.StringUtils;

/**
 * @author :: codemaster
 * created on :: 23/3/2023
 */

public enum BatchType {
    FTP_PREMIUM(1), FLEET_PAYMENT(2), RECEIPTS(3), OTHER(4);

    private final Integer code;

    private BatchType(Integer code){
        this.code = code;
    }

    public Integer getCode(){
        return code;
    }

    public static BatchType get(Integer code){
        switch(code){
            case 1:
                return FTP_PREMIUM;
            case 2:
                return FLEET_PAYMENT;
            case 3:
                return RECEIPTS;
            case 4:
                return OTHER;
            default:
                throw new IllegalArgumentException("Illegal parameter passed to method :" + code);
        }
    }

    public String getName(){
        return StringUtils.toCamelCase3(super.name());
    }
}