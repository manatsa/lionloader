package org.zimnat.lionloader.business.domain.dto;

import lombok.*;

/**
 * @author :: codemaster
 * created on :: 30/3/2023
 */

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ChangePasswordDTO {
    private String userId;
    private String newPassword;
}
