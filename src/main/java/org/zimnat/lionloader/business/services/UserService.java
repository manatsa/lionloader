package org.zimnat.lionloader.business.services;

import org.zimnat.lionloader.business.domain.User;
import org.zimnat.lionloader.business.domain.dto.UserDTO;

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

    public User changePassword(User editor, String newPassword);

    public User resetPassword(String id, User editor);

    public User update(String id, UserDTO userDTO, User editor) throws Exception;

    public User activateDeactivate(String id, User editor) throws Exception;

    public User lockAccount(String id) throws Exception;

    public List<User> searchUsers(String [] names);


}