import React from 'react';
import './TopNavigationBar.scss';
import StateBar from "../StateBar/StateBar";
import { UnderlineTextButton } from "../../Common/UnderlineTextButton/UnderlineTextButton";
import { PopupWindowType } from "../../../data/enums/PopupWindowType";
import { AppState } from "../../../store";
import { connect } from "react-redux";
import { updateActivePopupType, updateProjectData } from "../../../store/general/actionCreators";
import TextInput from "../../Common/TextInput/TextInput";
// import { ImageButton } from "../../Common/ImageButton/ImageButton";
import { Settings } from "../../../settings/Settings";
import { ProjectData } from "../../../store/general/types";
// import { func } from 'prop-types';
import $ from 'jquery';
import { store } from "../../../index";


interface IProps {
    updateActivePopupType: (activePopupType: PopupWindowType) => any;
    updateProjectData: (projectData: ProjectData) => any;
    projectData: ProjectData;
}

const TopNavigationBar: React.FC<IProps> = ({ updateActivePopupType, updateProjectData, projectData }) => {
    const onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        event.target.setSelectionRange(0, event.target.value.length);
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
            .toLowerCase()
            .replace(' ', '-');

        updateProjectData({
            ...projectData,
            name: value
        })
    };
    const upImg = () => {
        var data = store.getState().labels.imagesData;
        for (let index = 0; index < data.length; index++) {
            var file = data[index].fileData;
            // console.log(file)
            var form = new FormData();
            var taskId = store.getState().labels.taskId
            var faultsVal = []
            for (let n = 0; n < data[index].labelRects.length; n++) {
                var d = data[index].labelRects[n]
                var a = {
                    "faultClass": "普通缺陷",
                    "faultLevel": d.faultLevel,
                    "faultCategory": d.faultCategory,
                    "faultElement": d.faultElement,
                    "faultPart": d.faultPart,
                    "faultType": d.faultType,
                    "faultRepresentation": d.faultRepresentation,
                    "faultDesc": "",
                    "towerName": data[index].towerName,
                    "obderBy": 1,
                    "towerNum": data[index].towerNum,
                    "drawType": 0,
                    "drawX": Math.round(d.rect.x),
                    "drawY": Math.round(d.rect.y),
                    "drawWidth": Math.round(d.rect.width),
                    "drawHeight": Math.round(d.rect.height),
                }
                faultsVal.push(a);

            }
            // console.log(faultsVal)
            var faultString = JSON.stringify(faultsVal)
            form.set("file", file);
            form.append("task-id", String(taskId));
            form.append("voltage-level", data[index].voltageLevel);
            form.append("line-name", data[index].lineName);
            form.append("tower-name", data[index].towerName);
            form.append("position", data[index].position);
            form.append("side", data[index].side);
            form.append("picture-height", String(data[index].height));
            form.append("latitude", String(data[index].latitude));
            form.append("longitude", String(data[index].longitude));
            form.append("picture-created-at", data[index].created);
            form.append("faults", faultString)
            // console.log(faultString)
            // console.log(data[index].labelRects)
            // console.log(form.getAll("picture-created-at"))
            var xhr = new XMLHttpRequest();
            xhr.open("post", Settings.AJAX_URL + "/v1/picture/upload", true);
            xhr.responseType = "json"
            xhr.onload = function (msg) {
                console.log(msg.currentTarget)
                var a = msg.currentTarget;
                console.log(a)
            }   
            xhr.upload.onprogress = function (evt) {
                console.log(evt.total)
            }
            xhr.send(form);
        }

    }

    return (
        <div className="TopNavigationBar">
            <StateBar />
            <div className="TopNavigationBarWrapper">
                <div>
                    <div
                        className="Header"
                        onClick={() => updateActivePopupType(PopupWindowType.EXIT_PROJECT)}
                    >
                        <img
                            draggable={false}
                            alt={"make-sense"}
                            src={"/make-sense-ico-transparent.png"}
                        />
                        无人机图像处理
                    </div>
                </div>
                <div className="NavigationBarGroupWrapper">
                    <div className="ProjectName"></div>
                    <TextInput
                        key={"ProjectName"}
                        isPassword={false}
                        value="无人机图像处理工具"
                        onChange={onChange}
                        onFocus={onFocus}
                    />
                </div>
                <div className="NavigationBarGroupWrapper">
                    {/* <UnderlineTextButton
                        label={""}
                        under={true}
                        onClick={() => updateActivePopupType(PopupWindowType.UPDATE_LABEL_NAMES)}
                    /> */}
                    <UnderlineTextButton
                        label={"上传图片"}
                        under={true}
                        onClick={() => upImg()}
                    />
                    <UnderlineTextButton
                        label={"生成作业清单"}
                        under={true}
                        onClick={() => {

                            //console.log(1)
                            $.ajax({
                                type: "post",
                                url: Settings.AJAX_URL + "/v1/task/export-task-list?start-time=2010-01-01&end-time=2019x-10-31",
                                success: function (msg) {
                                    //console.log(msg)
                                    window.open(msg.data)
                                }
                            })
                        }}
                    />
                    <UnderlineTextButton
                        label={"生成月报表"}
                        under={true}
                        onClick={() =>
                        // updateActivePopupType(PopupWindowType.EXPORT_LABELS)
                        {
                            console.log(1)
                            $.ajax({
                                type: "post",
                                url: Settings.AJAX_URL + "/v1/task/export-task-detail-list?start-time=2010-01-01&end-time=2020-03-31",
                                success: function (msg) {
                                    //  console.log(msg)
                                    window.open(msg.data)
                                }
                            })
                        }
                        }
                    />
                    {/* <ImageButton
                        image={"img/github-logo.png"}
                        imageAlt={"github-logo.png"}
                        buttonSize={{width: 30, height: 30}}
                        href={Settings.GITHUB_URL}
                    /> */}
                </div>
            </div>
        </div>
    );
};

const mapDispatchToProps = {
    updateActivePopupType,
    updateProjectData
};

const mapStateToProps = (state: AppState) => ({
    projectData: state.general.projectData
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TopNavigationBar);