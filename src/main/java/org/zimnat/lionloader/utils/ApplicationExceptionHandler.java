package org.zimnat.lionloader.utils;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.zimnat.lionloader.exceptions.AccountLockedException;

/**
 * @author :: codemaster
 * created on :: 10/5/2023
 */

@ControllerAdvice
public class ApplicationExceptionHandler {

    @ResponseStatus(
            value = HttpStatus.BAD_REQUEST,
            reason = "Account has been locked or user is not in the system.")
    @ExceptionHandler(AccountLockedException.class)
    public void handleException(AccountLockedException e) {
    }

    /*@ResponseStatus(
            value = HttpStatus.BAD_GATEWAY,
            reason = "Received Invalid Input Parameters")
    @ExceptionHandler(InputValidationException.class)
    public void handleException(InputValidationException e) {
    }

    @ResponseStatus(
            value = HttpStatus.GATEWAY_TIMEOUT,
            reason = "Upstream Service Not Responding, Try Again")
    @ExceptionHandler(ServiceUnavailableException.class)
    public void handleException(ServiceUnavailableException e) {
    }*/
}