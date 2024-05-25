package com.ismb.meetingscheduler.payload.responses;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TokenRefreshResponse {

    String accessToken;
    String refreshToken;
    String tokenType = "Bearer";

    public TokenRefreshResponse(String accessToken, String refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}
