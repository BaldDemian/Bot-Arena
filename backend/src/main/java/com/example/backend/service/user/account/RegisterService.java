package com.example.backend.service.user.account;

import java.util.Map;

public interface RegisterService {
    Map<String, String> register(String name, String password, String confirmedPassword, String photo);
}
