package org.zimnat.lionloader.business.domain;

import lombok.*;
import org.zimnat.lionloader.utils.StringUtils;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

/**
 * @author :: codemaster
 * created on :: 23/3/2023
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "role")
//@ToString(exclude = {"users", "privileges"}, callSuper = false)
public class Role extends BaseName {

    @Transient
    private String printName;
    public Role(String id) {
        super(id);
    }

    @ManyToMany(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    @JoinTable(name = "role_privileges", joinColumns = {
            @JoinColumn(name = "role_id", nullable = false)}, inverseJoinColumns = {
            @JoinColumn(name = "privilege_id", nullable = false)})
    private Set<Privilege> privileges = new HashSet<>();

    public String getPrintName(){
        return StringUtils.toCamelCase3(super.getName());
    }

    @Override
    public String toString(){
        return getPrintName();
    }

}