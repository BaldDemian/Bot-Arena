package com.example.backend.service.impl.user.account;

import com.example.backend.po.User;
import com.example.backend.service.impl.utils.UserDetailsImpl;
import com.example.backend.service.user.account.LoginService;
import com.example.backend.utils.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * if the use logs in successfully, generate the token and return it
 */
@Service
public class LoginServiceImpl implements LoginService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    public Map<String, String> getToken(String name, String password) {
        // encapsulate user info
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(name, password);
        var authenticate = authenticationManager.authenticate(authenticationToken);
        UserDetailsImpl userDetails = (UserDetailsImpl) authenticate.getPrincipal();
        User user = userDetails.getUser();
        String jwt = JWTUtil.createJWT(user.getId().toString());
        Map<String, String> res = new HashMap<>();
        res.put("msg", "success");
        res.put("jwt", jwt);
        return res;
    }
}
