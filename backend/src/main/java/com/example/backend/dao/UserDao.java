package com.example.backend.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.backend.po.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserDao extends BaseMapper<User> {
}
