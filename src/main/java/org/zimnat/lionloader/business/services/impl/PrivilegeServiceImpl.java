package org.zimnat.lionloader.business.services.impl;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zimnat.lionloader.business.domain.dto.PrivilegeDTO;
import org.zimnat.lionloader.business.repos.PrivilegeRepo;
import org.zimnat.lionloader.business.domain.Privilege;
import org.zimnat.lionloader.business.domain.Role;
import org.zimnat.lionloader.business.domain.User;
import org.zimnat.lionloader.business.services.PrivilegeService;
import org.zimnat.lionloader.business.services.UserService;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * @author :: codemaster
 * created on :: 23/3/2023
 */

@Service
public class PrivilegeServiceImpl implements PrivilegeService {
    @Autowired
    PrivilegeRepo privilegeRepo;

    @PersistenceContext
    EntityManager entityManager;

    @Autowired
    UserService userService;

    @Override
    public Privilege get(String id) {
        return privilegeRepo.getById(id);
    }

    @Override
    public Privilege getByName(String name) {
        return privilegeRepo.getByName(name);
    }

    @Override
    public Privilege save(Privilege t, User user) {
        t.setCreatedBy(user);
        t.setId(UUID.randomUUID().toString());
        t.setDateCreated(new Date());
        return privilegeRepo.save(t);
    }

    @Override
    @Transactional
    public Privilege update(String id, PrivilegeDTO privilegeDTO, User user) {
        Privilege target = null;
        Privilege privilege=get(id);
        if (privilege != null && privilege.getId() != null) {
            target = entityManager.find(Privilege.class, privilege.getId());
            target.setModifiedBy(entityManager.find(User.class, userService.getCurrentUser().getId()));
            BeanUtils.copyProperties(privilege, target);
            target.setCreatedBy(user);
            target.setDateModified(new Date());
            target.setName(privilegeDTO.getName());
            return entityManager.merge(target);
        }

        return null;
    }

    @Override
    public List<Privilege> getAll() {
        return privilegeRepo.findAll();
    }

    @Override
    public List<Privilege> getPrivilegesByRole(Role userRole) {
        return null;
    }
}