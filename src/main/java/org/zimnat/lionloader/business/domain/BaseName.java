package org.zimnat.lionloader.business.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.zimnat.lionloader.utils.StringUtils;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.Transient;
import java.io.Serializable;

/**
 * @author :: codemaster
 * created on :: 23/3/2023
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@MappedSuperclass
abstract public class BaseName extends BaseEntity implements Serializable {

    private String name;
    @JsonIgnore
    private String description;
    public BaseName(String id) {
        super(id);
    }


    @Transient
    public String getShortName() {
        String raw = name.trim();
        if (raw.split("\\s").length > 1) {
            String output = "";
            String[] arr = raw.split("\\s");
            if (arr[0].length() >= 3) {
                output += arr[0].substring(0, 3);
            }
            if (arr[1].length() >= 3) {
                output += " " + arr[1];
            }
            return StringUtils.toCamelCase2(output);
        }
        if (name.length() >= 7) {
            return getName().substring(0, 6);
        }
        return getName();
    }


}
