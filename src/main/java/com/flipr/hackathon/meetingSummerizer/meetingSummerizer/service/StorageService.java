package com.flipr.hackathon.meetingSummerizer.meetingSummerizer.service;


import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Path;
import java.util.stream.Stream;

public interface StorageService {

    /**
     * Initializes the storage location.
     */
    void init();

    /**
     * Stores a file.
     * @param file The file to be stored.
     * @return The unique filename of the stored file.
     */
    String store(MultipartFile file);

    /**
     * Loads all stored files.
     * @return A stream of paths to the stored files.
     */
    Stream<Path> loadAll();

    /**
     * Loads a file by its filename.
     * @param filename The name of the file to load.
     * @return The path to the file.
     */
    Path load(String filename);

    /**
     * Loads a file as a Spring Resource.
     * @param filename The name of the file to load.
     * @return The file as a Resource.
     */
    Resource loadAsResource(String filename);

    /**
     * Deletes all stored files.
     */
    void deleteAll();
}
