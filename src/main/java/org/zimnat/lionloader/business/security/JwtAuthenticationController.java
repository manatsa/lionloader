package org.zimnat.lionloader.business.security;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.zimnat.lionloader.business.domain.User;
import org.zimnat.lionloader.business.domain.dto.UserDTO;
import org.zimnat.lionloader.business.security.provider.UserDetailsServiceImpl;
import org.zimnat.lionloader.business.services.UserService;
import org.zimnat.lionloader.exceptions.AccountLockedException;
import org.zimnat.lionloader.utils.APIResponse;


import java.text.SimpleDateFormat;
import java.util.Date;



@RestController
@CrossOrigin(origins = "*")
@RequestMapping("api/")
public class JwtAuthenticationController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    UserService userService;

    @Autowired
    PasswordEncoder passwordEncoder;



    @RequestMapping(value = "authenticate", method = RequestMethod.POST)
    @ExceptionHandler(AccountLockedException.class)
    public ResponseEntity<?> createAuthenticationToken(@RequestBody JwtRequest authenticationRequest) throws Exception {
        SimpleDateFormat format= new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
        User user=userService.findByUserName(authenticationRequest.getUsername());
        if(user!=null){
            authenticate(authenticationRequest.getUsername(), authenticationRequest.getPassword());
            final UserDetails userDetails = userDetailsService
                    .loadUserByUsername(authenticationRequest.getUsername());

            final String token = jwtTokenUtil.generateToken(userDetails);
            System.err.println(authenticationRequest.getUsername()+" has logged in.........> Date: "+format.format(new Date()));
            UserDTO userDTO=new UserDTO(user, token);
            return ResponseEntity.ok(userDTO);
        }else{
            return new ResponseEntity<APIResponse>(new APIResponse(HttpStatus.FORBIDDEN,"Your account is locked. Please get assistance from admin."), HttpStatus.FORBIDDEN);

        }

    }

    private void authenticate(String username, String password) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException e) {
            throw new Exception("USER_DISABLED", e);
        } catch (BadCredentialsException e) {
            throw new Exception("INVALID_CREDENTIALS", e);
        }
    }
}
