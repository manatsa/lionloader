package org.zimnat.lionloader.business.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.format.annotation.DateTimeFormat;
import org.zimnat.lionloader.business.domain.enums.UserLevel;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;


/**
 * @author :: codemaster
 * created on :: 23/3/2023
 */

@Getter
@Setter
@ToString(exclude = {"password","confirmPassword",""})
@NoArgsConstructor
@AllArgsConstructor
@Entity
//@JsonIgnoreProperties(value = {"version","createdBy","modifiedBy"},allowGetters = true)
@Table(name = "users", indexes = {
        @Index(name = "user_user_name", columnList = "userName")
        /*@Index(name = "user_user_organization", columnList = "organization"),
        @Index(name = "user_user_unit", columnList = "business_unit")*/
})

public class User implements Serializable {

    @Id
    private String id;
    private String createdBy;
    @Column(nullable = true)
    private String modifiedBy;
    @CreatedDate
    @Column(nullable = false, updatable = false)
    @Temporal(TemporalType.DATE)
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    private Date dateCreated;
    @LastModifiedDate
    @Temporal(TemporalType.DATE)
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    private Date dateModified;
    @Transient
    private String roleString;
    @Transient
    private String privilegeString;
    @Transient
    private  String activeString;

    /*@Version
    private Long version;*/
    private Boolean active = Boolean.TRUE;
   /* @JsonIgnore
    private static final long serialVersionUID = 1L;*/
    @JsonIgnore
    private String password;
    @Transient
    @JsonIgnore
    private String confirmPassword;
    private String firstName;
    private String lastName;
    @Column(unique = true)
    private String userName;
    @Enumerated
    private UserLevel userLevel;
    @Transient
    private String displayName;
    @ManyToMany(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    @JoinTable(name = "user_role", joinColumns = {
            @JoinColumn(name = "user_id", nullable = false)}, inverseJoinColumns = {
            @JoinColumn(name = "role_id", nullable = false)})
    private Set<Role> roles = new HashSet<>();



    public String getStringRoles() {
        if(roles.isEmpty()){
            return "";
        }
        StringBuilder r = new StringBuilder();
        int pos = 1;
        for(Role role : roles){
            if(pos < roles.size()) {
                r.append(role.getName());
                r.append(" ,");
            }else{
                r.append(role.getName());
            }
            pos++;
        }
        return r.toString();
    }


}