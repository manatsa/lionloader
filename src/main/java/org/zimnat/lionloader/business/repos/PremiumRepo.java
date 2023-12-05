package org.zimnat.lionloader.business.repos;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.zimnat.lionloader.business.domain.Role;
import org.zimnat.lionloader.utils.Constants;

import java.util.List;
import java.util.Set;

/**
 * @author :: codemaster
 * created on :: 23/3/2023
 */

@Repository
public interface RoleRepo extends CrudRepository<Role, String> {

    @Override
    public List<Role> findAll();

    @Query("from Role p "+ Constants.USER_ROLE_CONSTANT+" where p.active=:active Order By p.name ASC")
    public List<Role> getOptAll(@Param("active") Boolean active);

    @Query("from Role p "+ Constants.USER_ROLE_CONSTANT+" where p.name=:name")
    public Role getUserRoleByName(@Param("name") String name);

    @Query("from Role p "+ Constants.USER_ROLE_CONSTANT+" where p.name in (:names)")
    public Set<Role> findByNamesIn(@Param("names") Set<String> names);


}