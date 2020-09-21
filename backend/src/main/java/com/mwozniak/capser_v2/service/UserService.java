package com.mwozniak.capser_v2.service;

import com.mwozniak.capser_v2.enums.GameType;
import com.mwozniak.capser_v2.models.database.User;
import com.mwozniak.capser_v2.models.database.game.single.SinglesGame;
import com.mwozniak.capser_v2.models.dto.CreateUserDto;
import com.mwozniak.capser_v2.models.exception.UserNotFoundException;
import com.mwozniak.capser_v2.models.responses.UserMinimized;
import com.mwozniak.capser_v2.repository.SinglesRepository;
import com.mwozniak.capser_v2.repository.UsersRepository;
import com.mwozniak.capser_v2.security.utils.SecurityUtils;
import lombok.extern.log4j.Log4j;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

@Service
@Log4j
public class UserService {

    private final UsersRepository usersRepository;
    private final SinglesRepository singlesRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UsersRepository usersRepository, SinglesRepository singlesRepository, PasswordEncoder passwordEncoder) {
        this.usersRepository = usersRepository;
        this.singlesRepository = singlesRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User getUser(UUID id) throws UserNotFoundException {
        Optional<User> userOptional = usersRepository.findUserById(id);
        if (userOptional.isPresent()) {
            return userOptional.get();
        } else {
            throw new UserNotFoundException("User not found");
        }
    }

    public Optional<User> getUserOptional(UUID id) {
        return usersRepository.findUserById(id);
    }


    public Optional<User> getUser(String username) {
        return usersRepository.findUserByUsername(username);
    }

    public void saveUser(User user) {
        usersRepository.save(user);
    }

    public void updateLastSeen(User user) {
        user.setLastSeen(new Date());
        usersRepository.save(user);
    }

    public User createUser(CreateUserDto createUserDto) {
        User user = User.createUserFromDto(createUserDto, passwordEncoder.encode(createUserDto.getPassword()));
        usersRepository.save(user);
        log.info("User creation successful");
        return user;
    }

    public Page<User> getUsers(Pageable pageable) {
        return usersRepository.findAll(pageable);
    }

    public Page<UserMinimized> searchUsers(Pageable pageable, String username) {
        Page<User> userPage = usersRepository.findByUsernameContainingIgnoreCase(username, pageable);
        try {
            AtomicBoolean atomicBoolean = new AtomicBoolean(false);
            UUID userId = SecurityUtils.getUserId();
            List<UserMinimized> userMinimizedList = userPage.getContent().stream().filter(user -> {
                if (user.getId().equals(userId)) {
                    atomicBoolean.set(true);
                    return false;
                } else {
                    return true;
                }
            }).map(user -> {
                UserMinimized userMinimized = new UserMinimized();
                BeanUtils.copyProperties(user, userMinimized);
                return userMinimized;
            }).collect(Collectors.toList());
            return new PageImpl<>(userMinimizedList, pageable, userMinimizedList.size());

        } catch (IllegalArgumentException e) {
            return new PageImpl<>(userPage.getContent().stream().map(user -> {
                UserMinimized userMinimized = new UserMinimized();
                BeanUtils.copyProperties(user, userMinimized);
                return userMinimized;
            }).collect(Collectors.toList()), pageable, userPage.getTotalElements());
        }


    }

    private List<SinglesGame> findUserSinglesGames(UUID id) {
//        return singlesRepository.findSinglesGamesByPlayer1OrPlayer2(id,id);
        return null;
    }

}
