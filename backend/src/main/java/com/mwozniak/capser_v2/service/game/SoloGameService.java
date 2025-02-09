package com.mwozniak.capser_v2.service.game;

import com.mwozniak.capser_v2.models.database.User;
import com.mwozniak.capser_v2.models.database.game.single.AbstractSoloGame;
import com.mwozniak.capser_v2.models.exception.CapserException;
import com.mwozniak.capser_v2.models.exception.UserNotFoundException;
import com.mwozniak.capser_v2.repository.AcceptanceRequestRepository;
import com.mwozniak.capser_v2.service.AchievementService;
import com.mwozniak.capser_v2.service.EmailService;
import com.mwozniak.capser_v2.service.NotificationService;
import com.mwozniak.capser_v2.service.UserService;
import com.mwozniak.capser_v2.utils.EloRating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public abstract class SoloGameService<T extends AbstractSoloGame> extends AbstractGameService<T> {


    protected SoloGameService(AcceptanceRequestRepository acceptanceRequestRepository, AchievementService achievementService, UserService userService, EmailService emailService, NotificationService notificationService) {
        super(acceptanceRequestRepository, userService, achievementService, emailService, notificationService);
    }

    public void updateEloAndStats(AbstractSoloGame game) throws CapserException {
        User user1 = userService.getUser(game.getPlayer1());
        User user2 = userService.getUser(game.getPlayer2());

        game.calculatePlayerStats(user1);
        game.calculatePlayerStats(user2);

        int d = game.isDraw() ? 0 : (game.getWinner().equals(game.getPlayer1()) ? -1 : 1);

        EloRating.EloResult eloResult = EloRating.calculate(game.findCorrectStats(user1).getPoints(), game.findCorrectStats(user2).getPoints(), 30, d);

        game.updateUserPoints(user1, eloResult.getResult1());
        game.updateUserPoints(user2, eloResult.getResult2());

        userService.saveUser(user1);
        userService.saveUser(user2);

    }

    @Override
    public Page<T> listAcceptedGames(Pageable pageable) {
        Page<T> games = getAcceptedGames(pageable);
        games = mapGamesWithPlayerNames(games);

        return games;
    }

    @Override
    public Page<T> listPlayerAcceptedGames(Pageable pageable, UUID player) {
        Page<T> games = getPlayerAcceptedGames(pageable, player);
        games = mapGamesWithPlayerNames(games);

        return games;
    }

    public Page<T> listGamesWithPlayerAndOpponent(Pageable pageable, UUID player1, UUID player2) {
        Page<T> games = getGamesWithPlayerAndOpponent(pageable, player1, player2);
        games = mapGamesWithPlayerNames(games);

        return games;
    }


    private Page<T> mapGamesWithPlayerNames(Page<T> games) {
        return games.map(game -> {
            try {
                String user1Name = userService.getUser(game.getPlayer1()).getUsername();
                String user2Name = userService.getUser(game.getPlayer2()).getUsername();

                game.setTeam1Name(user1Name);
                game.setTeam2Name(user2Name);

                return game;
            } catch (UserNotFoundException e) {
                e.printStackTrace();
                return game;
            }
        });
    }


    protected abstract Page<T> getGamesWithPlayerAndOpponent(Pageable pageable, UUID player1, UUID player2);

    protected abstract Page<T> getAcceptedGames(Pageable pageable);

    protected abstract Page<T> getPlayerAcceptedGames(Pageable pageable, UUID player);

}
