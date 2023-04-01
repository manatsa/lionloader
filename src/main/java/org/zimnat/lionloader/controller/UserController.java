package org.zimnat.lionloader.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.zimnat.lionloader.business.domain.BaseName;
import org.zimnat.lionloader.business.domain.User;
import org.zimnat.lionloader.business.domain.dto.ChangePasswordDTO;
import org.zimnat.lionloader.business.domain.dto.UserDTO;
import org.zimnat.lionloader.business.services.RoleService;
import org.zimnat.lionloader.business.services.UserService;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author :: codemaster
 * created on :: 30/3/2023
 */

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    UserService userService;

    @Autowired
    RoleService roleService;

    @Autowired
    PasswordEncoder passwordEncoder;

    @GetMapping("/")
    public List<User> getAllUsers(){
        List<User> users= userService.getAll();

        System.err.println(users);
        return users.stream().peek(user ->{
            user.setActiveString(user.getActive().toString());
            user.setRoleString(user.getRoles().stream().map(BaseName::getName).collect(Collectors.joining(",")));
                }
        ).collect(Collectors.toList());
    }

    @PostMapping("/")
    public ResponseEntity<?> createUser(@RequestBody UserDTO userDTO){
        try {

            User user = userDTO.createFromDTO();
            user.setRoles(userDTO.getRoles().stream().map(r->roleService.getByName(r)).collect(Collectors.toSet()));
            System.err.println(user);
            User currentUser = userService.getCurrentUser();
            user = userService.Save(user, currentUser);
            return ResponseEntity.ok(user);
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).body(e);
        }
    }

    @PostMapping("/changePassword")
    public ResponseEntity<?> changeUserPassword(@RequestBody ChangePasswordDTO changePasswordDTO){
        User currentuser=userService.getCurrentUser();
        User user=userService.get(changePasswordDTO.getUserId());
        userService.changePassword(user, currentuser);
        System.err.println("User ::"+currentuser.getUserName()+" has change password for user:: "+user.getUserName()+" on ::"+new Date());
        return  ResponseEntity.ok("Password changed successfully!");
    }

}
