package com.example.thuchanhspringboot.repository;

import com.example.thuchanhspringboot.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByTitleContainingOrAuthorContainingOrCategoryContaining(
            String title,
            String author,
            String category
    );
}
