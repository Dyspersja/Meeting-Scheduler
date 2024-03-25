package com.ismb.meetingscheduler.payload.Responses;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String refreshToken;
    private Long id;
    private String email;
    private List<String> roles;
//
//    public JwtResponse(String accessToken, Long id, String username, String email, List<String> roles) {
//        this.token = accessToken;
//        this.id = id;
//        this.email = email;
//        this.roles = roles;
//    }

    public JwtResponse(String token, String refreshToken, Long id, String email, List<String> roles) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.id = id;
        this.email = email;
        this.roles = roles;
    }
}
