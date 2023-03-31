package org.zimnat.lionloader.business.services;

import org.zimnat.lionloader.business.domain.Privilege;
import org.zimnat.lionloader.business.domain.Role;

import java.util.List;

/**
 * @author :: codemaster
 * created on :: 23/3/2023
 */

public interface PrivilegeService {

    public Privilege get(String id);
    public Privilege save(Privilege userRole);

    public Privilege update(Privilege userRole);
    public List<Privilege> getAllPrivileges();

    public List<Privilege> getPrivilegesByRole(Role userRole);

}
