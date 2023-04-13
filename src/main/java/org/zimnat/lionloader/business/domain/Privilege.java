package org.zimnat.lionloader.business.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.zimnat.lionloader.utils.StringUtils;

import javax.persistence.*;
import java.util.Set;

/**
 * @author :: codemaster
 * created on :: 23/3/2023
 */

@Getter
@Setter
@Entity
@ToString
@Table(name = "privilege")
public class Privilege extends BaseName {

    @Transient
    private String printName;

    @JsonIgnore
    @ManyToMany(mappedBy = "privileges", targetEntity = Role.class, fetch = FetchType.LAZY)
    private Set<Privilege> roles;

    public Privilege(String id) {
        super(id);
    }

    public Privilege() {

    }

    public String getPrintName(){
        return StringUtils.toCamelCase3(super.getName());
    }

    @Override
    public String toString(){
        return "ID::"+this.getId()+", Name::"+getPrintName();
    }

}