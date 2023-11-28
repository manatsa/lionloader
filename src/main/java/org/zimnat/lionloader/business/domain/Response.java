package org.zimnat.lionloader.business.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author :: codemaster
 * created on :: 10/11/2023
 * Package Name :: org.zimnat.lionloader.business.domain
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Response {

    private int code;

    private  String message;
}
