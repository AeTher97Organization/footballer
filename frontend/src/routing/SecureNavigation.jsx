import {Route, Switch} from "react-router-dom";
import React, {useState} from 'react';
import SideBar from "../bars/SideBar";
import AddSinglesGameComponent from "../components/game/AddSinglesGameComponent";
import AcceptanceScreen from "../screens/private/AcceptanceScreen";
import TeamsScreen from "../screens/private/TeamsScreen";
import {useXtraSmallSize} from "../utils/SizeQuery";
import MobileTopBar from "../bars/TopBar";
import {useTheme} from "@material-ui/core";
import ProfileScreen from "../screens/profile/ProfileScreen";

const SecureNavigation = () => {

    const small = useXtraSmallSize();
    const [open, setOpen] = useState();
    const theme = useTheme();

    return (
        <div>
            <SideBar open={open} setOpen={setOpen}/>
            {small && <MobileTopBar open={open} setOpen={setOpen}/>}
            <div style={{paddingLeft: small ? 0 : 44, backgroundColor: theme.palette.background.default}}>

                <Switch>
                    <Route exact path={"/secure/addSinglesGame"}>
                        <div>
                            <AddSinglesGameComponent/>
                        </div>

                    </Route>

                    <Route exact path={"/secure/acceptance"}>
                        <div>
                            <AcceptanceScreen/>
                        </div>

                    </Route>

                    <Route exact path={"/secure/teams"}>
                        <div>
                            <TeamsScreen/>
                        </div>
                    </Route>

                    <Route exact path={"/secure/profile"}>
                        <div>
                            <ProfileScreen/>
                        </div>
                    </Route>

                </Switch>
            </div>
        </div>
    );
};


export default SecureNavigation;
