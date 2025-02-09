import React, {useEffect, useRef, useState} from 'react';
import {Link, Typography} from "@material-ui/core";
import {getRequestGameTypeString} from "../../../utils/Utils";
import mainStyles from "../../../misc/styles/MainStyles";
import {makeStyles} from "@material-ui/core/styles";
import BoldTyphography from "../../misc/BoldTyphography";
import {DoublesIcon, EasyIcon, SinglesIcon, UnrankedIcon} from "../../../misc/icons/CapsIcons";
import {useHistory} from "react-router-dom";
import {useXtraSmallSize} from "../../../utils/SizeQuery";
import GameIconWithName from "../../../misc/GameIconWithName";

export const getGameIcon = (type) => {
    switch (type) {
        case "EASY_CAPS":
            return <EasyIcon fontSize={"small"}/>
        case "SINGLES":
            return <SinglesIcon fontSize={"small"}/>
        case "DOUBLES":
            return <DoublesIcon fontSize={"small"}/>
        case "UNRANKED":
            return <UnrankedIcon fontSize={"small"}/>
    }
}

const GameComponent = ({game, vertical = true}) => {

    const [expanded, setExpanded] = useState(false);
    const [maxHeight, setMaxHeight] = useState(0);
    const [delay, setDelay] = useState(0);
    const columnRef = useRef();
    const additionalInfoRef = useRef();
    const containerDiv = useRef();
    const [baseHeight, setBaseHeight] = useState(0);
    const history = useHistory();
    const small = useXtraSmallSize();


    const findPlayerStats = (game, id) => {
        return game.gamePlayerStats.find(o => o.playerId === id)
    }

    const gameStyle = gameStyles();
    const classes = mainStyles();


    useEffect(() => {
        if (columnRef.current && additionalInfoRef.current) {
            if (expanded) {
                setMaxHeight(columnRef.current.scrollHeight)
            } else {
                setMaxHeight(columnRef.current.scrollHeight - additionalInfoRef.current.scrollHeight - 30)
            }
        }
        if (columnRef.current) {
            setBaseHeight(columnRef.current.scrollHeight - additionalInfoRef.current.scrollHeight)
        } else {
            setBaseHeight(0);
        }
    }, [expanded, columnRef])

    let team1Name;
    let team2Name;
    let team1Score;
    let team2Score;
    let team1PointsChange;
    let team2PointsChange;

    if (game.gameType === 'DOUBLES') {
        team1Name = game.team1Name;
        team2Name = game.team2Name;
        team1Score = game.team1Score;
        team2Score = game.team2Score;
        const player1Stats = findPlayerStats(game, game.team1.playerList[0]);
        const player2Stats = findPlayerStats(game, game.team2.playerList[0]);
        team1PointsChange = player1Stats.pointsChange;
        team2PointsChange = player2Stats.pointsChange;
    } else {
        const player1Stats = findPlayerStats(game, game.player1)
        const player2Stats = findPlayerStats(game, game.player2)
        team1Name = game.team1Name;
        team2Name = game.team2Name;
        team1Score = player1Stats.score;
        team2Score = player2Stats.score;
        team1PointsChange = player1Stats.pointsChange;
        team2PointsChange = player2Stats.pointsChange;
    }

    return (
        <div
            style={{
                height: baseHeight
            }}
            ref={containerDiv}
            onClick={() => {
                if (!small) {
                    history.push(`/${getRequestGameTypeString(game.gameType)}/${game.id}`)
                } else {
                    setExpanded(!expanded);

                }
            }}
            onTouchEnd={(e) => {
            }}>
            <div ref={columnRef}
                 className={[classes.standardBorder, gameStyle.expanding, expanded ? gameStyle.elevated : gameStyle.notElevated].join(' ')}
                 style={{
                     borderRadius: 7,
                     margin: 0,
                     maxHeight: maxHeight,
                     zIndex: expanded ? 1000 : 0
                 }}
                 onMouseEnter={(e) => {
                     if (!small) {
                         setDelay(setTimeout(() => {
                             setExpanded(true)
                         }, 500))
                     }
                 }} onMouseLeave={() => {
                clearTimeout(delay);
                setExpanded(false)
            }}>
                <div className={[vertical ? classes.centeredColumn : classes.centeredRowNoFlex].join(' ')}>

                    <Typography variant={"h6"} style={{fontWeight: 600, textAlign: 'center'}}
                                className={gameStyle.margins}
                                color={"primary"}>{team1Name} vs {team2Name}</Typography>
                    <div className={[classes.centeredRowNoFlex, gameStyle.margins].join(' ')}>
                        <GameIconWithName gameType={game.gameType}/>
                    </div>
                    <div style={{display: 'block'}} className={gameStyle.margins}>
                        <Typography
                            style={{fontWeight: 600, textAlign: 'center'}}>{team1Score} : {team2Score}</Typography>
                    </div>
                    <Typography style={{textAlign: 'center'}}>{new Date(game.time).toDateString()}</Typography>

                </div>

                <div className={[expanded ? gameStyle.visible : gameStyle.transparent, gameStyle.overlay].join(' ')}
                     ref={additionalInfoRef}
                     style={{paddingLeft: vertical ? 0 : 15, paddingTop: 10}}>
                    {game.gameType !== "UNRANKED" &&
                    <div className={vertical ? classes.centeredColumn : classes.centeredRowNoFlex}>
                        <div>
                            <BoldTyphography>Points Change</BoldTyphography>
                        </div>
                        <div className={classes.centeredRowNoFlex}>
                            <Typography className={classes.margin}>{team1Name}</Typography>
                            <div style={{color: team1PointsChange > 0 ? 'green' : 'red'}}>
                                <BoldTyphography color={"inherit"}
                                >{team1PointsChange.toFixed(2)}</BoldTyphography>
                            </div>
                            <Typography className={classes.margin}>{team2Name}</Typography>
                            <div style={{color: team2PointsChange > 0 ? 'green' : 'red'}}>
                                <BoldTyphography
                                    color={"inherit"}>{team2PointsChange.toFixed(2)}</BoldTyphography>
                            </div>

                        </div>
                    </div>}
                    {small && <div className={vertical ? classes.centeredColumn : classes.centeredRowNoFlex}>
                        <Link onClick={() => {
                            history.push(`/${getRequestGameTypeString(game.gameType)}/${game.id}`)
                        }}>Details</Link>
                    </div>}
                </div>
            </div>
        </div>
    );
};

const gameStyles = makeStyles(theme => ({
    hidden: {
        display: 'none'
    },
    expanding: {
        cursor: "pointer",
        overflow: "hidden",
        transition: 'all 0.15s',
        position: "relative",
        padding: 15,
        margin: 10,
        backgroundColor: theme.palette.background.paper,
        '&:hover': {
            backgroundColor: 'rgba(45,50,57,1)',
            border: '1px solid transparent'
        },
        border: `1px solid ${theme.palette.divider}`
    },
    elevated: {
        boxShadow: '0px 5px 10px 5px rgba(0, 0, 0,0.8)',
    },
    notElevated: {
        boxShadow: '0 0px black'
    },
    visible: {
        transition: 'all 0.15s',
        opacity: 1
    },
    transparent: {
        transition: 'all 0.15s',
        opacity: 0
    },
    margins: {
        marginLeft: 10,
        marginRight: 10
    }
}))

GameComponent.propTypes = {};

export default GameComponent;
