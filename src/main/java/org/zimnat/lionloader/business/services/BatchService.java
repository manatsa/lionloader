package org.zimnat.lionloader.business.services;

import org.springframework.transaction.annotation.Transactional;
import org.zimnat.lionloader.business.domain.Batch;

import java.util.List;
import java.util.Set;

/**
 * @author :: codemaster
 * created on :: 23/3/2023
 */

public interface BatchService {

    public List<Batch> getAll();

    Batch get(long id);

    void delete(Batch t);

    @Transactional
    Batch save(Batch t);


}