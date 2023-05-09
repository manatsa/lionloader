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
import org.zimnat.lionloader.business.domain.enums.UserLevel;
import org.zimnat.lionloader.business.services.RoleService;
import org.zimnat.lionloader.business.services.UserService;
import org.zimnat.lionloader.utils.Constants;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author :: codemaster
 * created on :: 30/3/2023
 */

@RestController
@RequestMapping("/api/users")
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
            user.setPassword(Constants.DEFAULT_PASSWORD);
            user.setRoles(userDTO.getRoles().stream().map(r->roleService.getByName(r)).collect(Collectors.toSet()));
            user.setUserLevel(userDTO.getUserLevel());
            User currentUser = userService.getCurrentUser();
            user = userService.Save(user, currentUser);
            return ResponseEntity.ok(userService.getAll());
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).body(e);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@RequestBody UserDTO userDTO, @PathVariable("id") String id){
        try {
            User currentUser = userService.getCurrentUser();
            User user = userService.update(id,userDTO, currentUser);
            return ResponseEntity.ok(userService.getAll());
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).body(e);
        }
    }

    @PutMapping("/changePassword/{id}")
    public ResponseEntity<?> changeUserPassword(@RequestBody ChangePasswordDTO changePasswordDTO, @PathVariable("id") String id){
        User currentUser=userService.getCurrentUser();
        User user=userService.get(id);
        userService.changePassword(user, currentUser);
        return  ResponseEntity.ok("Password changed successfully!");
    }

}
