package com.danny.MoneyManagerApplication.controller;

import com.danny.MoneyManagerApplication.DTO.ExpenseDTO;
import com.danny.MoneyManagerApplication.DTO.IncomeDTO;
import com.danny.MoneyManagerApplication.client.NotificationServiceClient;
import com.danny.MoneyManagerApplication.entity.ProfileEntity;
import com.danny.MoneyManagerApplication.service.ExpenseService;
import com.danny.MoneyManagerApplication.service.IncomeService;
import com.danny.MoneyManagerApplication.service.ProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/report")
@RequiredArgsConstructor
@Slf4j
public class ReportController {

    private final ExpenseService expenseService;
    private final IncomeService incomeService;
    private final ProfileService profileService;
    private final NotificationServiceClient notificationServiceClient;

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportReport(
            @RequestParam(defaultValue = "all") String type,
            @RequestParam(defaultValue = "excel") String format,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String keyword
    ) {
        ProfileEntity profile = profileService.getCurrentProfile();

        LocalDate start = startDate != null ? LocalDate.parse(startDate) : LocalDate.now().withDayOfMonth(1);
        LocalDate end = endDate != null ? LocalDate.parse(endDate) : LocalDate.now();
        String search = keyword != null ? keyword : "";
        Sort sort = Sort.by(Sort.Direction.DESC, "date");

        List<Map<String, Object>> transactions = new ArrayList<>();

        if ("all".equalsIgnoreCase(type) || "expense".equalsIgnoreCase(type)) {
            List<ExpenseDTO> expenses = expenseService.filterExpense(start, end, search, sort);
            for (ExpenseDTO e : expenses) {
                Map<String, Object> map = new HashMap<>();
                map.put("id", e.getId());
                map.put("name", e.getName());
                map.put("amount", e.getAmount());
                map.put("categoryName", e.getCategoryName());
                map.put("date", e.getDate() != null ? e.getDate().toString() : "");
                map.put("type", "expense");
                transactions.add(map);
            }
        }

        if ("all".equalsIgnoreCase(type) || "income".equalsIgnoreCase(type)) {
            List<IncomeDTO> incomes = incomeService.filterIncome(start, end, search, sort);
            for (IncomeDTO i : incomes) {
                Map<String, Object> map = new HashMap<>();
                map.put("id", i.getId());
                map.put("name", i.getName());
                map.put("amount", i.getAmount());
                map.put("categoryName", i.getCategoryName());
                map.put("date", i.getDate() != null ? i.getDate().toString() : "");
                map.put("type", "income");
                transactions.add(map);
            }
        }

        // Summary calculations
        double totalExpense = transactions.stream()
                .filter(t -> "expense".equalsIgnoreCase((String) t.get("type")))
                .mapToDouble(t -> Double.parseDouble(String.valueOf(t.get("amount"))))
                .sum();

        double totalIncome = transactions.stream()
                .filter(t -> "income".equalsIgnoreCase((String) t.get("type")))
                .mapToDouble(t -> Double.parseDouble(String.valueOf(t.get("amount"))))
                .sum();

        Map<String, Object> payload = new HashMap<>();
        payload.put("title", "Money Manager Statement (" + start + " to " + end + ")");
        payload.put("transactions", transactions);

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalIncome", totalIncome);
        summary.put("totalExpense", totalExpense);
        payload.put("summary", summary);

        Map<String, Object> user = new HashMap<>();
        user.put("fullName", profile.getFullName());
        user.put("email", profile.getEmail());
        payload.put("user", user);

        byte[] reportBytes;
        HttpHeaders headers = new HttpHeaders();

        if ("pdf".equalsIgnoreCase(format)) {
            reportBytes = notificationServiceClient.generatePdfReport(payload);
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "statement_" + start + "_to_" + end + ".pdf");
        } else {
            reportBytes = notificationServiceClient.generateExcelReport(payload);
            headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.setContentDispositionFormData("attachment", "statement_" + start + "_to_" + end + ".xlsx");
        }

        return ResponseEntity.ok()
                .headers(headers)
                .body(reportBytes);
    }
}
