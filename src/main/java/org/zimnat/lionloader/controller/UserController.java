package org.zimnat.lionloader.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.zimnat.lionloader.business.domain.User;
import org.zimnat.lionloader.business.domain.dto.ChangePasswordDTO;
import org.zimnat.lionloader.business.domain.dto.UserDTO;
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
    PasswordEncoder passwordEncoder;

    @GetMapping("/")
    public List<User> getAllUsers(){
        List<User> users= userService.getAll();

        return users.stream().map(user ->{
            user.setActiveString(user.getActive().toString());
            user.setRoleString(user.getRoles().stream().map(role -> role.getName()).collect(Collectors.joining(",")));
            return user;
        }
        ).collect(Collectors.toList());
    }

    @PostMapping("/")
    public ResponseEntity<?> createUser(@RequestBody UserDTO userDTO){
        User user=userDTO.createFromDTO();
        User currentuser=userService.getCurrentUser();
        user=userService.Save(user, currentuser);
        return  ResponseEntity.ok(user);
    }

    @PostMapping("/changePassword")
    public ResponseEntity<?> changeUserPassword(@RequestBody ChangePasswordDTO changePasswordDTO){
        User currentuser=userService.getCurrentUser();
        User user=userService.get(changePasswordDTO.getUserId());
        //user.setPassword(changePasswordDTO.getNewPassword());
        //PasswordEncoder encoder = new BCryptPasswordEncoder(8);
       // String hashedPassword = encoder.encode(changePasswordDTO.getNewPassword());
        //user.setPassword(changePasswordDTO.getNewPassword());
        userService.changePassword(user, currentuser);
        System.err.println("User ::"+currentuser.getUserName()+" has change password for user:: "+user.getUserName()+" on ::"+new Date());
        return  ResponseEntity.ok("Password changed successfully!");
    }

}
