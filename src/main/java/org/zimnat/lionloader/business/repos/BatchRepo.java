package org.zimnat.lionloader.business.repos;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.zimnat.lionloader.business.domain.Batch;
import org.zimnat.lionloader.business.domain.Premium;

import java.util.List;

/**
 * @author :: codemaster
 * created on :: 23/3/2023
 */

@Repository
public interface BatchRepo extends CrudRepository<Batch, Long> {

    @Override
    public List<Batch> findAll();



//    @Query("from Role p "+ Constants.USER_ROLE_CONSTANT+" where p.active=:active Order By p.name ASC")
//    public List<Role> getOptAll(@Param("active") Boolean active);
//
//    @Query("from Role p "+ Constants.USER_ROLE_CONSTANT+" where p.name=:name")
//    public Role getUserRoleByName(@Param("name") String name);
//
//    @Query("from Role p "+ Constants.USER_ROLE_CONSTANT+" where p.name in (:names)")
//    public Set<Role> findByNamesIn(@Param("names") Set<String> names);


}