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

    Batch get(String id);

    void delete(Batch t);

    @Transactional
    Batch save(Batch t);

    public Batch getByName(String name);

    Boolean checkDuplicate(Batch current, Batch old);

    public Set<Batch> findByNamesIn(Set<String> names);
}