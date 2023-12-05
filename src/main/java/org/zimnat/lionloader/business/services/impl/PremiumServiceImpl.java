package org.zimnat.lionloader.business.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.zimnat.lionloader.business.domain.Batch;
import org.zimnat.lionloader.business.domain.Premium;
import org.zimnat.lionloader.business.domain.PremiumItem;
import org.zimnat.lionloader.business.repos.PremiumRepo;
import org.zimnat.lionloader.business.services.PremiumService;

import java.util.List;

/**
 * @author :: codemaster
 * created on :: 23/3/2023
 */

@Service
@Transactional(readOnly = true, propagation = Propagation.SUPPORTS)
public class PremiumServiceImpl implements PremiumService {

    @Autowired
    private PremiumRepo premiumRepo;


    @Override
    public List<PremiumItem> getAll() {
        return premiumRepo.findAll();
    }

    @Override
    public PremiumItem get(long id) {
        return premiumRepo.findById(id).get();
    }

    @Override
    public void delete(PremiumItem t) {
        if (t.getId() == 0) {
            throw new IllegalStateException("Item to be deleted is in an inconsistent state");
        }
        premiumRepo.save(t);
    }

    @Override
    @Transactional
    public PremiumItem save(PremiumItem t) {
        return premiumRepo.save(t);
    }

    @Override
    public List<PremiumItem> getByBatch(Batch batch) {
        return premiumRepo.getByBatch(batch);
    }


}
