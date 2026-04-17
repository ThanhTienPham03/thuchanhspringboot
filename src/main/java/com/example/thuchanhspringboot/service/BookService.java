package com.example.thuchanhspringboot.service;

import com.example.thuchanhspringboot.entity.Book;
import com.example.thuchanhspringboot.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {

    private final BookRepository repo;

    public BookService(BookRepository repo) {
        this.repo = repo;
    }

    public List<Book> getAll() {
        return repo.findAll();
    }

    public Book getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sách"));
    }

    public Book create(Book book) {
        return repo.save(book);
    }

    public Book update(Long id, Book book) {
        Book existing = getById(id);

        existing.setTitle(book.getTitle());
        existing.setAuthor(book.getAuthor());
        existing.setCategory(book.getCategory());
        existing.setPublisher(book.getPublisher());
        existing.setPublishedYear(book.getPublishedYear());
        existing.setQuantity(book.getQuantity());
        existing.setDescription(book.getDescription());
        existing.setImageUrl(book.getImageUrl());

        return repo.save(existing);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    public List<Book> search(String keyword) {
        return repo.findByTitleContainingOrAuthorContainingOrCategoryContaining(
                keyword, keyword, keyword
        );
    }
}