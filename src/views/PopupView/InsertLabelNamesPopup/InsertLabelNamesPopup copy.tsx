import React, { useState } from 'react'
import './InsertLabelNamesPopup.scss'
import { GenericYesNoPopup } from "../GenericYesNoPopup/GenericYesNoPopup";
import { PopupWindowType } from "../../../data/enums/PopupWindowType";
import { updateLabelNames } from "../../../store/labels/actionCreators";
import { updateActivePopupType } from "../../../store/general/actionCreators";
import { AppState } from "../../../store";
import { connect } from "react-redux";
// import Scrollbars from 'react-custom-scrollbars';
import TextInput from "../../Common/TextInput/TextInput";
import { ImageButton } from "../../Common/ImageButton/ImageButton";
import uuidv1 from 'uuid/v1';
import { LabelName } from "../../../store/labels/types";
import { LabelUtil } from "../../../utils/LabelUtil";
import { LabelsSelector } from "../../../store/selectors/LabelsSelector";
import { LabelActions } from "../../../logic/actions/LabelActions";
import { store } from "../../../index";
import $ from 'jquery';
import { func } from 'prop-types';
import { execFile } from 'child_process';
import EXIF from "exif-js";
import {Settings} from '../../../settings/Settings';
// import { cos } from '@tensorflow/tfjs-core';
interface IProps {
    updateActivePopupType: (activePopupType: PopupWindowType) => any;
    updateLabelNames: (labels: LabelName[]) => any;
    isUpdate: boolean;

}

const InsertLabelNamesPopup: React.FC<IProps> = ({ updateActivePopupType, updateLabelNames, isUpdate }) => {
    const initialLabels = LabelUtil.convertLabelNamesListToMap(LabelsSelector.getLabelNames());
    const [labelNames, setLabelNames] = useState(initialLabels);

    const addHandle = () => {
        const newLabelNames = { ...labelNames, [uuidv1()]: "" };
        setLabelNames(newLabelNames);
    };

    // const deleteHandle = (key: string) => {
    //     const newLabelNames = {...labelNames};
    //     delete newLabelNames[key];
    //     setLabelNames(newLabelNames);
    // };  

    const labelInputs = Object.keys(labelNames).map((key: string) => {
        return <div className="LabelEntry" key={key}>
            <TextInput
                key={key}
                value={labelNames[key]}
                isPassword={false}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange(key, event.target.value)}
                label={"Insert label"}
            />
            {/* <ImageButton
                    image={"ico/trash.png"}
                    imageAlt={"remove_label"}
                    buttonSize={{width: 30, height: 30}}
                    onClick={() => deleteHandle(key)}
                /> */}
        </div>
    });

    const onChange = (key: string, value: string) => {
        const newLabelNames = { ...labelNames, [key]: value };
        console.log(newLabelNames)
        setLabelNames(newLabelNames);

    };

    const onCreateAccept = () => {
        const labelNamesList: string[] = extractLabelNamesList();
        console.log(labelNamesList)
        // if (labelNamesList.length > 0) {
        //     updateLabelNames(LabelUtil.convertMapToLabelNamesList(labelNames));
        // }
        updateLabelNames(LabelUtil.convertMapToLabelNamesList(labelNames));
        // updateLabelNames(LabelUtil.convertMapToLabelNamesList(labelNames));
        // updateActivePopupType(PopupWindowType.LOAD_AI_MODEL);
        //此处上传任务名称
        var TaskData = {
            "name": $("#name").val(),
            "lineName": $("#lineName").val(),
            "taskType": $("#taskType").val(),
            "operator": $("#operator").val(),
            "assessor": $("#assessor").val(),
            "businessNature": $("#businessNature").val(),
            "droneModel": $("#droneModel").val(),
            "droneType": $("#droneType").val(),
            "droneCode": $("#droneCode").val(),
            "operatedAt": $("#operatedAt").val() + "T00:00:00Z"
        }
        if (TaskData.name === "" || TaskData.lineName === "" || TaskData.taskType === "" || TaskData.operator === "" || TaskData.assessor === "" || TaskData.businessNature === "" || TaskData.droneModel === "" || TaskData.droneType === "" || TaskData.droneCode === "") {
            alert("请填写完整信息")

        } else {
            var TaskDataS = {
                "name": $("#name").val(),
                "lineName": $("#lineName").val(),
                "taskType": $("#taskType").val(),
                "operator": $("#operator").val(),
                "assessor": $("#assessor").val(),
                "businessNature": $("#businessNature").val(),
                "droneModel": $("#droneModel").val(),
                "droneType": $("#droneType").val(),
                "droneCode": $("#droneCode").val(),
                "operatedAt": $("#operatedAt").val() + "T00:00:00Z"
            }
            console.log(TaskDataS)
            console.log("传输数据")
            $.ajax({
                type: "post",
                url: Settings.AJAX_URL+"/v1/task/create",
                data: JSON.stringify(TaskDataS),
                dataType: 'json',
                success: function (msg) {
                    console.log(msg);                   
                }
            })
        }

            $("body").append(`<div id=imgId style="display:none">${store.getState().labels.imagesData[0].id}</div>`)
            // for (let x = 0; x < $(".Image").length; x++) {
            //     EXIF.getData($('.Image')[x], function () {
            //         var a = EXIF.getTag(document.getElementsByClassName('Image')[x], "GPSLatitude");
            //         var b = EXIF.getTag(document.getElementsByClassName('Image')[x], 'GPSLongitude');
            //         console.log(a)
            //         console.log(b)
            //         var nh = a[0].numerator
            //         var nm = a[1].numerator
            //         var ns = a[2].numerator / 10000
            //         var wh = b[0].numerator
            //         var wm = b[1].numerator
            //         var ws = b[2].numerator / 10000
            //         var we = String((wh + (wm / 60 + ws / 3600)).toFixed(7));
            //         var ne = String((nh + (nm / 60 + ns / 3600)).toFixed(7));
            //         console.log(we)
            //         console.log(ne)
            //         var Imgdata = store.getState().labels.imagesData;
            //         var imgId = Imgdata[x].id
            //         $.ajax({
            //             type: "post",
            //             url: Settings.AJAX_URL+"/v1/picture/calculate-by-gps?latitude=" + ne + "&longitude=" + we + "&uuid=" + imgId,
            //             // ,
            //             // Settings.AJAX_URL+"/v1/picture/calculate-by-gps?latitude=117.8607216&longitude=36.0092927"
            //             success: function (msg) {
            //                 console.log(msg);
            //                 if (msg.code == 0) {
            //                     $("body").append("<div style='display:none' class=" + imgId + " id=" + msg.data.result[0].pictureID + "><p id = imgT>" + msg.data.result[0].towers.towerNum + "</p></div>");
            //                     $("#" + imgId).html("<p>" + msg.data.result[0].towers.lineName + "</p><p>" + msg.data.result[0].towers.position + "侧</p><p>" + msg.data.result[0].towers.side + "</p><p>杆塔号" + msg.data.result[0].towers.towerNum + "</p>");

            //                 }

            //             }
            //         })
            //     });
            // }



            updateActivePopupType(null)//测试
            // console.log(store.getState().labels.imagesData)




        };

        const onUpdateAccept = () => {
            console.log(1)
            const labelNamesList: string[] = extractLabelNamesList();
            console.log(labelNamesList)
            const updatedLabelNamesList: LabelName[] = LabelUtil.convertMapToLabelNamesList(labelNames);
            console.log(updatedLabelNamesList)
            const missingIds: string[] = LabelUtil.labelNamesIdsDiff(LabelsSelector.getLabelNames(), updatedLabelNamesList);
            LabelActions.removeLabelNames(missingIds);
            if (labelNamesList.length > 0) {
                updateLabelNames(LabelUtil.convertMapToLabelNamesList(labelNames));
                updateActivePopupType(null);
            }
        };

        const onCreateReject = () => {
            updateActivePopupType(PopupWindowType.LOAD_LABEL_NAMES);
        };

        const onUpdateReject = () => {
            updateActivePopupType(null);
        };


        const extractLabelNamesList = (): string[] => {
            console.log();

            return Object.values(labelNames).filter((value => !!value)) as string[];

        };
        const lineNameCenter = () => {
            $("#lineName").keyup(
                function () {
                    var data = $("#lineName").val();
                    console.log(data)
                    $.ajax({
                        type: "post",
                        url: Settings.AJAX_URL+"/v1/tower/search-line-name?key-world=" + data,
                        success: function (msg) {
                            console.log(msg);
                            $("#lineNameCenter").html("")
                            for (let s = 0; s < msg.data.length; s++) {

                                $("#lineNameCenter").append(`<li>${msg.data[s]}</li>`)
                            }
                            $("#lineNameCenter").css("display", "block")
                            $("#lineNameCenter li").click(
                                function (this) {
                                    $("#lineName").val($(this).html())
                                    $("#lineNameCenter li").remove()
                                    $("#lineNameCenter").css("display", "none")
                                }
                            )
                        }
                    })
                }
            )
        }
        const operatorCenter = () => {
            $("#operator").keyup(
                function () {
                    var data = $("#operator").val();
                    console.log(data)
                    $.ajax({
                        type: "post",
                        url: Settings.AJAX_URL+"/v1/user/search-name?key-world=" + data,
                        success: function (msg) {
                            console.log(msg);
                            $("#operatorCenter").html("")
                            for (let s = 0; s < msg.data.length; s++) {

                                $("#operatorCenter").append(`<li>${msg.data[s]}</li>`)
                            }
                            $("#operatorCenter").css("display", "block")
                            $("#operatorCenter li").click(
                                function (this) {
                                    $("#operator").val($(this).html())
                                    $("#operatorCenter li").remove()
                                    $("#operatorCenter").css("display", "none")
                                }
                            )
                        }
                    })
                }
            )
        }
        const taskTypeCenter = () => {
            $("#taskTypeCenter li").css("display", "block");
            $("#taskTypeCenter li").click(
                function (this) {
                    $("#taskType").val($(this).html())
                    $("#taskTypeCenter li").css("display", "none");
                }
            )
        }
        const businessNatureCenter = () => {
            $("#businessNatureCenter li").css("display", "block");
            $("#businessNatureCenter li").click(
                function (this) {
                    $("#businessNature").val($(this).html())
                    $("#businessNatureCenter li").css("display", "none");
                }
            )
        }



        const droneModelCenter = () => {
            $("#droneModelCenter li").css("display", "block");
            $("#droneModelCenter li").click(
                function (this) {
                    $("#droneModel").val($(this).html())
                    $("#droneModelCenter li").css("display", "none");
                }
            )
        }

        const droneTypeCenter = () => {
            $("#droneTypeCenter li").css("display", "block");
            $("#droneTypeCenter li").click(
                function (this) {
                    $("#droneType").val($(this).html())
                    $("#droneTypeCenter li").css("display", "none");
                }
            )
        }

        const droneCodeCenter = () => {
            $("#droneCodeCenter li").css("display", "block");
            $("#droneCodeCenter li").click(
                function (this) {
                    $("#droneCode").val($(this).html())
                    $("#droneCodeCenter li").css("display", "none");
                }
            )
        }




        const renderContent = () => {
            return (<div className="InsertLabelNamesPopup">
                <div className="LeftContainer">
                    <ImageButton
                        image={"ico/plus.png"}
                        imageAlt={"plus"}
                        buttonSize={{ width: 40, height: 40 }}
                        padding={25}
                        onClick={addHandle}
                    />
                </div>

                <div className="RightContainer">
                    <div className="TextInput">
                        <input id="name" type="text" placeholder="请输入任务名" />
                        <label>任务名称</label>
                        <div className="Bar">

                        </div>

                    </div>
                    <div className="TextInput">
                        <input id="lineName" type="text" placeholder="请输入线路名" onClick={lineNameCenter} />
                        <label>线路名称</label>
                        <div className="Bar">
                        </div>
                        <ul id="lineNameCenter">

                        </ul>
                    </div> <div className="TextInput">
                        <input id="taskType" type="text" value="线路验收" onClick={taskTypeCenter} />
                        <label>任务类型</label>
                        <div className="Bar">
                        </div>
                        <ul id="taskTypeCenter">
                            <li>线路验收</li>
                            <li>杆塔巡视</li>
                            <li>故障巡视</li>
                        </ul>
                    </div> <div className="TextInput">
                        <input id="operator" type="text" placeholder="请输入飞行人员" onClick={operatorCenter} />
                        <label>飞行人员</label>
                        <div className="Bar">
                        </div>
                        <ul id="operatorCenter">

                        </ul>
                    </div>
                    <div className="TextInput">
                        <input id="assessor" type="text" value="王伟" />
                        <label>审核人员</label>
                        <div className="Bar">
                        </div>
                    </div>
                    <div className="TextInput">
                        <input id="businessNature" type="text" value="自有机型" onClick={businessNatureCenter} />
                        <label>业务性质</label>
                        <div className="Bar">
                        </div>
                        <ul id="businessNatureCenter">
                            <li>自有机型</li>
                            <li>租赁机型</li>
                            <li>外包业务</li>
                        </ul>
                    </div><div className="TextInput">
                        <input id="droneModel" type="text" value="悟-II" onClick={droneModelCenter} />
                        <label>无人机型号</label>
                        <div className="Bar">
                        </div>
                        <ul id="droneModelCenter">
                            <li>悟-II</li>
                            <li>精灵4RTK</li>
                            <li>精灵M200</li>
                        </ul>
                    </div><div className="TextInput">
                        <input id="droneType" type="text" value="小型旋翼" onClick={droneTypeCenter} />
                        <label>无人机类型</label>
                        <div className="Bar">
                        </div>
                        <ul id="droneTypeCenter">
                            <li>小型旋翼</li>
                            <li>中型旋翼</li>
                            <li>大型旋翼</li>
                            <li>固定翼</li>
                        </ul>
                    </div><div className="TextInput">
                        <input id="droneCode" type="text" value="悟-II" onClick={droneCodeCenter} />
                        <label>无人机编码</label>
                        <div className="Bar">
                        </div>
                        <ul id="droneCodeCenter">
                            <li>悟-II</li>
                            <li>精灵4RTK</li>
                            <li>精灵M200</li>
                        </ul>
                    </div><div className="TextInput">
                        <input id="operatedAt" type="text" placeholder="2019-10-14" />
                        <label>时间</label>
                        <div className="Bar">
                        </div>
                    </div>

                    {/* <input type="text" disabled /> */}
                </div>
            </div>);
        };

        return (
            <GenericYesNoPopup
                title={isUpdate ? "Edit label names list" : "新建任务"}
                renderContent={renderContent}
                acceptLabel={isUpdate ? "确定" : "开始任务"}
                onAccept={isUpdate ? onUpdateAccept : onCreateAccept}
                rejectLabel={isUpdate ? "取消" : "取消"}
                onReject={isUpdate ? onUpdateReject : onUpdateReject}
            />)
    };

    const mapDispatchToProps = {
        updateActivePopupType,
        updateLabelNames
    };

    const mapStateToProps = (state: AppState) => ({
    });

    export default connect(
        mapStateToProps,
        mapDispatchToProps
    )(InsertLabelNamesPopup);
