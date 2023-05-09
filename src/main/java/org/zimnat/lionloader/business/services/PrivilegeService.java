package org.zimnat.lionloader.business.services;

import org.zimnat.lionloader.business.domain.Privilege;
import org.zimnat.lionloader.business.domain.Role;
import org.zimnat.lionloader.business.domain.User;
import org.zimnat.lionloader.business.domain.dto.PrivilegeDTO;

import java.util.List;

/**
 * @author :: codemaster
 * created on :: 23/3/2023
 */

public interface PrivilegeService {

    public Privilege get(String id);
    public Privilege getByName(String name);
    public Privilege save(Privilege userRole, User user);

    public Privilege update(String id, PrivilegeDTO privilegeDTO, User user);
    public List<Privilege> getAll();

    public List<Privilege> getPrivilegesByRole(Role userRole);

}
