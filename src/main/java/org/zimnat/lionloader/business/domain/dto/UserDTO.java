package org.zimnat.lionloader.business.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.zimnat.lionloader.business.domain.BaseName;
import org.zimnat.lionloader.business.domain.Privilege;
import org.zimnat.lionloader.business.domain.Role;
import org.zimnat.lionloader.business.domain.User;
import org.zimnat.lionloader.business.domain.enums.UserLevel;
import org.zimnat.lionloader.business.services.RoleService;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author :: codemaster
 * created on :: 30/3/2023
 */

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class UserDTO {
    private String id;
    private String userName;
    private String firstName;
    private String lastName;
    private UserLevel userLevel;
    private Date dateCreated;
    private List<String> roles;
    private List<String> privileges;
    private String token;
    private boolean active;
    private String password;

    @Autowired
    RoleService roleService;

    public UserDTO(User user, String token) {
        this.id = user.getId();
        this.token=token;
        this.active=user.getActive();
        this.userName = user.getUserName();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.userLevel = user.getUserLevel();
        this.dateCreated = user.getDateCreated();
        this.roles = user.getRoles().stream().map(BaseName::getName).toList();
        this.privileges = user.getRoles().stream().map(role -> role.getPrivileges().stream().map(BaseName::getName).collect(Collectors.joining(","))).collect(Collectors.toList());
    }

    public User createFromDTO(){
            User user=new User();
            user.setFirstName(this.firstName);
            user.setLastName(this.lastName);
            user.setUserLevel(this.userLevel);
            user.setPassword(this.password);
            user.setDateCreated(new Date());
            user.setUserName(this.userName);
            user.setActive(Boolean.TRUE);
            return user;
    }
}
