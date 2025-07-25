package com.flipr.hackathon.meetingSummerizer.meetingSummerizer.controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.flipr.hackathon.meetingSummerizer.meetingSummerizer.dto.ApiResponse;
import com.flipr.hackathon.meetingSummerizer.meetingSummerizer.dto.ApiRequest;
import com.flipr.hackathon.meetingSummerizer.meetingSummerizer.service.ApiService;
import com.flipr.hackathon.meetingSummerizer.meetingSummerizer.service.LLMService;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api")
public class ApiController {
    @Autowired
    private LLMService llmService;

    @PostMapping("/summarize")
    public ResponseEntity<String> summarize(@RequestBody String prompt) {
        String result = llmService.generateContent(prompt);
        System.out.println(result);
    return ResponseEntity.ok(result);
    }

}
