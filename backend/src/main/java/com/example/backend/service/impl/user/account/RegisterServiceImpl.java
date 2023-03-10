package com.example.backend.service.impl.user.account;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.example.backend.dao.UserDao;
import com.example.backend.po.User;
import com.example.backend.service.user.account.RegisterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class RegisterServiceImpl implements RegisterService {
    @Autowired
    private UserDao userDao;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public Map<String, String> register(String name, String password, String confirmedPassword, String photo) {
        // check if the name is used
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("name", name);
        User tmp = userDao.selectOne(queryWrapper);
        Map<String, String> res = new HashMap<>();
        if (tmp != null) {
            res.put("msg", "failure");
            res.put("code", "101");
            return res;
        }
        // check if two passwords are the same
        if (!password.equals(confirmedPassword)) {
            res.put("msg", "failure");
            res.put("code", "102");
            return res;
        }
        // check if the password is too short
        if (password.length() < 6) {
            res.put("msg", "failure");
            res.put("code", "103");
            return res;
        }
        // all checks pass, create the instance and add it to database
        name = name.trim();
        // encode the password
        password = encoder.encode(password);
        photo = "https://img.balddemian.icu/img/bernese.jpg"; //todo:
        User user = new User(null, name, password, photo);
        userDao.insert(user);
        res.put("msg", "success");
        res.put("code", "100");
        return res;
    }
}
