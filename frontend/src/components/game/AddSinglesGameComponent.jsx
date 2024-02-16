import React, {useState} from 'react';
import {Button, Divider, Typography} from "@material-ui/core";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import mainStyles from "../../misc/styles/MainStyles";
import {useDispatch, useSelector} from "react-redux";
import {useSoloGamePost} from "../../data/SoloGamesData";
import {showError, showSuccess} from "../../redux/actions/alertActions";
import {useHistory} from "react-router-dom";
import UserFetchSelectField from "../../utils/UserFetchSelectField";

const AddSinglesGameComponent = ({
                                     type, choosePlayers = true, displayGameDataSection = true, showBorder = true,
                                     handleSaveExternal, overridePlayer1Name, overridePlayer2Name, onCancel
                                 }) => {

    const classes = mainStyles()
    const {postGame} = useSoloGamePost(type);


    const {userId} = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const history = useHistory();


    const [playerScore, setPlayerScore] = useState(0);
    const [opponentScore, setOpponentScore] = useState(0);

    const [opponent, setOpponent] = useState(null);



    const handleSave = () => {

        if (!opponent && choosePlayers) {
            dispatch(showError("You have to choose an opponent"));
            return;
        }

        const player1Stats = {
            playerId: userId,
            score: playerScore,
        };

        let player2Stats;
        if (opponent) {
            player2Stats = {
                playerId: opponent.id,
                score: opponentScore,
            }
        } else {
            player2Stats = {
                playerId: undefined,
                score: opponentScore,
            }
        }

        const request = {
            player1Stats: player1Stats,
            player2Stats: player2Stats,
            gameEventList: []
        }
        if (handleSaveExternal) {
            handleSaveExternal(request);
            return;
        }

        postGame(request).then(() => {
            dispatch(showSuccess("Match posted"))
            history.push('/')
        }).catch(e => {
            dispatch(showError(e.response.data.error));
        });
    }


    const getScoreOptions = (number) => {
        const numbers = [];
        for (let i = 0; i <= number; i++) {
            numbers.push(i);
        }
        return (numbers.map(number => {
            return (
                <MenuItem key={number} value={number}>
                    {number}
                </MenuItem>)
        }))
    }

    return (
        <div style={{display: "flex", justifyContent: "center"}}>
            <div style={{maxWidth: 400, flex: 1}}>

                <div style={{padding: 8}} className={showBorder ? classes.standardBorder : null}>
                    {displayGameDataSection && <div
                        className={[classes.column].join(' ')}>
                        <Typography variant={"h4"}>Match Data</Typography>
                    </div>}

                    <div
                        className={[classes.column].join(' ')}>
                        <Typography variant={"h5"}>{overridePlayer1Name || "Player data"}</Typography>

                        <div className={classes.margin}>
                            <Typography>Points</Typography>
                            <Select style={{minWidth: 200}} value={playerScore} onChange={(e) => {
                                setPlayerScore(e.target.value)
                            }}>
                                {getScoreOptions( 21)}
                            </Select>
                        </div>

                    </div>

                    <div
                        className={[classes.column].join(' ')}>
                        <Typography variant={"h5"}>{overridePlayer2Name || "Opponent data"}</Typography>
                        {choosePlayers && <div className={classes.margin}>
                            <UserFetchSelectField label={"Select Opponent"} onChange={(value) => setOpponent(value)}/>
                        </div>}

                        <div className={classes.margin}>
                            <Typography>Points</Typography>

                            <Select value={opponentScore} onChange={(e) => {
                                setOpponentScore(e.target.value)
                            }} className={classes.width200}>
                                {getScoreOptions( 21)}
                            </Select>
                        </div>
                    </div>
                </div>

                <div style={{display: 'flex', justifyContent: 'center', marginTop: 0}}>
                    <Button onClick={handleSave}>Add a game</Button>
                    {onCancel &&
                    <Button variant={"outlined"} style={{marginLeft: 10}} onClick={onCancel}>Cancel</Button>}
                </div>
                <div style={{height: 50}}/>
            </div>
        </div>
    );
};

export default AddSinglesGameComponent;
