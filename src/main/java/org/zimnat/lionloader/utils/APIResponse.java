package org.zimnat.lionloader.utils;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

/**
 * @author :: codemaster
 * created on :: 10/5/2023
 */

@AllArgsConstructor
@NoArgsConstructor
@Data
public class APIResponse {
    private HttpStatus status;
    private String message;

}
