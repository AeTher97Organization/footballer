import React from 'react';
import {useUserPlots} from "../../data/UserData";
import {Typography, useTheme} from "@material-ui/core";
import mainStyles from "../../misc/styles/MainStyles";
import GameIconWithName from "../../misc/GameIconWithName";
import useQuery from "../../utils/UserQuery";
import {useHistory} from "react-router-dom";
import Plot from "./Plot";


const ProfilePlots = ({userId, width}) => {
    const query = useQuery();
    const gameType = query.get('chart') || 'SINGLES';
    const history = useHistory();
    const {data, loaded} = useUserPlots(userId, gameType);

    return (
        <div>
            <ProfilePlotsSelector selected={gameType}
                                  onClick={(value) => history.push(`/players/${userId}?tab=charts&chart=${value}`)}/>
            <Typography variant={"h6"}>Results over time</Typography>
            {gameType === 'DOUBLES' &&
            <Typography>Plots in double stats are aggregated results from all teams</Typography>}
            {loaded && data.pointSeries && <>
                <Typography>Points</Typography>
                <Plot seriesData={data.pointSeries}/>
            </>}
            {!loaded && <div style={{height: 1000}}/>}


        </div>
    );
};

const ProfilePlotsSelector = ({selected, onClick}) => {

    const classes = mainStyles();


    return <div style={{display: 'flex', justifyContent: 'center'}}>
        <div className={classes.standardBorder}
             style={{margin: 0, maxWidth: 333, flex: 1, display: 'flex', justifyContent: 'center', padding: 0}}>

            <SelectorElement selected={selected === "SINGLES"} value={"SINGLES"} onClick={onClick}>
                <GameIconWithName gameType={"SINGLES"}/>
            </SelectorElement>
            <SelectorElement last selected={selected === "DOUBLES"} value={"DOUBLES"} onClick={onClick}>
                <GameIconWithName gameType={"DOUBLES"}/>
            </SelectorElement>
        </div>
    </div>
}

const SelectorElement = ({
                             children, last, selected, onClick = () => {
    }, value
                         }) => {
    const theme = useTheme();

    return <div onClick={() => onClick(value)} style={{
        borderRadius: 5,
        borderRight: last ? null : "1px solid" + theme.palette.divider,
        flex: 0.5,
        padding: 5,
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: selected ? "rgb(30,75,0)" : "transparent"
    }}>
        {children}
    </div>
}
export default ProfilePlots;
