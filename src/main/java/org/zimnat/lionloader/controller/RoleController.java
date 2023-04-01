package org.zimnat.lionloader.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zimnat.lionloader.business.domain.BaseName;
import org.zimnat.lionloader.business.domain.Role;
import org.zimnat.lionloader.business.services.RoleService;

import java.util.List;
import java.util.Optional;

/**
 * @author :: codemaster
 * created on :: 1/4/2023
 */

@RestController
@RequestMapping("/roles")
public class RoleController {

   @Autowired
   RoleService roleService;

    @GetMapping("/")
    public ResponseEntity<?> getRoles(){
        try{
           return ResponseEntity.ok(roleService.getAll().stream().map(BaseName::getName).toList());
        }catch (Exception e){
            return ResponseEntity.status(500).body(e);
        }
    }
}
