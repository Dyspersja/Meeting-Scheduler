package com.ismb.meetingscheduler.Controllers;


import com.ismb.meetingscheduler.Exception.TokenRefreshException;
import com.ismb.meetingscheduler.Security.jwt.JwtUtils;
import com.ismb.meetingscheduler.Security.services.RefreshTokenService;
import com.ismb.meetingscheduler.Security.services.UserDetailsImpl;
import com.ismb.meetingscheduler.models.ERole;
import com.ismb.meetingscheduler.models.RefreshToken;
import com.ismb.meetingscheduler.models.Role;
import com.ismb.meetingscheduler.models.User;
import com.ismb.meetingscheduler.payload.Requests.LoginRequest;
import com.ismb.meetingscheduler.payload.Requests.SignupRequest;
import com.ismb.meetingscheduler.payload.Requests.TokenRefreshRequest;
import com.ismb.meetingscheduler.payload.Responses.JwtResponse;
import com.ismb.meetingscheduler.payload.Responses.MessageResponse;
import com.ismb.meetingscheduler.payload.Responses.TokenRefreshResponse;
import com.ismb.meetingscheduler.repository.RefreshTokenRepository;
import com.ismb.meetingscheduler.repository.RoleRepository;
import com.ismb.meetingscheduler.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
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
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    RefreshTokenService refreshTokenService;
    @Autowired
    RefreshTokenRepository refreshTokenRepository;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        if (!userRepository.existsByEmail(loginRequest.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Błędne dane logowania");
        } else {

            if (refreshTokenRepository.findByUser(userRepository.findByEmail(loginRequest.getEmail()).get()).isPresent()) {
                refreshTokenService.deleteByUserId(userRepository.findByEmail(loginRequest.getEmail()).get().getId());
            }
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            String jwt = jwtUtils.generateJwtToken(userDetails.getEmail());

            List<String> roles = userDetails.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());

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
                .map(RefreshToken::getUser)
                .map(user->{
                    String token = jwtUtils.generateJwtToken(user.getEmail());
                    return ResponseEntity.ok(new TokenRefreshResponse(token,requestRefreshToken));
                })
                .orElseThrow(() -> new TokenRefreshException(requestRefreshToken,"Refresh token is not in database!!"));

    }


    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        User user = new User(signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        Set<Role> roles = new HashSet<>();
        roles.add(roleRepository.findByName(ERole.ROLE_USER));


        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}
