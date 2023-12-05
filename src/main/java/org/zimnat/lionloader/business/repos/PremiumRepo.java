package org.zimnat.lionloader.business.repos;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.zimnat.lionloader.business.domain.Batch;
import org.zimnat.lionloader.business.domain.Premium;
import org.zimnat.lionloader.business.domain.PremiumItem;

import java.util.List;

/**
 * @author :: codemaster
 * created on :: 23/3/2023
 */

@Repository
public interface PremiumRepo extends CrudRepository<PremiumItem, Long> {

    @Override
    public List<PremiumItem> findAll();


    @Query("from PremiumItem p left join fetch  p.batch b where b=:batch")
    public List<PremiumItem> getByBatch(@Param("batch") Batch batch);


}