package com.mwozniak.capser_v2.security;

import com.mwozniak.capser_v2.configuration.JwtConfiguration;
import com.mwozniak.capser_v2.security.filters.JwtAuthorizationFilter;
import com.mwozniak.capser_v2.security.filters.JwtRefreshFilter;
import com.mwozniak.capser_v2.security.filters.UsernamePasswordFilter;
import com.mwozniak.capser_v2.security.providers.JwtAuthenticationProvider;
import com.mwozniak.capser_v2.security.providers.JwtRefreshProvider;
import com.mwozniak.capser_v2.security.providers.UsernamePasswordProvider;
import com.mwozniak.capser_v2.service.UserService;
import lombok.Builder;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, proxyTargetClass = true)
@EnableConfigurationProperties(JwtConfiguration.class)
@Configuration
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {



    private final UserService userService;
    private final JwtConfiguration jwtConfiguration;
    private final PasswordEncoder passwordEncoder;

    public SecurityConfiguration(UserService userService, JwtConfiguration jwtConfiguration, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.jwtConfiguration = jwtConfiguration;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    protected void configure(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.csrf().disable().cors().configurationSource(corsConfiguration()).and()
                .authorizeRequests()
                .mvcMatchers("/login").permitAll()
                .mvcMatchers("/refresh").permitAll()
                .mvcMatchers("/users").permitAll()
                .mvcMatchers(HttpMethod.GET,"/singles").permitAll()
                .mvcMatchers(HttpMethod.GET,"/easy").permitAll()
                .mvcMatchers(HttpMethod.GET,"/unranked").permitAll()
                .mvcMatchers(HttpMethod.GET,"/doubles").permitAll()
                .mvcMatchers(HttpMethod.GET,"/teams").permitAll()
                .mvcMatchers(HttpMethod.GET,"/users").permitAll()
                .mvcMatchers(HttpMethod.GET,"/dashboard/*").permitAll()
                .mvcMatchers(HttpMethod.GET,"/users/*").permitAll()
                .mvcMatchers(HttpMethod.GET,"/users/search").permitAll()
                .anyRequest().authenticated()
                .and()
                .addFilter(UsernamePasswordFilter.getUsernamePasswordFilter(authenticationManager(), "/login"))
                .addFilter(JwtRefreshFilter.getJwtRefreshFilter(authenticationManager(), "/refresh"))
                .addFilterBefore(new JwtAuthorizationFilter(authenticationManager()),SecurityContextHolderAwareRequestFilter.class)
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
    }

    @Override
    @Bean
    public AuthenticationManager authenticationManagerBean()  {
        List<AuthenticationProvider> authenticationProviderList = Arrays.asList(
                new UsernamePasswordProvider(userService, passwordEncoder, jwtConfiguration),
                new JwtAuthenticationProvider(jwtConfiguration),
                new JwtRefreshProvider(jwtConfiguration,userService)
        );

        ProviderManager providerManager = new ProviderManager(authenticationProviderList);
        providerManager.setEraseCredentialsAfterAuthentication(false);
        return providerManager;
    }

    private UrlBasedCorsConfigurationSource corsConfiguration() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("*");
        config.addAllowedHeader("*");
        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("DELETE");
        config.addAllowedMethod("OPTIONS");
        config.addAllowedMethod("PATCH");
        source.registerCorsConfiguration("/**", config);
        return source;
    }



}
