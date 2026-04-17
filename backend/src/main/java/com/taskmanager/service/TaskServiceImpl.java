package com.taskmanager.service;

import com.taskmanager.model.Task;
import com.taskmanager.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository repository;

    public TaskServiceImpl(TaskRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Task> findAll() {
        return repository.findAll();
    }

    @Override
    public Task findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
    }

    @Override
    public Task create(Task task) {
        return repository.save(task);
    }

    @Override
    public Task update(Long id, Task updated) {
        Task task = findById(id);
        task.setTitle(updated.getTitle());
        task.setDescription(updated.getDescription());
        task.setStatus(updated.getStatus());
        return repository.save(task);
    }

    @Override
    public Task patchStatus(Long id, Task.Status status) {
        Task task = findById(id);
        task.setStatus(status);
        return repository.save(task);
    }

    @Override
    public void delete(Long id) {
        findById(id); // throws if not found
        repository.deleteById(id);
    }
}
