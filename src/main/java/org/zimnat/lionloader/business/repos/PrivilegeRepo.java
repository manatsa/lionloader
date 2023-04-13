package org.zimnat.lionloader.business.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zimnat.lionloader.business.domain.Privilege;
import org.zimnat.lionloader.business.domain.Role;

import java.util.List;

/**
 * @author :: codemaster
 * created on :: 23/3/2023
 */

public interface PrivilegeRepo extends JpaRepository<Privilege, String> {


    List<Privilege> findAllByRolesIn(List<Role> role);
    Privilege getByName(String name);
}