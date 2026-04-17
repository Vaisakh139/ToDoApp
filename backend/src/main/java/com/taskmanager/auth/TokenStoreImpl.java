package com.taskmanager.auth;

import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@Component
public class TokenStoreImpl implements TokenStore {
    private final Set<String> tokens = Collections.synchronizedSet(new HashSet<>());

    @Override
    public void add(String token)        { tokens.add(token); }
    @Override
    public void remove(String token)     { tokens.remove(token); }
    @Override
    public boolean isValid(String token) { return tokens.contains(token); }
}
