package org.zimnat.lionloader.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zimnat.lionloader.business.domain.Privilege;
import org.zimnat.lionloader.business.domain.Role;
import org.zimnat.lionloader.business.domain.User;
import org.zimnat.lionloader.business.domain.dto.PrivilegeDTO;
import org.zimnat.lionloader.business.domain.dto.RoleDTO;
import org.zimnat.lionloader.business.services.PrivilegeService;
import org.zimnat.lionloader.business.services.UserService;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * @author :: codemaster
 * created on :: 2/4/2023
 */

@RestController
@RequestMapping("/api/privileges")
public class PrivilegeController {

    @Autowired
    PrivilegeService privilegeService;

    @Autowired
    UserService userService;

    @GetMapping("/")
    public ResponseEntity<?> getAll(){
        return ResponseEntity.ok(privilegeService.getAll());
    }


    @PostMapping("/")
    public ResponseEntity<?> createRole(@RequestBody PrivilegeDTO privilegeDTO){
        Privilege privilege= new Privilege();
        privilege.setName(privilegeDTO.getName());
        User user=userService.getCurrentUser();
        try{
            privilege =privilegeService.save(privilege, user);
            return  ResponseEntity.ok(privilegeService.getAll());
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> createPrivilege(@RequestBody PrivilegeDTO privilegeDTO, @PathVariable("id") String id){

        try{
            User currentUser=userService.getCurrentUser();
            Privilege privilege=privilegeService.update(id, privilegeDTO,currentUser);
            return  ResponseEntity.ok(privilegeService.getAll());
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }
}
