package com.flipr.hackathon.meetingSummerizer.meetingSummerizer.controller;

import com.flipr.hackathon.meetingSummerizer.meetingSummerizer.service.StorageService;
import com.flipr.hackathon.meetingSummerizer.meetingSummerizer.service.StorageService.*;
import com.flipr.hackathon.meetingSummerizer.meetingSummerizer.service.LLMService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class ApiController {

    @Autowired
    private LLMService llmService;

    @Autowired
    private StorageService storageService;
    // Your existing endpoint for text summarization
    @PostMapping("/summarize")
    public ResponseEntity<String> summarize(@RequestBody String prompt) {
        String result = llmService.generateContent(prompt);
        return ResponseEntity.ok(result);
    }

    // New endpoint for handling audio file uploads
    @PostMapping("/summarize-audio")
    public ResponseEntity<String> summarizeAudio(@RequestParam("audioFile") MultipartFile file) {
        // 1. Store the file using the service
        String filename = storageService.store(file);
        System.out.println("File stored with name: " + filename);

        // 2. TODO: Transcribe audio to text
        String transcription = "Placeholder transcription for " + filename;
        String summary = llmService.generateContent("Summarize: " + transcription);

        return ResponseEntity.ok("File uploaded as " + filename + "\n\nSummary:\n" + summary);
    }
}