import {getGameIcon} from "../components/game/details/GameComponent";
import {Typography} from "@material-ui/core";
import React from "react";

export const getGameModeString = (string) => {
    switch (string) {
        case 'SUDDEN_DEATH' :
            return 'Sudden Death'
        case 'OVERTIME' :
            return 'Overtime'
    }
}


export const getGameTypeString = (string) => {
    switch (string) {
        case 'SINGLES' :
            return 'Singles'
        case 'EASY_CAPS' :
            return 'Easy Caps'
        case 'DOUBLES' :
            return 'Doubles'
        case 'UNRANKED' :
            return 'Unranked'
    }
}

export const getRequestGameTypeString = (type) => {

    switch (type) {
        case 'SINGLES' :
            return 'singles'
        case 'EASY_CAPS' :
            return 'easy'
        case 'DOUBLES' :
            return 'doubles'
        case 'UNRANKED' :
            return 'unranked'
    }

}

export const getStatsString = (type) => {
    switch (type) {
        case 'SINGLES' :
            return 'userSinglesStats'
        case  'EASY_CAPS' :
            return 'userEasyStats'
        case 'UNRANKED' :
            return 'userUnrankedStats'
        case 'DOUBLES' :
            return 'userDoublesStats'
    }

}

export const displayStats = (type, stats, showPoints = true) => {
    return (<div>
        <div style={{display: "flex"}}>
            {getGameIcon(type)}
            <Typography style={{fontWeight: "bold", marginLeft: 5}}
                        color={"inherit"}> {getGameTypeString(type)}</Typography>
        </div>

        <div style={{display: "flex", flexWrap: 'wrap'}}>
            <div style={{flex: 1}}>
                <div style={{display: "flex", flexDirection: "column", marginRight: 10}}>
                    <Typography noWrap variant={"caption"}>Points: {stats.points.toFixed(2)}</Typography>
                    <Typography noWrap variant={"caption"}>Matches played: {stats.gamesPlayed}</Typography>
                    <Typography noWrap variant={"caption"}>Matches won: {stats.gamesWon}</Typography>
                    <Typography noWrap variant={"caption"}>Matches lost: {stats.gamesLost}</Typography>
                    <Typography noWrap variant={"caption"}>Matches drawn: {stats.gamesDrawn}</Typography>
                    <Typography noWrap variant={"caption"}>Win/loss: {stats.winLossRatio.toFixed(2)}</Typography>
                </div>
            </div>
            <div style={{flex: 1}}>
                <div style={{display: "flex", flexDirection: "column"}}>
                    <Typography noWrap variant={"caption"}>Goals Made to
                        lost: {stats.pointsMadeLostRatio.toFixed(2)}</Typography>
                    <Typography noWrap variant={"caption"}>Goals Made: {stats.totalPointsMade}</Typography>
                    <Typography noWrap variant={"caption"}>Goals Lost: {stats.totalPointsLost}</Typography>
                </div>
            </div>
        </div>
    </div>)
}

