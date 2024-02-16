package com.mwozniak.capser_v2.service.game;

import com.mwozniak.capser_v2.enums.AcceptanceRequestType;
import com.mwozniak.capser_v2.enums.NotificationType;
import com.mwozniak.capser_v2.models.database.AcceptanceRequest;
import com.mwozniak.capser_v2.models.database.Notification;
import com.mwozniak.capser_v2.models.database.TeamWithStats;
import com.mwozniak.capser_v2.models.database.User;
import com.mwozniak.capser_v2.models.database.game.team.AbstractTeamGame;
import com.mwozniak.capser_v2.models.exception.CapserException;
import com.mwozniak.capser_v2.models.exception.TeamNotFoundException;
import com.mwozniak.capser_v2.models.exception.UserNotFoundException;
import com.mwozniak.capser_v2.repository.AcceptanceRequestRepository;
import com.mwozniak.capser_v2.security.utils.SecurityUtils;
import com.mwozniak.capser_v2.service.*;
import com.mwozniak.capser_v2.utils.EloRating;
import com.mwozniak.capser_v2.utils.EmailLoader;
import lombok.extern.log4j.Log4j2;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Log4j2
public abstract class AbstractTeamGameService<T extends AbstractTeamGame> extends AbstractGameService<T> {

    private final TeamService teamService;
    private final EmailService emailService;

    protected AbstractTeamGameService(AchievementService achievementService, AcceptanceRequestRepository acceptanceRequestRepository, EmailService emailService, UserService userService, NotificationService notificationService, TeamService teamService) {
        super(acceptanceRequestRepository, userService, achievementService, emailService, notificationService);
        this.teamService = teamService;
        this.emailService = emailService;
    }

    @Transactional
    @Override
    public void queueGame(T game) throws CapserException {
        teamService.findTeam(game.getTeam1DatabaseId());
        teamService.findTeam(game.getTeam2DatabaseId());
        T saved = saveGame(game);
        addAcceptanceAndNotify(saved);
    }

    @Override
    protected void addAcceptanceAndNotify(AbstractTeamGame game) throws UserNotFoundException, TeamNotFoundException {
        if (game.isDraw()) {
            String team1Name = teamService.getTeam(game.getTeam1DatabaseId()).getName();
            String team2Name = teamService.getTeam(game.getTeam2DatabaseId()).getName();
                for (UUID id : game.getTeam1().getPlayerList()) {
                    AcceptanceRequest posterAcceptanceRequest = AcceptanceRequest.createAcceptanceRequest(
                            game.getTeam1().getPlayerList().contains(SecurityUtils.getUserId()) ? AcceptanceRequestType.PASSIVE : getAcceptanceRequestType(),
                            id, game.getId(), game.getGameType());
                    acceptanceRequestRepository.save(posterAcceptanceRequest);
                    notificationService.notifyMultiple(posterAcceptanceRequest, team2Name);

                }
                for (UUID id : game.getTeam2().getPlayerList()) {
                    User user = userService.getUser(id);
                    AcceptanceRequest receiverAcceptanceRequest = AcceptanceRequest.createAcceptanceRequest(
                            game.getTeam2().getPlayerList().contains(SecurityUtils.getUserId()) ? AcceptanceRequestType.PASSIVE : getAcceptanceRequestType(),
                            id, game.getId(), game.getGameType(),
                            game.getTeam1().getPlayerList().contains(SecurityUtils.getUserId()) ? game.getTeam2().getId() : game.getTeam1().getId());
                    acceptanceRequestRepository.save(receiverAcceptanceRequest);
                    notificationService.notifyMultiple(receiverAcceptanceRequest, team1Name);
                    emailService.sendHtmlMessage(user.getEmail(), "New Doubles Game in GCL!", EmailLoader.loadGameAcceptanceEmail().replace("${player}", user.getUsername()).replace("${opponent}", "team " + team1Name));

                }

        } else {
            String winnerName = teamService.getTeam(game.getWinnerTeamId()).getName();
            String loserName = teamService.getTeam(game.getLoserTeamId()).getName();
            if (game.getWinningTeam().getPlayerList().contains(SecurityUtils.getUserId())) {
                for (UUID id : game.getWinningTeam().getPlayerList()) {
                    AcceptanceRequest posterAcceptanceRequest = AcceptanceRequest.createAcceptanceRequest(
                            AcceptanceRequestType.PASSIVE,
                            id, game.getId(), game.getGameType());
                    acceptanceRequestRepository.save(posterAcceptanceRequest);
                    notificationService.notifyMultiple(posterAcceptanceRequest, loserName);

                }
                for (UUID id : game.getLoser().getPlayerList()) {
                    User user = userService.getUser(id);
                    AcceptanceRequest receiverAcceptanceRequest = AcceptanceRequest.createAcceptanceRequest(
                            getAcceptanceRequestType(),
                            id, game.getId(), game.getGameType(), game.getLoserTeamId());
                    acceptanceRequestRepository.save(receiverAcceptanceRequest);
                    notificationService.notifyMultiple(receiverAcceptanceRequest, winnerName);
                    emailService.sendHtmlMessage(user.getEmail(), "New Doubles Game in GCL!", EmailLoader.loadGameAcceptanceEmail().replace("${player}", user.getUsername()).replace("${opponent}", "team " + winnerName));

                }
            } else {
                for (UUID id : game.getWinningTeam().getPlayerList()) {
                    User user = userService.getUser(id);
                    AcceptanceRequest receiverAcceptanceRequest = AcceptanceRequest.createAcceptanceRequest(
                            getAcceptanceRequestType(),
                            id, game.getId(), game.getGameType(), game.getWinnerTeamId());
                    acceptanceRequestRepository.save(receiverAcceptanceRequest);
                    notificationService.notifyMultiple(receiverAcceptanceRequest, loserName);
                    emailService.sendHtmlMessage(user.getEmail(), "New Doubles Game in GCL!", EmailLoader.loadGameAcceptanceEmail().replace("${player}", user.getUsername()).replace("${opponent}", "team " + loserName));


                }
                for (UUID id : game.getLoser().getPlayerList()) {
                    AcceptanceRequest posterAcceptanceRequest = AcceptanceRequest.createAcceptanceRequest(
                            AcceptanceRequestType.PASSIVE,
                            id, game.getId(), game.getGameType());
                    acceptanceRequestRepository.save(posterAcceptanceRequest);
                    notificationService.notifyMultiple(posterAcceptanceRequest, winnerName);
                }
            }
        }

    }

    @Override
    public void updateEloAndStats(AbstractTeamGame game) throws CapserException {

        TeamWithStats team1 = teamService.findTeam(game.getTeam1DatabaseId());
        TeamWithStats team2 = teamService.findTeam(game.getTeam2DatabaseId());

        EloRating.EloResult eloResult = EloRating.calculate(team1.getDoublesStats().getPoints(), team2.getDoublesStats().getPoints(), 30,
                game.isDraw() ? 0 : (game.getWinnerId().equals(team1.getId()) ? -1 : 1));

        for (UUID id : team1.getPlayerList()) {
            User user = userService.getUser(id);
            game.calculatePlayerStats(user);
            game.updateUserPoints(user, eloResult.getResult1());

            userService.saveUser(user);

        }

        for (UUID id : team2.getPlayerList()) {
            User user = userService.getUser(id);
            game.calculatePlayerStats(user);
            game.updateUserPoints(user, eloResult.getResult2());

            userService.saveUser(user);

        }

        game.calculateTeamStats(team1.getDoublesStats(),
                game.getTeam1Stats(), game.getTeam2Stats(), eloResult.getResult1(), game.isDraw());
        game.calculateTeamStats(team2.getDoublesStats(),
                game.getTeam2Stats(), game.getTeam1Stats(), eloResult.getResult2(), game.isDraw());

    }

    @Transactional
    @Override
    public void acceptGame(UUID gameId) throws CapserException {
        List<AcceptanceRequest> acceptanceRequestList = acceptanceRequestRepository.findAcceptanceRequestByGameToAccept(gameId);
        AcceptanceRequest request = extractAcceptanceRequest(gameId);
        T game = findGame(request.getGameToAccept());
        game.setAccepted();
        updateEloAndStats(game);
        acceptanceRequestRepository.deleteAll(acceptanceRequestList);
        saveGame(game);
        acceptanceRequestList.stream().filter(acceptanceRequest -> acceptanceRequest.getAcceptanceRequestType().equals(AcceptanceRequestType.PASSIVE)).forEach(acceptanceRequest -> {
            try {
                notificationService.notify(Notification.builder()
                        .date(new Date())
                        .notificationType(NotificationType.GAME_ACCEPTED)
                        .text("Game with team " + teamService.findTeam(request.getAcceptingTeam()).getName() + " was accepted.")
                        .seen(false)
                        .userId(acceptanceRequest.getAcceptingUser())
                        .build());
            } catch (CapserException e) {
                log.error("Failed to get team name.");
            }
        });
    }

    @Transactional
    @Override
    public void rejectGame(UUID gameId) throws CapserException {
        List<AcceptanceRequest> acceptanceRequestList = acceptanceRequestRepository.findAcceptanceRequestByGameToAccept(gameId);
        AcceptanceRequest request = extractAcceptanceRequest(gameId);
        T game = findGame(request.getGameToAccept());
        removeGame(game);
        acceptanceRequestList.stream().filter(acceptanceRequest -> acceptanceRequest.getAcceptanceRequestType().equals(AcceptanceRequestType.PASSIVE)).forEach(acceptanceRequest -> {
            try {
                notificationService.notify(Notification.builder()
                        .date(new Date())
                        .notificationType(NotificationType.GAME_REJECTED)
                        .text("Game with team " + teamService.findTeam(request.getAcceptingTeam()).getName() + " was rejected by on of the users.")
                        .seen(false)
                        .userId(acceptanceRequest.getAcceptingUser())
                        .build());
            } catch (CapserException e) {
                log.error("Failed to get team name.");
            }
        });
        acceptanceRequestRepository.deleteAll(acceptanceRequestList);

    }

    @Override
    public AcceptanceRequestType getAcceptanceRequestType() {
        return AcceptanceRequestType.MULTIPlE;
    }


}
