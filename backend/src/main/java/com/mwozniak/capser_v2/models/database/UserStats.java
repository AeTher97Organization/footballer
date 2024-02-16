package com.mwozniak.capser_v2.models.database;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mwozniak.capser_v2.models.dto.PlotsDto;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.UUID;

@Table(name = "user_stats")
@Data
@Entity
public class UserStats {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    public UserStats() {
        this.points = 500.0f;
    }


    private float points;

    private int gamesPlayed;
    private int gamesWon;
    private int gamesLost;
    private int gamesDrawn;

    private int totalPointsMade;
    private int totalPointsLost;

    private float winLossRatio;
    private float pointsMadeLostRatio;

    @JsonIgnore
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    private TimeSeries pointsSeries;


    @JsonIgnore
    public PlotsDto getPlots() {
        PlotsDto plotsDto = new PlotsDto();
        plotsDto.setPointSeries(pointsSeries);
        return plotsDto;
    }

}
