import React from 'react';
import axios from "axios";
import {useSelector} from "react-redux";

const useFieldSearch = (url, pageSize) => {

    const {accessToken} = useSelector(state => state.auth);
    const pageNumber = 0;

    return (username) => {
        return axios.get(`${url}?pageSize=${pageSize}&pageNumber=${pageNumber}&username=${username}`,{
            headers: {
                'Authorization' : `Bearer ${accessToken}`
            }
        })
    };
};

export const useUsernameFetch = () => {
    return (id) => {
        return axios.get(`/users/${id}`)
    };
}


export default useFieldSearch;
