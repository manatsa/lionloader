package org.zimnat.lionloader.business.services;

import org.springframework.transaction.annotation.Transactional;
import org.zimnat.lionloader.business.domain.Batch;
import org.zimnat.lionloader.business.domain.PremiumItem;

import java.util.List;

/**
 * @author :: codemaster
 * created on :: 23/3/2023
 */

public interface PremiumService {

    public List<PremiumItem> getAll();

    PremiumItem get(long id);

    void delete(PremiumItem t);

    @Transactional
    PremiumItem save(PremiumItem t);

    List<PremiumItem> getByBatch(Batch batch);
}