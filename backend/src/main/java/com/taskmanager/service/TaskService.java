package com.taskmanager.service;

import com.taskmanager.model.Task;

import java.util.List;

public interface TaskService {
    List<Task> findAll();
    Task findById(Long id);
    Task create(Task task);
    Task update(Long id, Task updated);
    Task patchStatus(Long id, Task.Status status);
    void delete(Long id);
}
