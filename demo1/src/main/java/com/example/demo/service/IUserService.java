package com.example.demo.service;

import com.example.demo.Controller.dto.UserDTO;
import com.example.demo.entity.User;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author cyx
 * @since 2024-04-20
 */
public interface IUserService extends IService<User> {
    boolean login(UserDTO userDTO);
}