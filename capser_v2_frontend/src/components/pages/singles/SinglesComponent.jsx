import React, {useState} from 'react';
import PageHeader from "../../misc/PageHeader";
import {useHistory} from "react-router-dom";
import SinglesGamesList from "./SinglesGamesList";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "../../misc/TabPanel";
import AddSinglesGameComponent from "./AddSinglesGameComponent";
import SinglesPlayersList from "./SinglesPlayersList";
import {SinglesIcon} from "../../../misc/icons/CapsIcons";
import {useSelector} from "react-redux";

const SinglesComponent = () => {

    const [currentTab, setCurrentTab] = useState(0);

    const {isAuthenticated} = useSelector(state => state.auth)

    const history = useHistory();


    const handleTabChange = (e, value) => {
        if (value === 2 && !isAuthenticated) {
            history.push('/login')
        }
        setCurrentTab(value);
    }

    return (<div>
        <PageHeader title={"Singles"} icon={<SinglesIcon fontSize={"large"}/>} noSpace/>

        <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab value={0} label={'Games'}/>
            <Tab value={1} label={'Players'}/>
            <Tab value={2} label={'Add Game'}/>
        </Tabs>

        <TabPanel value={currentTab} showValue={0}>
            <SinglesGamesList type={'SINGLES'}/>
        </TabPanel>

        <TabPanel value={currentTab} showValue={1}>
            <SinglesPlayersList type={'SINGLES'}/>
        </TabPanel>

        <TabPanel value={currentTab} showValue={2}>
            <AddSinglesGameComponent type={'SINGLES'}/>
        </TabPanel>
    </div>)
};

export default SinglesComponent;
