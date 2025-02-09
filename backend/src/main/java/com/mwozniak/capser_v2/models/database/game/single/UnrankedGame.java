package com.mwozniak.capser_v2.models.database.game.single;

import com.mwozniak.capser_v2.enums.GameType;
import com.mwozniak.capser_v2.models.database.User;
import com.mwozniak.capser_v2.models.database.UserStats;
import com.mwozniak.capser_v2.models.database.game.GamePlayerStats;
import lombok.Builder;
import lombok.Getter;

import javax.persistence.Entity;

@Entity
@Builder
@Getter
public class UnrankedGame  extends AbstractSoloGame {

    public UnrankedGame() {

    }

    @Override
    public UserStats findCorrectStats(User user) {
        return user.getUserUnrankedStats();
    }

    @Override
    public GameType getGameType() {
        return GameType.UNRANKED;
    }

    @Override
    public void updateUserPoints(User user, float pointsChange) {
        // no points bruh
    }
}
