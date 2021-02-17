import {useEffect, useState} from "react";
import axios from "axios";
import {fetchUsername} from "./UsersFetch";
import {useSelector} from "react-redux";
import {getRequestGameTypeString} from "../utils/Utils";

export const useTournamentsList = (type, pageNumber = 0, pageSize = 10) => {
    const {accessToken} = useSelector(state => state.auth);
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagesNumber, setPagesNumber] = useState(0);


    const fetchTournaments = () => {
        return axios.get(`/tournaments?pageSize=${pageSize}&pageNumber=${pageNumber}`)
    };

    const createNew = (creationRequest,type) =>{
        setLoading(true);
        let shouldUpdate = true;
        axios.post(`/${type}/tournaments`,creationRequest,{
            headers: {
                authorization: `Bearer ${accessToken}`
            }
        }).then((response) => {
            const copy = tournaments.slice();
            copy.push(response.data);
            setTournaments(copy);
        }).finally(() => {
            if (shouldUpdate) {
                setLoading(false);
            }
        })

        return () => {
            shouldUpdate = false;
        }
    }

    useEffect(() => {
        setLoading(true);
        let shouldUpdate = true;
        fetchTournaments().then((response) => {
            setTournaments(response.data);
        }).finally(() => {
            if (shouldUpdate) {
                setLoading(false);
            }
        })

        return () => {
            shouldUpdate = false;
        }
    }, [pageNumber, pageSize, type])


    return {
        tournaments,
        loading,
        pagesNumber,
        createNew
    }
}


export const useTournamentData = (type, tournamentId) => {

    const [tournament, setTournament] = useState(null);
    const {accessToken} = useSelector(state => state.auth);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let shouldUpdate = true;
        setLoading(true);
        axios.get(`/${type}/tournaments/${tournamentId}`).then(result => {
            if (shouldUpdate) {
                setTournament(result.data);
            }
        }).catch(e => {
            console.log(e.message)
        }).finally(() => {
            if (shouldUpdate) {
                setLoading(false);
            }
        })

        return () => {
            shouldUpdate = false;
        }


    }, [tournamentId])


    const postTournamentGame = (entryId, gameRequest) => {
        let shouldUpdate = true;
        setLoading(true);
        axios.post(`${type}/tournaments/${tournamentId}/entry/${entryId}`, gameRequest, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }).then((response) => {
            setTournament(response.data);
        }).catch(e => {
            console.log(e.message)
        }).finally(() => {
            if (shouldUpdate) {
                setLoading(false);
            }
        })

        return () => {
            shouldUpdate = false;
        }
    }

    const savePlayers =(playersList) =>{
        let shouldUpdate = true;
        setLoading(true);
        axios.post(`${type}/tournaments/${tournamentId}/players`, playersList, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }).then((response) => {
            setTournament(response.data);
        }).catch(e => {
            console.log(e.message)
        }).finally(() => {
            if (shouldUpdate) {
                setLoading(false);
            }
        })

        return () => {
            shouldUpdate = false;
        }
    }

    const seedTournament = () =>{
        let shouldUpdate = true;
        setLoading(true);
        axios.post(`${type}/tournaments/${tournamentId}/seed`, null, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }).then((response) => {
            setTournament(response.data);
        }).catch(e => {
            console.log(e.message)
        }).finally(() => {
            if (shouldUpdate) {
                setLoading(false);
            }
        })

        return () => {
            shouldUpdate = false;
        }
    }

    const deleteTournament = (callback) =>{
        let shouldUpdate = true;
        setLoading(true);
        axios.delete(`${type}/tournaments/${tournamentId}`,  {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }).then((response) => {
            callback();
        }).catch(e => {
            console.log(e.message)
        }).finally(() => {
            if (shouldUpdate) {
                setLoading(false);
            }
        })

        return () => {
            shouldUpdate = false;
        }
    }

    return {tournament, loading, postTournamentGame, savePlayers, seedTournament,deleteTournament}
}

