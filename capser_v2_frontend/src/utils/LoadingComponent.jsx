import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from "@material-ui/core/styles/makeStyles";

const LoadingComponent = ({size = "medium"}) => {

    const classes = loadingStyles();
    let selected;

    switch (size) {
        case 'small' :
            selected = classes.small;
            break;
        case 'medium' :
            selected = classes.medium;
            break;
        case 'large' :
            selected = classes.large;
            break;

    }
    return (
        <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'row', width: '100%'}}>
            <img src={"/loading.svg"} className={selected} style={{margin: 10}}/>
        </div>
    );
};

LoadingComponent.propTypes = {
    size: PropTypes.oneOf(['small', 'medium', 'large'])
};

const loadingStyles = makeStyles(theme => ({
    small: {
        width: 25,
        height: 25
    },
    medium: {
        width: 50,
        height: 50
    },
    large: {
        width: 100,
        height: 100
    }
}))
export default LoadingComponent;
