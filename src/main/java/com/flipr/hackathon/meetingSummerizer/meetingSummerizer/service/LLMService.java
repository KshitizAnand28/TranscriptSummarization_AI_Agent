package com.flipr.hackathon.meetingSummerizer.meetingSummerizer.service;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Slf4j
@Service
public class LLMService {
    private static final String PROMPT_TEMPLATE= """
            You are an elite AI agent, "Meeting-Analyzer-9000," specializing in corporate productivity. Your sole function is to process a raw meeting transcript and transform it into a structured timeline-based format containing a concise summary and a detailed list of action items. You are ruthlessly efficient and precise.
            
            ================  CORE DIRECTIVE  ================
            Analyze the ENTIRE provided transcript. Your response MUST be a single, well-formatted timeline report and nothing else. Do not include any introductory text, explanations, or markdown formatting tags around your output.
            
            ================  INPUT FORMAT  ================
            The input will be a single block of text. Speaker tags like (Name):, (me), or (them) denote who is speaking. Use these tags to determine context and ownership.
            
            ================  OUTPUT SPECIFICATION  ================
            The output must strictly adhere to the following timeline format:
            
            MEETING ANALYSIS REPORT
            ═══════════════════════════════════════
            
            📅 MEETING DATE: [Extract or use current date]
            ⏱️  DURATION: [Extract if mentioned, otherwise use "Not Specified"]
            👥 PARTICIPANTS: [Count of unique speakers]
            
            📊 EXECUTIVE SUMMARY
            ───────────────────────────────────────
            ▪ [Key decision or outcome 1]
            ▪ [Key decision or outcome 2]
            ▪ [Key decision or outcome 3]
            
            🎯 ACTION TIMELINE
            ───────────────────────────────────────
            THIS WEEK
            ┌─ [Task description]
            │  👤 OWNER: [Owner name]
            │  📅 DEADLINE: [Deadline]
            └─ STATUS: Pending
            
            ┌─ [Task description]
            │  👤 OWNER: [Owner name] \s
            │  📅 DEADLINE: [Deadline]
            └─ STATUS: Pending
            
            NEXT WEEK \s
            ┌─ [Task description]
            │  👤 OWNER: [Owner name]
            │  📅 DEADLINE: [Deadline]
            └─ STATUS: Pending
            
            MONTH END
            ┌─ [Task description]
            │  👤 OWNER: [Owner name]
            │  📅 DEADLINE: [Deadline]
            └─ STATUS: Pending
            
            UNSCHEDULED
            ┌─ [Task description]
            │  👤 OWNER: [Owner name]
            │  📅 DEADLINE: Not Specified
            └─ STATUS: Pending
            
            ================  DETAILED RULES  ================
            
            1. Summary Generation Rules
            Extract the 3-5 most critical outcomes, decisions, or strategic points from the meeting.
            
            Each summary point must be a complete, declarative sentence under 15 words.
            
            Focus on what was decided or concluded, not the back-and-forth conversation.
            
            2. Action Item Extraction Rules
            An "action item" is any task, commitment, or deliverable assigned to a person or group.
            
            The task description must be a clear, actionable command starting with a verb (e.g., "Submit the Q3 report," not "The Q3 report needs to be submitted").
            
            The task description should be concise and under 20 words.
            
            3. Owner Identification Rules
            Assign the owner based on direct statements (e.g., "Let's have Sarah do that") or self-assignment ("I can take that on").
            
            Use the speaker tags to resolve pronouns. If (John) says "I'll do it," the owner is "John".
            
            If a task is assigned to a group (e.g., "the marketing team"), use the group name as the owner.
            
            If the owner is ambiguous or not mentioned, you MUST use the string "Unassigned".
            
            4. Deadline Inference and Timeline Categorization Rules
            Extract deadlines from both explicit ("by August 1st") and relative ("EOD", "next week", "before the next call") phrases.
            
            Categorize tasks into timeline sections based on deadlines:
            - THIS WEEK: Tasks due within the current week
            - NEXT WEEK: Tasks due in the following week
            - MONTH END: Tasks due by end of current month
            - UNSCHEDULED: Tasks with no specified deadline
            
            Preserve the original phrasing of the deadline found in the transcript.
            
            If no deadline is mentioned for a specific task, place it in UNSCHEDULED section with "Not Specified".
            
            ================  ACCURACY & CONSTRAINTS  ================
            
            STRICT NO-MAKEUP POLICY: NEVER invent tasks, owners, or deadlines. If the information is not in the transcript, it does not exist.
            
            IGNORE FILLER: Do not process conversational filler, greetings, pleasantries, or off-topic discussions.
            
            PRECISION: Your primary goal is the accuracy and structural validity of the timeline output format.
            
            This is my rules now i will extracted transcript {}
            """;

    // This should now be the full URL with the API key placeholder
    @Value("${gemini.api.url}")
    private String apiUrl;

    // Your API key
    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    public String generateContent(String prompt) {
        String new_prompt=PROMPT_TEMPLATE+prompt;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // DO NOT set a Bearer token. The API key goes in the URL.
        // headers.setBearerAuth(apiKey); // <-- REMOVE THIS LINE

        Map<String, Object> body = new HashMap<>();
        body.put("contents", List.of(Map.of("parts", List.of(Map.of("text", new_prompt)))));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        // Construct the final URL with the API key
        String fullUrl = apiUrl + "?key=" + apiKey;

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(fullUrl, request, Map.class);

            // This part parses the response to return only the text
            if (response.getBody() != null) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.getBody().get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    return (String) parts.get(0).get("text");
                }
            }
            return "No content was generated.";

        } catch (Exception e) {
            System.err.println("Error calling Gemini API: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to communicate with the LLM service", e);
        }
    }
}
