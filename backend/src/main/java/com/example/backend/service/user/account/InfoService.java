package com.example.backend.service.user.account;

import java.util.Map;

/**
 * get user info using token
 */
public interface InfoService {
    Map<String, String> getInfo();
}
