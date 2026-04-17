package com.taskmanager.auth;

public interface TokenStore {
    void add(String token);
    void remove(String token);
    boolean isValid(String token);
}
