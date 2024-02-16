package com.mwozniak.capser_v2.models.database.game;

import com.mwozniak.capser_v2.models.database.User;
import com.mwozniak.capser_v2.models.database.UserStats;
import com.mwozniak.capser_v2.models.exception.GameValidationException;
import com.mwozniak.capser_v2.models.exception.UpdateStatsException;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.*;

@MappedSuperclass
@AllArgsConstructor
public abstract class AbstractGame implements Game {



    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    @Getter
    @Setter
    private UUID id;

    @Getter
    private boolean accepted;


    @Getter
    @Setter
    private String team1Name;

    @Getter
    @Setter
    private String team2Name;


    @Getter
    @Setter
    protected Date time;

    @Setter
    @Getter
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    protected List<GamePlayerStats> gamePlayerStats;

    protected AbstractGame() {
        time = new Date();
        accepted = false;
    }

    public void calculatePlayerStats(User user) throws UpdateStatsException {
        try {

            UserStats userStats = findCorrectStats(user);
            GamePlayerStats playerStats = findStats(user.getId());

            userStats.setGamesPlayed(userStats.getGamesPlayed() + 1);
            if(isDraw()){
                userStats.setGamesDrawn(userStats.getGamesDrawn() + 1);
            }else if (isWinner(user)) {
                userStats.setGamesWon(userStats.getGamesWon() + 1);
            } else {
                userStats.setGamesLost(userStats.getGamesLost() + 1);
            }


            userStats.setTotalPointsMade(userStats.getTotalPointsMade() + playerStats.getScore());
            userStats.setTotalPointsLost(userStats.getTotalPointsLost() + getPointsLost(user));

            userStats.setWinLossRatio(userStats.getGamesLost() == 0 ? userStats.getGamesWon() : (float) userStats.getGamesWon() / userStats.getGamesLost());
            userStats.setPointsMadeLostRatio(userStats.getTotalPointsLost() == 0 ? userStats.getTotalPointsMade() :(float) userStats.getTotalPointsMade() / userStats.getTotalPointsLost());
            user.setLastGame(new Date());

        } catch (GameValidationException e) {
            throw new UpdateStatsException("Invalid user id while updating stats", e);
        }
    }

    protected GamePlayerStats findStats(UUID id) throws GameValidationException {
        Optional<GamePlayerStats> gamePlayerStatsOptional = gamePlayerStats.stream().filter(stats -> stats.getPlayerId().equals(id)).findFirst();
        if (gamePlayerStatsOptional.isPresent()) {
            return gamePlayerStatsOptional.get();
        } else {
            throw new GameValidationException("Cannot find player stats");
        }
    }



    public void setAccepted() {
        accepted = true;
    }

    public static class Comparators {

        private Comparators() {

        }

        public static final Comparator<AbstractGame> DATE = Comparator.comparing(AbstractGame::getTime);
    }

}
