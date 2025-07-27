package com.flipr.hackathon.meetingSummerizer.meetingSummerizer.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

@Service
public class TextExtractionService {

    public String extractTextFromFile(MultipartFile file) {
        String filename = file.getOriginalFilename();
        if (filename == null) {
            throw new RuntimeException("Invalid file: No filename provided");
        }

        String extension = getFileExtension(filename).toLowerCase();

        try {
            switch (extension) {
                case "txt":
                    return extractFromTextFile(file);
                case "pdf":
                    return extractFromPdfFile(file);
                case "doc":
                case "docx":
                    return extractFromWordFile(file);
                default:
                    throw new RuntimeException("Unsupported file format: " + extension);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to extract text from file: " + e.getMessage(), e);
        }
    }

    private String extractFromTextFile(MultipartFile file) throws IOException {
        StringBuilder content = new StringBuilder();

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

            String line;
            while ((line = reader.readLine()) != null) {
                content.append(line).append("\n");
            }
        }

        return content.toString();
    }

    private String extractFromPdfFile(MultipartFile file) throws IOException {
        // For PDF extraction, you'll need to add Apache PDFBox dependency
        // For now, return a placeholder
        return "PDF text extraction requires Apache PDFBox library. " +
                "Please add the dependency to extract PDF content.";
    }

    private String extractFromWordFile(MultipartFile file) throws IOException {
        // For Word document extraction, you'll need Apache POI dependency
        // For now, return a placeholder
        return "Word document text extraction requires Apache POI library. " +
                "Please add the dependency to extract Word document content.";
    }

    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex > 0 && lastDotIndex < filename.length() - 1) {
            return filename.substring(lastDotIndex + 1);
        }
        return "";
    }
}
