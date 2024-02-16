package com.mwozniak.capser_v2.models.database.game.single;

import com.mwozniak.capser_v2.enums.GameType;
import com.mwozniak.capser_v2.models.database.User;
import com.mwozniak.capser_v2.models.database.UserStats;
import com.mwozniak.capser_v2.models.database.game.GamePlayerStats;
import com.mwozniak.capser_v2.models.exception.GameValidationException;
import lombok.Builder;
import lombok.Getter;

import javax.persistence.Entity;

@Entity
@Builder
@Getter
public class EasyCapsGame extends AbstractSoloGame {

    public EasyCapsGame() {
        super();
    }

    @Override
    public GameType getGameType() {
        return GameType.EASY_CAPS;
    }

    @Override
    public UserStats findCorrectStats(User user) {
        return user.getUserEasyStats();
    }

    @Override
    public void updateUserPoints(User user, float pointsChange) throws GameValidationException {
        UserStats singlesStats = findCorrectStats(user);
        singlesStats.setPoints(singlesStats.getPoints() + pointsChange);
        findStats(user.getId()).setPointsChange(pointsChange);
    }
}
