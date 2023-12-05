package org.zimnat.lionloader.business.services.impl;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.zimnat.lionloader.business.domain.Batch;
import org.zimnat.lionloader.business.repos.BatchRepo;
import org.zimnat.lionloader.business.services.BatchService;
import org.zimnat.lionloader.business.services.PrivilegeService;
import org.zimnat.lionloader.business.services.UserService;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.time.LocalDateTime;
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
public class BatchServiceImpl implements BatchService {

    @Autowired
    private BatchRepo batchRepo;
    @Autowired
    private UserService userService;
    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    PrivilegeService privilegeService;

    @Override
    public List<Batch> getAll() {
        return batchRepo.findAll();
    }

    @Override
    public Batch get(long id) {
        return batchRepo.findById(id).get();
    }

    @Override
    public void delete(Batch t) {
        if (t.getId() == 0) {
            throw new IllegalStateException("Item to be deleted is in an inconsistent state");
        }
        batchRepo.save(t);
    }

    @Override
    @Transactional
    public Batch save(Batch t) {
        t.setUser(userService.get(userService.getCurrentUser().getId()));
        t.setCreateDate(LocalDateTime.now());
        return batchRepo.save(t);
    }





}
