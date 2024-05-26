package com.ismb.meetingscheduler.email;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class EmailConfiguration {

    @Value("${spring.mail.host}")
    private String mailHost;

    @Value("${spring.mail.port}")
    private int mailPort;

    @Value("${spring.mail.username}")
    private String mailUsername;

    @Value("${spring.mail.password}")
    private String mailPassword;

    @Value("${spring.mail.properties.mail.smtp.auth}")
    private String mailSmtpAuth;

    @Value("${spring.mail.properties.mail.smtp.starttls.enable}")
    private String mailSmtpStarttlsEnable;

    @Value("${spring.mail.properties.mail.smtp.starttls.required}")
    private String mailSmtpStarttlsRequired;

    @Value("${spring.mail.properties.mail.smtp.ssl.trust}")
    private String mailSmtpSslTrust;

    @Bean
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(mailHost);
        mailSender.setPort(mailPort);
        mailSender.setUsername(mailUsername);
        mailSender.setPassword(mailPassword);

        Properties properties = mailSender.getJavaMailProperties();
        properties.put("mail.smtp.auth", mailSmtpAuth);
        properties.put("mail.smtp.starttls.enable", mailSmtpStarttlsEnable);
        properties.put("mail.smtp.starttls.required", mailSmtpStarttlsRequired);
        properties.put("mail.smtp.ssl.trust", mailSmtpSslTrust);

        return mailSender;
    }
}
