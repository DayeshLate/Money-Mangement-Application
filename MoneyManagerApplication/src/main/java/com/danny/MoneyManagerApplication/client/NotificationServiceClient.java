package com.danny.MoneyManagerApplication.client;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class NotificationServiceClient {

    @Value("${microservice.notification.url:http://localhost:5001}")
    private String notificationServiceUrl;

    @Value("${microservice.notification.api-key:money_manager_secret_key_2026}")
    private String serviceApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-Service-API-Key", serviceApiKey);
        return headers;
    }

    /**
     * Send Account Activation Email via Node.js Microservice
     */
    public boolean sendActivationEmail(String email, String fullName, String activationUrl) {
        String endpoint = notificationServiceUrl + "/api/v1/notify/activation";
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("email", email);
            payload.put("fullName", fullName);
            payload.put("activationUrl", activationUrl);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, createHeaders());
            ResponseEntity<String> response = restTemplate.postForEntity(endpoint, request, String.class);

            log.info("Activation email dispatched via Node.js microservice. Status: {}", response.getStatusCode());
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            log.error("Failed to dispatch activation email to Node.js microservice at {}: {}", endpoint, e.getMessage());
            return false;
        }
    }

    /**
     * Send Daily Reminder Email via Node.js Microservice
     */
    public boolean sendReminderEmail(String email, String fullName, String appUrl) {
        String endpoint = notificationServiceUrl + "/api/v1/notify/reminder";
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("email", email);
            payload.put("fullName", fullName);
            payload.put("appUrl", appUrl);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, createHeaders());
            ResponseEntity<String> response = restTemplate.postForEntity(endpoint, request, String.class);

            log.info("Reminder email dispatched to {}. Status: {}", email, response.getStatusCode());
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            log.error("Failed to dispatch reminder email to {}: {}", email, e.getMessage());
            return false;
        }
    }

    /**
     * Send Daily Expense Summary Email via Node.js Microservice
     */
    public boolean sendDailyExpenseSummary(String email, String fullName, String date, List<?> expenses, Double totalExpense) {
        String endpoint = notificationServiceUrl + "/api/v1/notify/summary";
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("email", email);
            payload.put("fullName", fullName);
            payload.put("date", date);
            payload.put("expenses", expenses);
            payload.put("totalExpense", totalExpense);
            payload.put("currency", "₹");

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, createHeaders());
            ResponseEntity<String> response = restTemplate.postForEntity(endpoint, request, String.class);

            log.info("Daily summary email dispatched to {}. Status: {}", email, response.getStatusCode());
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            log.error("Failed to dispatch daily summary email to {}: {}", email, e.getMessage());
            return false;
        }
    }

    /**
     * Generate Excel Report via Node.js Microservice
     */
    public byte[] generateExcelReport(Map<String, Object> payload) {
        String endpoint = notificationServiceUrl + "/api/v1/reports/export/excel";
        try {
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, createHeaders());
            ResponseEntity<byte[]> response = restTemplate.postForEntity(endpoint, request, byte[].class);
            return response.getBody();
        } catch (Exception e) {
            log.error("Failed to generate Excel report via Node.js microservice: {}", e.getMessage());
            throw new RuntimeException("Excel report generation failed: " + e.getMessage());
        }
    }

    /**
     * Generate PDF Report via Node.js Microservice
     */
    public byte[] generatePdfReport(Map<String, Object> payload) {
        String endpoint = notificationServiceUrl + "/api/v1/reports/export/pdf";
        try {
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, createHeaders());
            ResponseEntity<byte[]> response = restTemplate.postForEntity(endpoint, request, byte[].class);
            return response.getBody();
        } catch (Exception e) {
            log.error("Failed to generate PDF report via Node.js microservice: {}", e.getMessage());
            throw new RuntimeException("PDF report generation failed: " + e.getMessage());
        }
    }
}
