package com.danny.MoneyManagerApplication.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.danny.MoneyManagerApplication.DTO.ExpenseDTO;
import com.danny.MoneyManagerApplication.client.NotificationServiceClient;
import com.danny.MoneyManagerApplication.entity.ProfileEntity;
import com.danny.MoneyManagerApplication.repository.ProfileRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    
    private final ProfileRepository profileRepository;
    private final ExpenseService expenseService;
    private final NotificationServiceClient notificationServiceClient;

    @Value("${money.manger.fronted.url:https://money-mangement-application.vercel.app}")
    private String frontUrl;

    @Scheduled(cron = "0 0 22 * * *", zone = "Asia/Kolkata")
    public void sendDailyIncomeExpenseReminder() {
        log.info("Job started : sendDailyIncomeExpenseReminder() via Node.js microservice");
        List<ProfileEntity> profiles = profileRepository.findAll();
        for (ProfileEntity profile : profiles) {
            if (profile.getEmail() != null) {
                notificationServiceClient.sendReminderEmail(
                    profile.getEmail(),
                    profile.getFullName(),
                    frontUrl
                );
            }
        }
        log.info("Job completed : sendDailyIncomeExpenseReminder()");
    }

    @Scheduled(cron = "0 0 23 * * *", zone = "Asia/Kolkata")
    public void sendDailyExpenseSummary() {
        log.info("Job started : sendDailyExpenseSummary() via Node.js microservice");
        List<ProfileEntity> profiles = profileRepository.findAll();
        for (ProfileEntity profile : profiles) {
            if (profile.getEmail() != null) {
                List<ExpenseDTO> todaysExpenses = expenseService.getExpensesForUserOnDate(profile.getId(), LocalDate.now());
                if (!todaysExpenses.isEmpty()) {
                    double total = todaysExpenses.stream()
                            .mapToDouble(e -> e.getAmount() != null ? e.getAmount().doubleValue() : 0.0)
                            .sum();

                    notificationServiceClient.sendDailyExpenseSummary(
                        profile.getEmail(),
                        profile.getFullName(),
                        LocalDate.now().toString(),
                        todaysExpenses,
                        total
                    );
                }
            }
        }
        log.info("Job completed : sendDailyExpenseSummary()");
    }
}
