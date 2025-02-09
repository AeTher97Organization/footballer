import React from 'react';
import BellComponent from "../notifications/BellComponent";
import {Divider, Typography} from "@material-ui/core";
import BoldTyphography from "../misc/BoldTyphography";
import {logoutAction} from "../../redux/actions/authActions";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";
import mainStyles from "../../misc/styles/MainStyles";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import AccountBoxOutlinedIcon from "@material-ui/icons/AccountBoxOutlined";
import AccountTreeOutlinedIcon from "@material-ui/icons/AccountTreeOutlined";
import SearchIcon from "@material-ui/icons/Search";
import {DoublesIcon, EasyIcon, SinglesIcon, UnrankedIcon} from "../../misc/icons/CapsIcons";
import CheckIcon from "@material-ui/icons/Check";
import PeopleOutlineIcon from "@material-ui/icons/PeopleOutline";
import GavelIcon from "@material-ui/icons/Gavel";
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useHasRole} from "../../utils/SecurityUtils";


const SideBarContent = ({state, go, small}) => {
    const classes = useStyle();
    const mainStyles0 = mainStyles();

    const history = useHistory();
    const dispatch = useDispatch();
    const hasRole = useHasRole();
    const {username} = useSelector(state => state.auth)


    const icons = [
        {
            tooltip: "Homepage",
            link: "/",
            icon: <HomeOutlinedIcon/>
        },
        {
            tooltip: "Search",
            link: "/search",
            icon: <SearchIcon/>
        },
        {
            tooltip: username,
            link: "/secure/profile",
            icon: <AccountBoxOutlinedIcon/>,
            role: 'USER'

        },
        {
            tooltip: "Tournaments",
            link: "/tournaments",
            icon: <AccountTreeOutlinedIcon style={{transform: 'scale(-1,1)'}}/>
        },
        {
            tooltip: "Singles",
            link: "/singles",
            icon: <SinglesIcon/>

        },
        {
            tooltip: "Doubles",
            link: "/doubles",
            icon: <DoublesIcon/>
        },
        {
            tooltip: "Games Accepting",
            link: "/secure/acceptance",
            icon: <CheckIcon/>,
            role: 'USER'
        },
        {
            tooltip: "Teams",
            link: "/secure/teams",
            icon: <PeopleOutlineIcon/>,
            role: 'USER'
        }

    ]

    return (
        <div style={{width: state.width, overflow: small ? "scroll" : "hidden"}} className={classes.expanding}>
            {!small && <div onClick={() => {
                history.push("/")
            }}
                            style={{display: "flex", flexDirection: "row", justifyContent: "center"}}
            >
                <img src={"logo192.png"} style={{maxWidth: 38, padding: 3, cursor: "pointer", minHeight: 38}}
                     alt={'Logo'}/>
            </div>}
            {hasRole('USER') && <div>
                <BellComponent expanded={state.expanded}/>
            </div>}
            <Divider/>
            {icons.filter(icon => {
                if (icon.role) {
                    return hasRole(icon.role)
                } else {
                    return true
                }
            }).map(icon => {
                return (
                    <div key={icon.link}
                         className={[mainStyles0.centeredRowNoFlex, classes.redHover, mainStyles0.twichHighlight].join(' ')}
                         style={{paddingRight: 0}} onClick={() => go(icon.link)}>
                        {icon.icon !== 10 && <div style={{padding: 5, marginRight: 7}}> {icon.icon}</div>}
                        {icon.icon === 10 &&
                            <div style={{padding: 5, paddingLeft: 5, paddingRight: 10, marginRight: 5}}>
                                <Typography variant={"h6"} color={"inherit"}>
                                    {icon.icon}
                                </Typography>
                            </div>}
                        <div style={{transition: "all 0,2s"}}>
                            <BoldTyphography noWrap color={"inherit"}>{icon.tooltip}</BoldTyphography>
                        </div>
                    </div>
                )
            })}
            {hasRole('USER') || hasRole('ADMIN') ?
                <>
                    <Divider/>
                    <div
                        className={[classes.redHover, mainStyles0.centeredRowNoFlex, mainStyles0.twichHighlight].join(' ')}
                        onClick={() => {
                            dispatch(logoutAction())
                            history.push('/')
                        }}>
                        <div style={{padding: 5, marginRight: 7}}><ExitToAppOutlinedIcon
                            style={{transform: 'scale(-1,1)'}}/></div>
                        <div style={{transition: "all 0,2s"}}>
                            <BoldTyphography noWrap color={"inherit"}>Logout</BoldTyphography>
                        </div>
                    </div>
                </> :
                <>
                    <Divider/>
                    <div
                        className={[classes.redHover, mainStyles0.centeredRowNoFlex, mainStyles0.twichHighlight].join(' ')}
                        onClick={() => {
                            history.push('/login')
                        }}>
                        <div style={{padding: 5, marginRight: 7}}><ExitToAppOutlinedIcon/></div>
                        <div style={{transition: "all 0,2s"}}>
                            <BoldTyphography noWrap color={"inherit"}>Login</BoldTyphography>
                        </div>
                    </div>
                </>
            }
        </div>
    );
};

const useStyle = makeStyles(() => ({
    iconButton: {
        '&:hover': {
            color: '#4caf50'
        },
        fontSize: 20
    },
    expanding: {
        transition: "all 0.2s",
        overflow: "hidden"
    },
    redHover: {
        "&:hover": {
            color: '#4caf50'
        },
        cursor: "pointer"
    }
}))

export default SideBarContent;
