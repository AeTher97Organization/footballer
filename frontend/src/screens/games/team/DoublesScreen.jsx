import React, {useState} from 'react';
import PageHeader from "../../../components/misc/PageHeader";
import {DoublesIcon} from "../../../misc/icons/CapsIcons";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "../../../components/misc/TabPanel";
import {useSelector} from "react-redux";
import {Redirect, useHistory, useLocation} from "react-router-dom";
import AddDoublesGameComponent from "../../../components/game/AddDoublesGameComponent";
import TeamGamesList from "../../../components/game/list/TeamGamesList";
import TeamsList from "../../../components/participant/TeamsList";
import {useHasRole} from "../../../utils/SecurityUtils";
import useQuery from "../../../utils/UserQuery";


const DoublesScreen = () => {
    const {isAuthenticated} = useSelector(state => state.auth);
    const query = useQuery();
    const [redirect, setRedirect] = useState(false);
    const [redirectTarget, setRedirectTarget] = useState('')
    const tab = query.get('tab') || 'games';
    const history = useHistory();
    const hasRole = useHasRole();
    const location = useLocation();


    if (tab === 'addGame' && !isAuthenticated) {
        return (<Redirect to={{pathname: "/login", state: {prevPath: location.pathname + '?tab=' + tab}}}/>)
    }


    const handleTabChange = (e, value) => {
        if (value === 'addGame' && !isAuthenticated) {
            setRedirectTarget(value);
            setRedirect(true);
            return;
        }
        history.push(`/doubles/?tab=${value}`)
    }
    return (
        <div>
            <PageHeader title={"Doubles"} icon={<DoublesIcon fontSize={'large'}/>}/>
            <Tabs value={tab} onChange={handleTabChange} style={{marginTop: 5}} centered>
                <Tab value={'games'} label={'Games'}/>
                <Tab value={'players'} label={'Teams'}/>
                {!hasRole('ADMIN') && <Tab value={'addGame'} label={'Post Match'}/>}
            </Tabs>
            <TabPanel value={tab} showValue={'games'}>
                <TeamGamesList type={'DOUBLES'} render={tab === 'games'}/>
            </TabPanel>
            <TabPanel value={tab} showValue={'players'}>
                <TeamsList type={'DOUBLES'}/>
            </TabPanel>
            {!hasRole('ADMIN') && <TabPanel value={tab} showValue={'addGame'}>
                <AddDoublesGameComponent/>
            </TabPanel>}

            {redirect &&
            <Redirect to={{pathname: "/login", state: {prevPath: location.pathname + '?tab=' + redirectTarget}}}/>}

        </div>
    );
};

export default DoublesScreen;
