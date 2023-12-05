package org.zimnat.lionloader.business.services.impl;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.zimnat.lionloader.business.domain.Role;
import org.zimnat.lionloader.business.domain.User;
import org.zimnat.lionloader.business.domain.dto.RoleDTO;
import org.zimnat.lionloader.business.domain.dto.UserDTO;
import org.zimnat.lionloader.business.repos.RoleRepo;
import org.zimnat.lionloader.business.services.PrivilegeService;
import org.zimnat.lionloader.business.services.RoleService;
import org.zimnat.lionloader.business.services.UserService;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * @author :: codemaster
 * created on :: 23/3/2023
 */

@Service
@Transactional(readOnly = true, propagation = Propagation.SUPPORTS)
public class RoleServiceImpl implements RoleService {

    @Autowired
    private RoleRepo roleRepo;
    @Autowired
    private UserService userService;
    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    PrivilegeService privilegeService;

    @Override
    public List<Role> getAll() {
        return roleRepo.findAll();
    }

    @Override
    public Role get(String id) {
        return roleRepo.findById(id).get();
    }

    @Override
    public void delete(Role t) {
        if (t.getId() == null) {
            throw new IllegalStateException("Item to be deleted is in an inconsistent state");
        }
        t.setActive(Boolean.FALSE);
        roleRepo.save(t);
    }

    @Override
    @Transactional
    public Role save(Role t) {
        t.setId(UUID.randomUUID().toString());
        t.setCreatedBy(userService.get(userService.getCurrentUser().getId()));
        t.setDateCreated(new Date());
        t.setPrivileges(t.getPrivileges().stream().map(p->privilegeService.get(p.getId())).collect(Collectors.toSet()));
        return roleRepo.save(t);
    }

    @Override
    public Role getByName(String name) {
        return roleRepo.getUserRoleByName(name);
    }

    @Override
    public Boolean checkDuplicate(Role current, Role old) {
        if (current.getId() != null) {
            /**
             * @param current is in existence
             */
            if (!current.getName().equals(old.getName())) {
                if (roleRepo.getUserRoleByName(current.getName()) != null) {
                    return true;
                }
            }

        } else if (current.getId() == null) {
            /**
             * @param current is new
             */
            if (roleRepo.getUserRoleByName(current.getName()) != null) {
                return true;
            }
        }
        return false;
    }

    @Override
    public Set<Role> findByNamesIn(Set<String> names) {
        return roleRepo.findByNamesIn(names);
    }

    @Override
    @Transactional
    public Role update(String id, RoleDTO roleDTO, User editor) throws Exception {
        Role target=null;
        Role role=get(id);
        if(role!=null && role.getId()!=null){
            target=entityManager.find(Role.class, role.getId());
            BeanUtils.copyProperties(role, target);
            target.setCreatedBy(userService.get(role.getCreatedBy().getId()));
            target.setModifiedBy(entityManager.find(User.class,userService.getCurrentUser().getId()));
            target.setDateModified(new Date());
            target.setName(roleDTO.getName());
            target.setPrivileges(roleDTO.getPrivileges().stream().map(r->privilegeService.getByName(r)).collect(Collectors.toSet()));
            return entityManager.merge(target);
        }
        return null;
    }


}
