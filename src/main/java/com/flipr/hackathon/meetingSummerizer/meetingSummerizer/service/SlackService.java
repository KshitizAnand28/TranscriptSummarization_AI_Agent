package com.flipr.hackathon.meetingSummerizer.meetingSummerizer.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

@Service
public class SlackService {

    @Value("${slack.bot.token}")
    private String botToken;

    @Value("${slack.default.channel}")
    private String defaultChannel;

    @Value("${slack.api.url}")
    private String slackApiUrl;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public boolean postMessage(String message) {
        return postMessage(message, defaultChannel);
    }

    public boolean postMessage(String message, String channel) {
        try {
            URL url = new URL(slackApiUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            connection.setDoOutput(true);
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Authorization", "Bearer " + botToken);
            connection.setRequestProperty("Content-Type", "application/json; charset=UTF-8");

            // Create JSON payload using a Map
            Map<String, String> payload = new HashMap<>();
            payload.put("channel", channel);
            payload.put("text", message);

            String jsonPayload = objectMapper.writeValueAsString(payload);

            try (OutputStream outputStream = connection.getOutputStream()) {
                byte[] input = jsonPayload.getBytes("utf-8");
                outputStream.write(input, 0, input.length);
            }

            int responseCode = connection.getResponseCode();
            System.out.println("Slack API Response Code: " + responseCode);

            // Read the response
            String responseBody = readResponse(connection);
            System.out.println("Slack API Response: " + responseBody);

            return responseCode == 200;

        } catch (Exception e) {
            System.err.println("Error posting to Slack: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    private String readResponse(HttpURLConnection connection) throws IOException {
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(
                        connection.getResponseCode() == 200
                                ? connection.getInputStream()
                                : connection.getErrorStream()))) {

            StringBuilder response = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            return response.toString();
        }
    }

    // Method to post formatted summary
    public boolean postSummaryToSlack(String summaryText, String source) {
        String formattedMessage = String.format(
                "📋 *Meeting Summary*\n" +
                        "Source: %s\n" +
                        "Generated: %s\n\n" +
                        "``````",
                source,
                java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")),
                summaryText
        );

        return postMessage(formattedMessage);
    }
}
