import React from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Typography} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {loginAction} from "../../redux/actions/authActions";
import {useHistory} from "react-router-dom";
import {saveTokenInStorage} from "../../utils/TokenUtils";
import useFieldValidation from "../../utils/useFieldValidation";
import FormComponent from "../../components/misc/FormComponent";
import CenteredColumn from "../../components/misc/CenteredColumn";
import {useXtraSmallSize} from "../../utils/SizeQuery";


const SignInScreen = props => {

    const classes = useStyle();

    const password = useFieldValidation("", () => {
    });
    const username = useFieldValidation("", () => {
    });

    const small = useXtraSmallSize();


    const {error} = useSelector(state => state.auth);

    const history = useHistory();
    const dispatch = useDispatch();

    const fields = [
        {
            label: 'Username',
            validation: username
        }, {
            label: 'Password',
            validation: password,
            type: 'password'
        }]

    const handleLogin = (e) => {
        e.preventDefault();
        dispatch(loginAction({
            username: username.value,
            password: password.value
        }, (authToken, refreshToken, email) => {
            saveTokenInStorage(authToken, refreshToken, email, username.value)
            if (props.location && props.location.state) {
                history.push(props.location.state.prevPath || props.location.state.from);
                return;
            }
            history.push("/");
        }))
    }

    return (
        <div className={classes.root}>
            <div className={classes.loginContainer}>
                <CenteredColumn>
                    <img src={small ? 'logo512.png' : "logo192.png"} style={{height: 192, width: 192}}/>
                    <FormComponent
                        title={'Log in to Pega FC24'}
                        fields={fields}
                        onSubmit={handleLogin}
                        buttonText={"Log In"}
                        stretchButton={true}
                        error={error}
                    />
                    <div className={classes.footer} style={{maxWidth: 230, textAlign: "center"}}>
                        <Typography variant={"caption"}>Would you like to take part in FC24 Pega League? </Typography>
                        <Typography variant={"caption"} color={"primary"} className={classes.link} onClick={() => {
                            history.push('/register')
                        }}>Sign up!</Typography>
                    </div>
                    <div className={classes.footer}>
                        <Typography variant={"caption"}>Made with ❤ by Mike 2024</Typography>
                    </div>
                </CenteredColumn>
            </div>
        </div>
    );
};

SignInScreen.propTypes = {};

const useStyle = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
    loginContainer: {
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        [theme.breakpoints.down('xs')]: {
            width: '90%'
        },
        [theme.breakpoints.up('xs')]: {
            maxWidth: 400,
            minWidth: 250
        }
    },
    footer: {
        marginTop: 5,
        minHeight: theme.typography.h5.fontSize
    },
    link: {
        "&:hover": {
            textDecoration: 'underline',
            cursor: 'pointer'
        }
    }
}));

export default SignInScreen;
