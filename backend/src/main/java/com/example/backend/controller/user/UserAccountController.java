package com.example.backend.controller.user;

import com.example.backend.dao.UserDao;
import com.example.backend.service.user.account.InfoService;
import com.example.backend.service.user.account.LoginService;
import com.example.backend.service.user.account.RegisterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class UserAccountController {
    @Autowired
    UserDao userDao;

    @Autowired
    LoginService loginService;

    @Autowired
    InfoService infoService;

    @Autowired
    RegisterService registerService;

    /**
     * register
     */
    @PostMapping("/user/account/register/")
    public Map<String, String> addUser(@RequestParam Map<String, String> map) {
        String name = map.get("name");
        String password = map.get("password");
        String confirmedPassword = map.get("confirmedPassword");
        String photo = map.get("photo");
        return registerService.register(name, password, confirmedPassword, photo);
    }

    @PostMapping("/user/account/info/")
    public Map<String, String> getInfoByToken() {
        return infoService.getInfo();
    }

    /**
     * login or getToken. Return jwt on success
     */
    @PostMapping("/user/account/token/")
    public Map<String, String> getToken(@RequestParam Map<String, String> map) {
        String name = map.get("name");
        String password = map.get("password");
        return loginService.getToken(name, password);
    }

}
