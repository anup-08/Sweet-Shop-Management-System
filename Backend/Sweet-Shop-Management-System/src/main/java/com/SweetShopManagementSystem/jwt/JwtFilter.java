package com.SweetShopManagementSystem.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@AllArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
    private final JwtUtility jwtUtility;
    private static final Logger logger = LoggerFactory.getLogger(JwtFilter.class);

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return "OPTIONS".equalsIgnoreCase(request.getMethod());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String uri = request.getRequestURI();
        // Log minimal auth header info for debugging (do NOT log full tokens in production)
        String authorizationHeaderTmp = request.getHeader("Authorization");
        if (authorizationHeaderTmp == null) {
            logger.debug("No Authorization header for request {}", uri);
        } else {
            logger.debug("Authorization header length {} for request {}", authorizationHeaderTmp.length(), uri);
        }
        if (uri.startsWith("/api/users/register") || uri.startsWith("/api/sweets/search") || uri.startsWith("/api/users/getToken")){
            filterChain.doFilter(request, response);
            return;
        }

        String userName = null;
        String token = null;

        String authorizationHeader = request.getHeader("Authorization");

        if(authorizationHeader != null && authorizationHeader.startsWith("Bearer ")){
            token = authorizationHeader.substring(7);
            try {
                userName = jwtUtility.extractUserName(token);
            } catch (Exception e) {
                logger.warn("Failed to extract username from token for request {}: {}", uri, e.getMessage());
                // proceed without setting authentication
            }
        }

        if(userName != null && SecurityContextHolder.getContext().getAuthentication() == null){
            try {
                if(jwtUtility.validateToken(token, userName)){

                    List<String> roles = jwtUtility.extractRoles(token);
                    List<SimpleGrantedAuthority> gAuth = roles.stream().map((role)-> new SimpleGrantedAuthority("ROLE_"+role)).toList();

                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userName, null , gAuth);
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            } catch (Exception e) {
                logger.warn("Token validation failed for request {}: {}", uri, e.getMessage());
            }
        }
        filterChain.doFilter(request,response);
    }
}
