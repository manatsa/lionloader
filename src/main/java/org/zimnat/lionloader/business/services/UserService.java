package org.zimnat.lionloader.business.services;

import org.zimnat.lionloader.business.domain.User;

import java.util.List;

/**
 * @author :: codemaster
 * created on :: 23/3/2023
 */

public interface UserService {

    public User get(String id);

    public List<User> getAllActive();
    public List<User> getAll();

    public User Save(User user, User editor);

    public void delete(User user);

    public User findByUserName(String name);

    public String getCurrentUsername();

    public User getCurrentUser();

    public User changePassword(User t, User editor);

    public User update(User user, User editor);

    public List<User> searchUsers(String [] names);


}