import React, {useState} from 'react';
import EditIcon from "@material-ui/icons/Edit";
import {useXtraSmallSize} from "../../utils/SizeQuery";
import {Dialog, Link, Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import mainStyles from "../../misc/styles/MainStyles";
import {v4 as uuidv4} from 'uuid';



const ProfilePicture = ({changePictureOverlayEnabled = false, avatarHash, size = 'large', overrideSize}) => {

    const classes = mainStyles();
    const [profilePictureInfoOpen, setProfilePictureInfoOpen] = useState(false);
    const [pictureOverlay, setPictureOverlay] = useState(false);
    const small = useXtraSmallSize();
    const clipName = uuidv4();

    let baseSize;

    switch (size) {
        case 'large':
            baseSize = 160;
            break;
        case 'medium':
            baseSize = 80;
            break;
        case 'small':
            baseSize = 40;
            break
        case 'tiny':
            baseSize = 30;
            break;
        case 'micro':
            baseSize = 10;
            break;
        default:
            baseSize = 160;
    }

    if (overrideSize) {
        baseSize = overrideSize;
    }

    console.log()
    return (
        <div style={{
            clipPath: `url(#${clipName}2)`,
            border: "3px dashed #4caf50",
            height: baseSize,
            width: baseSize,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <img style={{width: baseSize, height: baseSize}}
                 src={`https://www.gravatar.com/avatar/${avatarHash}?s=${small ? baseSize * 2 : baseSize}&d=${
                     encodeURIComponent(small ? `${window.location.href.replace(window.location.pathname,"")}/defaultProfile2x.png`
                         : `${window.location.href.replace(window.location.pathname,"")}/defaultProfile.png`)}`}/>
            {changePictureOverlayEnabled &&
            <EditIcon fontSize={"large"} style={{
                position: 'relative', top: -95, left: 0, display: pictureOverlay || small ? 'block' : 'none'
            }}
            />}
            {changePictureOverlayEnabled && <div onMouseEnter={() => {
                setPictureOverlay(true)
            }} onMouseLeave={() => {
                setPictureOverlay(false)
            }} onClick={() => setProfilePictureInfoOpen(true)}
                                                 style={{
                                                     minHeight: 180,
                                                     width: 170,
                                                     position: 'relative',
                                                     top: -200,
                                                     left: 1,
                                                     backgroundColor: pictureOverlay ? "rgba(0,0,0,0.3)" : 'transparent',
                                                     cursor: 'pointer'
                                                 }}/>}
            {changePictureOverlayEnabled && <Dialog open={profilePictureInfoOpen}>
                <div className={classes.standardBorder} style={{margin: 0}}>
                    <Typography variant={"h5"}>How to change profile picture?</Typography>
                    <Typography>Profile pictures used by FC24 Pega are global avatars attached to email
                        addresses. To change profile picture visit <Link
                            onClick={() => window.open('https://en.gravatar.com/')}>Gravatar</Link> and create an
                        avatar attached to your email. For more information see <Link
                            onClick={() => window.open('https://makeawebsitehub.com/gravatar/')}>details.</Link></Typography>
                    <Button onClick={() => setProfilePictureInfoOpen(false)}>Close</Button>
                </div>
            </Dialog>}
        </div>
    );
};

export default ProfilePicture;
