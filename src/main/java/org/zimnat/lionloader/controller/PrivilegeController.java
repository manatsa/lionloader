package org.zimnat.lionloader.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zimnat.lionloader.business.domain.Privilege;
import org.zimnat.lionloader.business.domain.Role;
import org.zimnat.lionloader.business.domain.dto.RoleDTO;
import org.zimnat.lionloader.business.services.PrivilegeService;

import java.util.Arrays;
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

    @GetMapping("/")
    public ResponseEntity<?> getAll(){
        return ResponseEntity.ok(privilegeService.getAllPrivileges());
    }

    @PostMapping("/")
    public ResponseEntity<?> createRole(@RequestBody String name){

        Privilege privilege=new Privilege(name);
        try{
            privilege =privilegeService.save(privilege);
            return  ResponseEntity.ok(privilegeService.getAllPrivileges());
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }
}
