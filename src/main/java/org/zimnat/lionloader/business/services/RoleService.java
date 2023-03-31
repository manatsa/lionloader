package org.zimnat.lionloader.business.services;

import org.springframework.transaction.annotation.Transactional;
import org.zimnat.lionloader.business.domain.Role;

import java.util.List;
import java.util.Set;

/**
 * @author :: codemaster
 * created on :: 23/3/2023
 */

public interface RoleService {

    public List<Role> getAll();

    Role get(String id);

    void delete(Role t);

    @Transactional
    Role save(Role t);

    public Role getByName(String name);

    Boolean checkDuplicate(Role current, Role old);

    public Set<Role> findByNamesIn(Set<String> names);

    public Role update(Role t);
}