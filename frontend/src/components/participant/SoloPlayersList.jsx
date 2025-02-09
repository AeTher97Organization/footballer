import React, {useState} from 'react';
import mainStyles from "../../misc/styles/MainStyles";
import {Typography} from "@material-ui/core";
import {usePlayersList} from "../../data/PlayersData";
import Tooltip from "@material-ui/core/Tooltip";
import PlayerCard from "../tooltips/PlayerCard";
import {getStatsString} from "../../utils/Utils";
import Fade from '@material-ui/core/Fade';
import BoldTyphography from "../misc/BoldTyphography";
import {useXtraSmallSize} from "../../utils/SizeQuery";
import CapserPagination from "../game/list/CapserPagination";
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from "react-router-dom";
import ProfilePicture from "../profile/ProfilePicture";
import {Skeleton} from "@material-ui/lab";


const SoloPlayersList = ({type, pointsHidden = false}) => {

    const [currentPage, setPage] = useState(1);

    const small = useXtraSmallSize();
    const {loading, players, pageCount} = usePlayersList(type, currentPage - 1);
    const history = useHistory();

    const styles = listStyles({small})();


    let index = 0;

    const classes = mainStyles();
    return (
        <div style={{display: "flex", justifyContent: "center"}}>
            <div style={{maxWidth: 800, flex: 1}}>
                {!loading ? <div className={classes.standardBorder} style={{padding: 0}}>
                        <div className={styles.row}>
                            <div className={classes.header} style={{flex: 0.4}}>
                                <Typography>Player</Typography>
                            </div>
                            <div style={{flex: 0.2}}>
                                {!pointsHidden && <Typography>Points</Typography>}
                            </div>
                            <Typography style={{minWidth: 75, flex: 0.2}}>Last Seen</Typography>
                            <Typography style={{minWidth: 80, flex: 0.2}}>Last Match</Typography>
                        </div>
                        {players.length === 0 &&
                        <Typography style={{textAlign: 'center', marginTop: 15, marginBottom: 15}} variant={"h5"}>
                            No one has played a game</Typography>}
                        {players.map(player => {
                            index++;
                            const stats = player[getStatsString(type)];
                            return (
                                <div className={styles.row} style={players.length === 1 ? {borderWidth: 0} : {}}
                                     key={player.id}>

                                    <div style={{flex: 0.07}}>
                                        <div style={{position: 'relative', left: small ? 0 : -5}}>
                                            <ProfilePicture size={'tiny'} avatarHash={player.avatarHash}/>
                                        </div>
                                    </div>
                                    <div className={classes.header} style={{flex: 0.33}}>

                                        <div className={classes.twichHighlightPadding} style={{cursor: 'pointer'}}
                                             onClick={() => {
                                                 history.push(`/players/${player.id}`)
                                             }}>
                                            <Tooltip title={<PlayerCard player={player} type={type}/>}
                                                     TransitionComponent={Fade}
                                                     style={{padding: 0, margin: 0}}>
                                                <div>
                                                    <BoldTyphography style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        marginRight: small ? 5 : 0
                                                    }}
                                                                     color={"primary"}>{(currentPage - 1) * 10 + index}. {player.username}</BoldTyphography>
                                                </div>
                                            </Tooltip>
                                        </div>

                                    </div>

                                    <Typography style={{
                                        flex: 0.2
                                    }}>
                                        {!pointsHidden ? stats.points.toFixed(2) : ''}
                                    </Typography>
                                    <div style={{flex: 0.2}}>
                                        {player.lastSeen ?
                                            <Typography style={{
                                                marginRight: small ? 0 : 10
                                            }}>{new Date(player.lastSeen).toDateString()}</Typography> :
                                            <Typography style={{marginRight: small ? 0 : 10}}>Never seen</Typography>}
                                    </div>
                                    <div style={{flex: 0.2}}>
                                        {player.lastGame ?
                                            <Typography>{new Date(player.lastGame).toDateString()}</Typography> :
                                            <Typography>No games played</Typography>}
                                    </div>
                                </div>)
                        })
                        }
                    </div> :
                    Array.from(Array(10)).map((value) => <div key={value}
                        style={{display: 'flex', alignItems: 'center', margin: '5px 0 5px 0'}}>
                        <Skeleton variant={"circle"} style={{width: 60, height: 60}}/><Skeleton variant={"rect"}
                                                                                                style={{
                                                                                                    margin: '5px 0 5px 10px',
                                                                                                    height: 35,
                                                                                                    flex: 1,
                                                                                                    borderRadius: 7
                                                                                                }}/></div>)
                }
                {!loading && pageCount > 1 &&
                <CapserPagination onChange={page => setPage(page)}
                                  currentPage={currentPage}
                                  pageCount={pageCount}/>
                }
            </div>
        </div>
    );
};

export const listStyles = props => makeStyles(theme => ({
    row: {
        borderBottom: '1px solid ' + theme.palette.divider,
        padding: 15,
        paddingLeft: 15,
        display: "flex",
        alignItems: 'center',
        justifyContent: props.small ? 'center' : 'space-around',
        flexDirection: props.small ? "column" : "row",
        flexWrap: 'wrap'
    }
}))

export default SoloPlayersList;
