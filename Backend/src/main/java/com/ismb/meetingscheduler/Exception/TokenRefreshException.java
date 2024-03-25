package com.ismb.meetingscheduler.Exception;

public class TokenRefreshException extends RuntimeException{

    public TokenRefreshException(String token, String message){
        super("Failed for " + token + " " + message);
    }
}
