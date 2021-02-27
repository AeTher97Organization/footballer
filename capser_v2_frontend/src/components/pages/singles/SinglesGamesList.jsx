import React, {useState} from 'react';
import {useSinglesGames} from "../../../data/SoloGamesData";
import mainStyles from "../../../misc/styles/MainStyles";
import {TableBody} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import {getGameModeString, getRequestGameTypeString} from "../../../utils/Utils";
import Pagination from '@material-ui/lab/Pagination';
import LoadingComponent from "../../../utils/LoadingComponent";
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from "react-router-dom";
import GameComponent from "../../game/GameComponent";
import {useXtraSmallSize} from "../../../utils/SizeQuery";
import Grid from "@material-ui/core/Grid";
import CapserPagination from "../../misc/CapserPagination";

export  const findPlayerStats = (game, id) => {
    return game.gamePlayerStats.find(o => o.playerId === id)
}
const SinglesGamesList = ({type, hiddenPoints = false, render = true}) => {

    const [currentPage, setPage] = useState(1);
    const small = useXtraSmallSize();

    const {games, loading, pagesNumber} = useSinglesGames(type, currentPage - 1, 10);


    const classes = mainStyles();
    const styles = useStyles();
    return (
        <div style={{display: "flex", justifyContent: 'center'}}>

            <div  style={{maxWidth:800}}>
                <div className={classes.leftOrientedWrapperNoPadding}>
                    <div style={{padding: 15}}>
                        {!loading && render ? <Grid container spacing={2}>{games.map(game => <Grid xs={12} item key={game.id}>
                                <GameComponent game={game}
                                               vertical={small}
                                                render={render}/>
                            </Grid>)} </Grid>
                            :
                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                                <LoadingComponent/>
                            </div>}
                        {!loading && pagesNumber > 1 &&
                        <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                            <CapserPagination onNext={() => setPage(currentPage + 1)}
                                              onPrevious={() => setPage(currentPage + -1)}
                                              currentPage={currentPage}
                                              pageCount={pagesNumber}/>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const useStyles = makeStyles(theme => ({
    row: {
        cursor: "pointer",
        '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.05)'
        }
    }
}));

export default SinglesGamesList;
