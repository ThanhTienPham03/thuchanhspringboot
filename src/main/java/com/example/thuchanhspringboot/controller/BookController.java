package com.example.thuchanhspringboot.controller;

import com.example.thuchanhspringboot.entity.Book;
import com.example.thuchanhspringboot.service.BookService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*")
public class BookController {
    private final BookService service;
    public BookController(BookService service) {
        this.service = service;
    }
    @GetMapping
    public List<Book> getAllBooks() {
        return service.getAll();
    }
    @GetMapping("/{id}")
    public Book getBookById(@PathVariable Long id) {
        return service.getById(id);
    }
    @PostMapping
    public Book createBook(@RequestBody Book book) {
        return service.create(book);
    }
    @PutMapping("/{id}")
    public Book updateBook(@PathVariable Long id, @RequestBody Book book) {
        return service.update(id, book);
    }
    @DeleteMapping("/{id}")
    public String deleteBook(@PathVariable Long id) {
        service.delete(id);
        return "Xóa thành công!";
    }
    @GetMapping("/search")
    public List<Book> searchBooks(@RequestParam String keyword) {
        return service.search(keyword);
    }
}
