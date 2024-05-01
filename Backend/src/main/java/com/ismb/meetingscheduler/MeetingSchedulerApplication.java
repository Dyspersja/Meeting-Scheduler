package com.ismb.meetingscheduler;

import com.ulisesbocchio.jasyptspringboot.annotation.EnableEncryptableProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableEncryptableProperties
public class MeetingSchedulerApplication {

	public static void main(String[] args) {
		SpringApplication.run(MeetingSchedulerApplication.class, args);
	}

}
