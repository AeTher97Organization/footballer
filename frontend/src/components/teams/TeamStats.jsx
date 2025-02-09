import React, {useEffect, useState} from 'react';
import {Divider, Typography} from "@material-ui/core";
import mainStyles from "../../misc/styles/MainStyles";
import Grid from "@material-ui/core/Grid";
import {fetchUsername} from "../../data/FieldSearchData";

const TeamStats = ({team}) => {
    const stats = team.doublesStats;

    const [usernames, setUsernames] = useState([]);
    ;

    const findUsername = (id) => {
        const obj = usernames.find(o => o.id === id);
        if (obj) {
            return obj.username;
        } else {
            return ''
        }
    }

    useEffect(() => {
        Promise.all(team.playerList.map(player => {
            return fetchUsername(player)
        })).then((value) => {
            setUsernames(value.map(user => {
                return {id: user.data.id, username: user.data.username}
            }));
        })

    }, [team])

    const classes = mainStyles();
    return (
        <div>
            <Grid container>
                <Grid item md={6} sm={12} xs={12}>
                    <Typography variant={"h5"}>{team.name} Players</Typography>
                    <Divider/>
                    <div className={classes.paddedContent}>
                        {team.playerList.map(player => {
                                return <Typography key={player} variant={"h6"}>{findUsername(player)}</Typography>
                            }
                        )}
                    </div>
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                    <Typography variant={"h5"}>{team.name} Stats</Typography>
                    <Divider/>
                    <div className={classes.paddedContent}>
                        <div className={classes.header}>
                            <Typography style={{flex: 1}}>Points</Typography>
                            <Typography>{stats.points.toFixed(2)}</Typography>
                        </div>
                        <div className={classes.header}>
                            <Typography style={{flex: 1}}>Games Played</Typography>
                            <Typography>{stats.gamesPlayed}</Typography>
                        </div>
                        <div className={classes.header}>
                            <Typography style={{flex: 1}}>Games Won</Typography>
                            <Typography>{stats.gamesWon}</Typography>
                        </div>
                        <div className={classes.header}>
                            <Typography style={{flex: 1}}>Games Lost</Typography>
                            <Typography>{stats.gamesLost}</Typography>
                        </div>
                        <div className={classes.header}>
                            <Typography style={{flex: 1}}>Games Drawn</Typography>
                            <Typography>{stats.gamesDrawn}</Typography>
                        </div>
                        <div className={classes.header}>
                            <Typography style={{flex: 1}}>Win/Loss Ratio</Typography>
                            <Typography>{stats.winLossRatio.toFixed(2)}</Typography>
                        </div>
                        <div className={classes.header}>
                            <Typography style={{flex: 1}}>Goals Made</Typography>
                            <Typography>{stats.totalPointsMade}</Typography>
                        </div>
                        <div className={classes.header}>
                            <Typography style={{flex: 1}}>Goals Lost</Typography>
                            <Typography>{stats.totalPointsLost}</Typography>
                        </div>

                    </div>
                </Grid>


            </Grid>

        </div>
    );
};

TeamStats.propTypes = {};

export default TeamStats;
