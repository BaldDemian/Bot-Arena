package com.example.backend.service.impl.user.account;

import com.example.backend.po.User;
import com.example.backend.service.impl.utils.UserDetailsImpl;
import com.example.backend.service.user.account.InfoService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class InfoServiceImpl implements InfoService {
    @Override
    public Map<String, String> getInfo() {
        UsernamePasswordAuthenticationToken authentication =
                (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userDetails.getUser();
        Map<String, String> res = new HashMap<>();
        // load user info from context
        res.put("id", user.getId().toString());
        res.put("name", user.getName());
        res.put("photo", user.getPhoto());
        res.put("msg", "success");
        return res;
    }
}
