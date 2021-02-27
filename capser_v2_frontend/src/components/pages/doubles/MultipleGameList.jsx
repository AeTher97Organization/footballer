import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {useMultipleGames} from "../../../data/MultipleGamesData";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import {TableBody} from "@material-ui/core";
import {getGameModeString, getRequestGameTypeString} from "../../../utils/Utils";
import LoadingComponent from "../../../utils/LoadingComponent";
import Pagination from "@material-ui/lab/Pagination";
import mainStyles from "../../../misc/styles/MainStyles";
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from "react-router-dom";
import GameComponent from "../../game/GameComponent";
import {useXtraSmallSize} from "../../../utils/SizeQuery";
import Grid from "@material-ui/core/Grid";
import CapserPagination from "../../misc/CapserPagination";

const MultipleGameList = ({hiddenPoints = false, type, render =true}) => {

    const classes = mainStyles();
    const small = useXtraSmallSize();

    const [currentPage, setPage] = useState(1);

    const {games, loading, pagesNumber} = useMultipleGames(type, currentPage - 1, 10);

    const handlePageChange = (e, value) => {
        setPage(value);
    }


    return (
        <div style={{display: "flex", justifyContent: 'center'}}>
            <div style={{maxWidth: 800}}>
                <div style={{padding:15}}>
                    {!loading && render ? <Grid container spacing={2}>{games.map(game => <Grid xs={12} item key={game.id}>
                            <GameComponent game={game}
                                           vertical={small}/>
                        </Grid>)} </Grid> :
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


MultipleGameList.propTypes = {};

export default MultipleGameList;
