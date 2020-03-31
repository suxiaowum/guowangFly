import React, { useState } from 'react';
import './MainView.scss';
// import { TextButton } from "../Common/TextButton/TextButton";
import classNames from 'classnames';
import { ISize } from "../../interfaces/ISize";
import { ImageButton } from "../Common/ImageButton/ImageButton";
import { ISocialMedia, SocialMediaData } from "../../data/info/SocialMediaData";
// import { EditorFeatureData, IEditorFeature } from "../../data/info/EditorFeatureData";
import { Tooltip } from "@material-ui/core";
import Fade from "@material-ui/core/Fade";
import withStyles from "@material-ui/core/styles/withStyles";
import ImagesDropZone from "./ImagesDropZone/ImagesDropZone";
// import $ from 'jquery';

const MainView: React.FC = () => {
    const [projectInProgress, setProjectInProgress] = useState(false);
    const [projectCanceled] = useState(false);

    // const startProject = () => {
    //     $("body").append(`<div style="display:none;" id="imgIndex"></div>`)
    //     // $.ajax({
    //     //     type:"post",
    //     //     url:`http://192.168.0.105:8080/v1/user/login?username=${$("#name").val()}&password=${$("#pass").val()}`,
    //     //     success:function(msg){
    //     //         if(msg.code===  0){
    //     //             setProjectInProgress(true);
    //     //             setProjectInProgress(true);
    //     //            }else{
    //     //                      alert(msg.data.message)
    //     //                  }
    //     //     }
    //     // })

    //     setProjectInProgress(true); //测试

    // };
    window.onload = () => {
        setProjectInProgress(true);

    }  
    //   const endProject = () => {
    //     setProjectInProgress(false);
    //     setProjectCanceled(true);
    // };

    const getClassName = () => {
        return classNames(
            "MainView", {
            "InProgress": projectInProgress,
            "Canceled": !projectInProgress && projectCanceled
        }
        );
    };

    const DarkTooltip = withStyles(theme => ({
        tooltip: {
            backgroundColor: "#171717",
            color: "#ffffff",
            boxShadow: theme.shadows[1],
            fontSize: 11,
            maxWidth: 120
        },
    }))(Tooltip);

    const getSocialMediaButtons = (size: ISize) => {
        return SocialMediaData.map((data: ISocialMedia, index: number) => {
            return <DarkTooltip
                key={index}
                disableFocusListener
                title={data.tooltipMessage}
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
                placement="left"
            >
                <div>
                    <ImageButton
                        buttonSize={size}
                        image={data.imageSrc}
                        imageAlt={data.imageAlt}
                        href={data.href}
                    />
                </div>
            </DarkTooltip>
        });
    };

    // const getEditorFeatureTiles = () => {
    //     return EditorFeatureData.map((data: IEditorFeature) => {
    //         return <div
    //             className="EditorFeaturesTiles"
    //             key={data.displayText}
    //         >
    //             <div
    //                 className="EditorFeaturesTilesWrapper"
    //             >
    //                 <img
    //                     draggable={false}
    //                     alt={data.imageAlt}
    //                     src={data.imageSrc}
    //                 />
    //                 <div className="EditorFeatureLabel">
    //                     {data.displayText}
    //                 </div>
    //             </div>
    //         </div>
    //     });
    // };

    return (
        <div className={getClassName()}>
            {/* <div className="Slider" id="lower">
                <div className="TriangleVertical">
                    <div className="TriangleVerticalContent" />
                </div>
            </div>

            <div className="Slider" id="upper">
                <div className="TriangleVertical">
                    <div className="TriangleVerticalContent" />
                </div>
            </div> */}

            {/* <div className="LeftColumn">
                <div className={"LogoWrapper"}>
                    <img
                        draggable={false}
                        alt={"main-logo"}
                        src={"img/main-image-color.png"}
                    />
                </div>
                <div className="EditorFeaturesWrapper"> */}
            {/* {getEditorFeatureTiles()} */}
            {/* <div className="TextInput">
                        <input type="text" value="admin" id="name" />
                        <label>用户名</label>
                        <div className="Bar">
                        </div>
                    </div>
                    <input type="text" disabled />


                    <div className="TextInput">
                        <input type="password" value="123456" id="pass" />
                        <label>密码</label>
                        <div className="Bar">
                        </div>
                    </div>

                </div>
                <div className="TriangleVertical">
                    <div className="TriangleVerticalContent" />
                </div>
                {projectInProgress && <TextButton
                    label={"退出"}
                    onClick={endProject}
                />}
            </div> */}
            <div className="RightColumn">
                <div />
                <ImagesDropZone />
                <div className="SocialMediaWrapper">
                    {getSocialMediaButtons({ width: 30, height: 30 })}
                </div>
                {/* {!projectInProgress && <TextButton
                    label={"登录"}
                    onClick={startProject}
                />} */}
            </div>
        </div>
    );
};

export default MainView;