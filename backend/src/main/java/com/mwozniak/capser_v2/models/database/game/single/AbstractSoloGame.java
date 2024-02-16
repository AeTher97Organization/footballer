package com.mwozniak.capser_v2.models.database.game.single;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mwozniak.capser_v2.models.database.User;
import com.mwozniak.capser_v2.models.database.game.AbstractGame;
import com.mwozniak.capser_v2.models.database.game.GamePlayerStats;
import com.mwozniak.capser_v2.models.dto.AbstractGameDto;
import com.mwozniak.capser_v2.models.dto.SoloGameDto;
import com.mwozniak.capser_v2.models.exception.GameValidationException;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.MappedSuperclass;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@MappedSuperclass
public abstract class AbstractSoloGame extends AbstractGame {

    @Setter
    @Getter
    private UUID player1;
    @Setter
    @Getter
    private UUID player2;

    @Setter
    private UUID winner;

    protected AbstractSoloGame() {
        super();
    }

    @JsonIgnore
    public GamePlayerStats getPlayer1Stats() {
        try {
            return findStats(getPlayer1());
        } catch (GameValidationException e) {
            // should never happen for this case
            return null;
        }
    }

    @JsonIgnore
    public GamePlayerStats getPlayer2Stats() {
        try {
            return findStats(getPlayer2());
        } catch (GameValidationException e) {
            // should never happen in this case
            return null;
        }
    }


    @Override
    public void validate() throws GameValidationException {
        GamePlayerStats player1Stats = getPlayer1Stats();
        GamePlayerStats player2Stats = getPlayer2Stats();

        if (getPlayer1().equals(getPlayer2())) {
            throw new GameValidationException("Game has to be played by two unique players");
        }
    }


    @Override
    public void calculateStatsOfAllPlayers() throws GameValidationException {
        GamePlayerStats gamePlayerStats1 = getPlayer1Stats();
        GamePlayerStats gamePlayerStats2 = getPlayer2Stats();

        if (!isDraw()) {
            if (gamePlayerStats1.getScore() > gamePlayerStats2.getScore()){
                setWinner(getPlayer1());
            } else{
                setWinner(getPlayer2());
            }
        }
    }


    protected GamePlayerStats getOpponentStats(User user) {
        if (user.getId().equals(player1)) {
            return getPlayer2Stats();
        } else {
            return getPlayer1Stats();
        }
    }


    @Override
    public void fillCommonProperties(AbstractGameDto abstractGameDto) {
        SoloGameDto soloGameDto = (SoloGameDto) abstractGameDto;
        setGamePlayerStats(new ArrayList<>(Arrays.asList(
                GamePlayerStats.builder()
                        .score(soloGameDto.getPlayer1Stats().getScore())
                        .playerId(soloGameDto.getPlayer1Stats().getPlayerId())
                        .build(),
                GamePlayerStats.builder()
                        .score(soloGameDto.getPlayer2Stats().getScore())
                        .playerId(soloGameDto.getPlayer2Stats().getPlayerId())
                        .build())));
        setPlayer1(soloGameDto.getPlayer1Stats().getPlayerId());
        setPlayer2(soloGameDto.getPlayer2Stats().getPlayerId());
    }

    @Override
    public List<UUID> getAllPlayers() {
        return Arrays.asList(player1, player2);
    }

    public boolean isWinner(User user) {
        return winner.equals(user.getId());
    }


    @Override
    public int getPointsLost(User user) {
        return getOpponentStats(user).getScore();
    }

    @Override
    public UUID getWinner() {
        return winner;
    }

    @Override
    public boolean isDraw() {
        return getPlayer1Stats().getScore() == getPlayer2Stats().getScore();
    }

}
