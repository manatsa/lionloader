/*
 * Copyright 2015 Judge Muzinda.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.zimnat.lionloader.business.security.provider;

import lombok.SneakyThrows;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.zimnat.lionloader.business.domain.Role;
import org.zimnat.lionloader.business.services.UserService;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 *
 * @author Judge Muzinda
 */
@Service("userDetails")
public class UserDetailsServiceImpl implements org.springframework.security.core.userdetails.UserDetailsService {
    
    final Logger logger = LoggerFactory.getLogger(UserDetailsServiceImpl.class);
    
    @Autowired
    private UserService userService;

    @SneakyThrows
    @Override
    public UserDetails loadUserByUsername(String userName)
            throws UsernameNotFoundException {

        //logger.info("Loading user record for user name: {}", userName);
        UserDetails userDetails = null;

        org.zimnat.lionloader.business.domain.User user = (org.zimnat.lionloader.business.domain.User) userService.findByUserName(userName);
        //logger.info("**********************************************Hello");

        if(!user.getActive()){
            throw new AccountLockedException("User account is locked. Please get assistance from the administrator.");
        }
        if (user != null) {
            String password = user.getPassword();
            //System.out.println("++++++++++++++++++++++++++++++++++++++++++++ "+user.toString());
            Set<Role> roles = user.getRoles();
            List<GrantedAuthority> authorities = new ArrayList<>();
            for (Role role : roles) {
                String roleName = role.getName();
                authorities.add(new SimpleGrantedAuthority(roleName));
            }
            userDetails = new User(userName, password, authorities);

        } else {
            // If username not found, throw exception

            throw new UsernameNotFoundException("User " + userName + " not found");

        }
        return userDetails;
    }
}