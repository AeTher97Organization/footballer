package com.mwozniak.capser_v2.models.database.game.team;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mwozniak.capser_v2.models.database.User;
import com.mwozniak.capser_v2.models.database.UserStats;
import com.mwozniak.capser_v2.models.database.game.AbstractGame;
import com.mwozniak.capser_v2.models.database.game.GamePlayerStats;
import com.mwozniak.capser_v2.models.dto.AbstractGameDto;
import com.mwozniak.capser_v2.models.dto.TeamGameDto;
import com.mwozniak.capser_v2.models.exception.GameValidationException;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.CascadeType;
import javax.persistence.JoinColumn;
import javax.persistence.MappedSuperclass;
import javax.persistence.OneToOne;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@MappedSuperclass
public abstract class AbstractTeamGame extends AbstractGame {

    @Setter
    @Getter
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "team_1", referencedColumnName = "id", nullable = false)
    private Team team1;

    @Setter
    @Getter
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "team_2", referencedColumnName = "id", nullable = false)
    private Team team2;

    @Setter
    @Getter
    private UUID team1DatabaseId;

    @Setter
    @Getter
    private UUID team2DatabaseId;

    @Setter
    @Getter
    private int team1Score;

    @Setter
    @Getter
    private int team2Score;

    @Setter
    @Getter
    private UUID winnerId;

    @JsonIgnore
    public Team getWinningTeam() {

        if (team1DatabaseId.equals(winnerId)) {
            return team1;
        } else {
            return team2;
        }
    }

    @JsonIgnore
    public Team getLoser() {

        if (team1DatabaseId.equals(winnerId)) {
            return team2;
        } else {
            return team1;
        }
    }


    @Override
    public void validate() throws GameValidationException {

        if (getTeamPoints(getTeam1Stats()) != getTeam1Score() && getTeamPoints(getTeam1Stats()) != 0) {
            throw new GameValidationException("All players score in team 1 has to sum to team score");
        }

        if (getTeamPoints(getTeam2Stats()) != getTeam2Score() && getTeamPoints(getTeam2Stats()) != 0) {
            throw new GameValidationException("All players score in team 2 has to sum to team score");
        }

        playerNumberSpecificValidation();

    }

    @Override
    public final void calculateStatsOfAllPlayers() throws GameValidationException {
        if(isDraw()){
            return;
        }
        if (team1Score > team2Score) {
            setWinnerId(team1DatabaseId);
        } else {
            setWinnerId(team2DatabaseId);
        }

    }

    public void calculateTeamStats(UserStats userStats,
                                   List<GamePlayerStats> teamStats,
                                   List<GamePlayerStats> opponentStats,
                                   float pointsChange,
                                   boolean draw) {

        userStats.setGamesPlayed(userStats.getGamesPlayed() + 1);

        if (draw) {
            userStats.setGamesDrawn(userStats.getGamesDrawn() + 1);
        } else if(pointsChange > 0){
            userStats.setGamesWon(userStats.getGamesWon() + 1);
        } else {
            userStats.setGamesLost(userStats.getGamesLost() + 1);
        }

        userStats.setTotalPointsMade(userStats.getTotalPointsMade() + (getTeam1Stats().equals(teamStats) ? team1Score : team2Score));
        userStats.setTotalPointsLost(userStats.getTotalPointsLost() + (getTeam1Stats().equals(teamStats) ? team2Score : team1Score));

        userStats.setWinLossRatio(userStats.getGamesLost() == 0 ? userStats.getGamesWon() : (float) userStats.getGamesWon() / userStats.getGamesLost());
        userStats.setPointsMadeLostRatio(userStats.getTotalPointsLost() == 0 ? userStats.getTotalPointsMade() : (float) userStats.getTotalPointsMade() / userStats.getTotalPointsLost());
        userStats.setPoints(userStats.getPoints() + pointsChange);
    }

    @Override
    public void fillCommonProperties(AbstractGameDto abstractGameDto) {
        TeamGameDto teamGameDtoCast = (TeamGameDto) abstractGameDto;

        team1 = new Team();
        team2 = new Team();

        team1DatabaseId = teamGameDtoCast.getTeam1();
        team2DatabaseId = teamGameDtoCast.getTeam2();

        team1.setPlayerList(teamGameDtoCast.getTeam1Players());
        team2.setPlayerList(teamGameDtoCast.getTeam2Players());
        setTeam1(team1);
        setTeam2(team2);

        team1Score = teamGameDtoCast.getTeam1Score();
        team2Score = teamGameDtoCast.getTeam2Score();

        if(!isDraw()) {
            if (team1Score > team2Score) {
                setWinnerId(team1DatabaseId);
            } else {
                setWinnerId(team2DatabaseId);
            }
        }

        setGamePlayerStats(teamGameDtoCast.getPlayerStatsDtos().stream()
                .map(dto -> GamePlayerStats.builder()
                        .score(dto.getScore())
                        .playerId(dto.getPlayerId())
                        .build()).collect(Collectors.toList()));

    }

    protected GamePlayerStats getPlayerStats(UUID id) {
        return gamePlayerStats.stream().filter(gamePlayerStats1 -> gamePlayerStats1.getPlayerId().equals(id)).findAny().get();
    }

    @JsonIgnore
    public List<GamePlayerStats> getTeam1Stats() {
        return gamePlayerStats.stream().filter(stats -> team1.getPlayerList().contains(stats.getPlayerId())).collect(Collectors.toList());
    }

    @JsonIgnore
    public List<GamePlayerStats> getTeam2Stats() {
        return gamePlayerStats.stream().filter(stats -> team2.getPlayerList().contains(stats.getPlayerId())).collect(Collectors.toList());
    }

    @Override
    public int getPointsLost(User user) {
        if (getTeam1().getPlayerList().contains(user.getId())) {
            return getTeamPoints(getTeam2Stats());
        } else {
            return getTeamPoints(getTeam1Stats());
        }
    }

    @JsonIgnore
    public UUID getWinnerTeamId() {
        return winnerId;
    }

    @JsonIgnore
    public UUID getLoserTeamId() {
        if (winnerId.equals(team1DatabaseId)) {
            return team2DatabaseId;
        } else {
            return team1DatabaseId;
        }
    }

    public int getTeamPoints(List<GamePlayerStats> stats) {
        return stats.stream().map(GamePlayerStats::getScore).mapToInt(Integer::intValue).sum();
    }


    public boolean isWinner(User user){
        return getWinningTeam().getPlayerList().contains(user.getId());
    }

    public UUID getWinner() {
        return winnerId;
    }

    protected abstract void playerNumberSpecificValidation() throws GameValidationException;

}
