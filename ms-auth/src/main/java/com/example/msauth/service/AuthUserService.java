package com.example.msauth.service;

import com.example.msauth.dto.AuthUserDto;
import com.example.msauth.entity.AuthUser;
import com.example.msauth.entity.TokenDto;

import java.util.List;


public interface AuthUserService {
    public AuthUser save(AuthUserDto authUserDto);


    public TokenDto login(AuthUserDto authUserDto);


    public TokenDto validate(String token);


    Integer getUserIdFromToken(String token);
    List<AuthUser> listarUsuarios();
    boolean eliminarUsuario(Integer id);
}
