package com.ismb.meetingscheduler.controllers;

import com.ismb.meetingscheduler.exception.TokenRefreshException;
import com.ismb.meetingscheduler.security.jwt.JwtUtils;
import com.ismb.meetingscheduler.security.services.RefreshTokenService;
import com.ismb.meetingscheduler.security.services.AuthenticatedUser;
import com.ismb.meetingscheduler.models.AccountRole;
import com.ismb.meetingscheduler.models.RefreshToken;
import com.ismb.meetingscheduler.models.Role;
import com.ismb.meetingscheduler.models.Account;
import com.ismb.meetingscheduler.payload.requests.LoginRequest;
import com.ismb.meetingscheduler.payload.requests.SignupRequest;
import com.ismb.meetingscheduler.payload.requests.TokenRefreshRequest;
import com.ismb.meetingscheduler.payload.responses.JwtResponse;
import com.ismb.meetingscheduler.payload.responses.MessageResponse;
import com.ismb.meetingscheduler.payload.responses.TokenRefreshResponse;
import com.ismb.meetingscheduler.repository.RefreshTokenRepository;
import com.ismb.meetingscheduler.repository.RoleRepository;
import com.ismb.meetingscheduler.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.authentication.AuthenticationManager;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/auth")

@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AccountRepository accountRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder encoder;
    private final RefreshTokenService refreshTokenService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        if (!accountRepository.existsByEmail(loginRequest.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Błędne dane logowania");
        } else {

            if (refreshTokenRepository.findByAccount(accountRepository.findByEmail(loginRequest.getEmail()).get()).isPresent()) {
                refreshTokenService.deleteByUserId(accountRepository.findByEmail(loginRequest.getEmail()).get().getId());
            }
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            AuthenticatedUser userDetails = (AuthenticatedUser) authentication.getPrincipal();

            List<String> roles = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());
            String jwt = jwtUtils.generateJwtToken(userDetails.getEmail());

            RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());

            return ResponseEntity.ok(new JwtResponse(jwt, refreshToken.getToken(), userDetails.getId(),
                    userDetails.getEmail(), roles));
        }
    }

    @PostMapping("/refreshtoken")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody TokenRefreshRequest request){
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getAccount)
                .map(user->{
                    String token = jwtUtils.generateJwtToken(user.getEmail());
                    return ResponseEntity.ok(new TokenRefreshResponse(token,requestRefreshToken));
                })
                .orElseThrow(() -> new TokenRefreshException(requestRefreshToken,"Refresh token is not in database!!"));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (accountRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (accountRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        Set<Role> roles = new HashSet<>();
        roles.add(roleRepository.findByName(AccountRole.ROLE_USER));

        Account user = Account.builder()
                .email(signUpRequest.getEmail())
                .password(encoder.encode(signUpRequest.getPassword()))
                .roles(roles)
                .build();

        accountRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}
