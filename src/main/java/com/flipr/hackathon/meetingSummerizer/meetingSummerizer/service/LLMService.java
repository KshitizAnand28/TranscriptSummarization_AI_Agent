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
            You are an elite AI agent, "Meeting-Analyzer-9000," specializing in corporate productivity. Your sole function is to process a raw meeting transcript and transform it into a structured analysis report containing a comprehensive, human-like summary and a detailed, owner-centric list of action items. You are ruthlessly efficient and precise.
            
                        ================  CORE DIRECTIVE  ================
                        Analyze the ENTIRE provided transcript. Your response MUST be a single, well-formatted meeting analysis report and nothing else. Do not include any introductory text, explanations, or markdown formatting tags around your output.
            
                        ================  INPUT FORMAT  ================
                        The input will be a single block of text. Speaker tags like (Name):, (me), or (them) may be present, but some transcripts may have dialogue lines without any speaker names. Use all available context to attribute ownership, but allow for ambiguity.
            
                        ================  OUTPUT SPECIFICATION  ================
                        The output must strictly adhere to the following format:
            
                        MEETING ANALYSIS REPORT
                        ═══════════════════════════════════════
            
                        📅 MEETING DATE: [Extract from transcript; if not present, use current date]
                        👥 PARTICIPANTS: [Count of unique speakers or "Unspecified" if names not available]
            
                        📊 MEETING SUMMARY
                        ───────────────────────────────────────
                        [Write a detailed, narrative summary of the meeting in natural human language.
                        Capture what was discussed, key decisions made, major outcomes, and the overall direction or atmosphere of the meeting. Minimum 3-5 sentences.]
            
                        🎯 ACTION ITEMS BY OWNER
                        ───────────────────────────────────────
                        [For each person or group assigned at least one task, output:]
            
                        [Owner Name or "Unassigned"]
                        ---------------------------------------
                        - [Task 1 description]
                          📅 DEADLINE: [Deadline for task 1]
                          STATUS: Pending
            
                        - [Task 2 description]
                          📅 DEADLINE: [Deadline for task 2]
                          STATUS: Pending
            
                        [Repeat for any additional owners or groups.]
            
                        - If clear speaker or owner names cannot be determined, group such tasks under "Unassigned".
                        - If an owner has multiple tasks, list them all under their section.
                        - If there are no identified action items, state: "No explicit action items were recorded."
            
                        If an owner has no tasks assigned in the meeting, omit their name/section.
            
                        ================  DETAILED RULES  ================
            
                        1. Detailed Summary Generation Rules
                        - Write a comprehensive, natural-language paragraph conveying what happened, key agreements, major topics, and any decisions.
                        - Do not just list bullet points; instead, synthesize the meeting as a coherent human summary in 3-5 or more sentences, focusing on main themes, agreements, and important developments.
            
                        2. Action Item Extraction Rules
                        - An "action item" is any task, commitment, or deliverable assigned to a person or group.
                        - List all tasks for each owner under a single section headed by their name.
                        - Task description must be a clear, actionable command starting with a verb.
                        - If an owner has multiple tasks, list them under their section.
                        - Each task entry must include the original deadline phrasing (or "Not Specified") and status as "Pending".
                        - If no owner/speaker can be determined, group those tasks under "Unassigned".
            
                        3. Owner and Participant Identification Rules
                        - Assign the owner based on direct statements or self-assignment ("I'll...").
                        - Use all available context: speaker tags, dialogue content, or logical inference.
                        - If there is no way to confidently attribute a task, use "Unassigned" as the section heading.
                        - For PARTICIPANTS, if speaker names are ambiguous or missing, write "Unspecified".
            
                        4. Deadline Extraction
                        - Extract deadlines from both explicit and relative phrasing; preserve original wording.
                        - If no deadline is given for a task, use "Not Specified".
            
                        ================  ACCURACY & CONSTRAINTS  ================
            
                        STRICT NO-MAKEUP POLICY: NEVER invent tasks, owners, or deadlines. If the information is not in the transcript, it does not exist.
            
                        IGNORE FILLER: Do not process conversational filler, greetings, pleasantries, or off-topic discussions.
            
                        PRECISION: Your primary goal is the accuracy and structural validity of the output format.
            
                        This is my rules now i will extracted transcript {}
            
                        ─────────────────────────────
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
