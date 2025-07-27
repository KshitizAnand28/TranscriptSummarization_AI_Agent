package com.flipr.hackathon.meetingSummerizer.meetingSummerizer.controller;

import com.flipr.hackathon.meetingSummerizer.meetingSummerizer.service.StorageService;
import com.flipr.hackathon.meetingSummerizer.meetingSummerizer.service.StorageService.*;
import com.flipr.hackathon.meetingSummerizer.meetingSummerizer.service.LLMService;
import com.flipr.hackathon.meetingSummerizer.meetingSummerizer.service.TextExtractionService;
import com.flipr.hackathon.meetingSummerizer.meetingSummerizer.service.SlackService;
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

    @Autowired
    private TextExtractionService textExtractionService;

    @Autowired
    private SlackService slackService; // Add this

    @PostMapping("/summarize")
    public ResponseEntity<String> summarize(@RequestBody String prompt) {
        String result = llmService.generateContent(prompt);

        // Optionally post to Slack
//        slackService.postSummaryToSlack(result, "Text Input");
        slackService.postMessage(result);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/extract-and-summarize")
    public ResponseEntity<String> extractAndSummarize(@RequestParam("textFile") MultipartFile file) {
        try {
            String filename = storageService.store(file);
            String extractedText = textExtractionService.extractTextFromFile(file);

            if (extractedText.trim().isEmpty()) {
                return ResponseEntity.ok("No text content found in the file.");
            }

            String prompt = "Please summarize the following text:\n\n" + extractedText;
            String summary = llmService.generateContent(prompt);

            // Post summary to Slack
            slackService.postMessage(summary);

            return ResponseEntity.ok(
                            "Summary:\n" + summary
            );

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Error processing file: " + e.getMessage());
        }
    }
}

