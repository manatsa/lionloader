package org.zimnat.lionloader.business.domain.dto;

import lombok.*;
import org.zimnat.lionloader.business.domain.Privilege;

import java.util.List;

/**
 * @author :: codemaster
 * created on :: 2/4/2023
 */

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class RoleDTO {
    String name;
    List<String> privileges;
}
