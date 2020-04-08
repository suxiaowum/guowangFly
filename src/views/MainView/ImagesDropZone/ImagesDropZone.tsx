import React from "react";
import './ImagesDropZone.scss';
import { useDropzone } from "react-dropzone";
import { TextButton } from "../../Common/TextButton/TextButton";
import { ImageData } from "../../../store/labels/types";
import { connect } from "react-redux";
import { addImageData, updateActiveImageIndex } from "../../../store/labels/actionCreators";
// import { addImageData, updateActiveImageIndex, updateImageDataById } from "../../../store/labels/actionCreators";
import { AppState } from "../../../store";
import { ProjectType } from "../../../data/enums/ProjectType";
import { FileUtil } from "../../../utils/FileUtil";
import { PopupWindowType } from "../../../data/enums/PopupWindowType";
import { updateActivePopupType, updateProjectData } from "../../../store/general/actionCreators";
import { AcceptedFileType } from "../../../data/enums/AcceptedFileType";
import { ProjectData } from "../../../store/general/types";
import $ from 'jquery';
import EXIF from "exif-js";
import { store } from "../../../index";
import { Settings } from '../../../settings/Settings';
import moment from "moment";
// import { settings } from "cluster";

interface IProps {
    updateActiveImageIndex: (activeImageIndex: number) => any;
    addImageData: (imageData: ImageData[]) => any;
    updateProjectData: (projectData: ProjectData) => any;
    updateActivePopupType: (activePopupType: PopupWindowType) => any;
    projectData: ProjectData;
}
var data = [];
const ImagesDropZone: React.FC<IProps> = ({ updateActiveImageIndex, addImageData, updateProjectData, updateActivePopupType, projectData }) => {
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        accept: AcceptedFileType.IMAGE,
    });


    const startEditor = (projectType: ProjectType) => {
        if (acceptedFiles.length > 0) {
            for (let x = 0; x < acceptedFiles.length; x++) {
                EXIF.getData(data[0][x], function () {
                    var a = EXIF.getTag(data[0][x], "GPSLatitude");
                    var b = EXIF.getTag(data[0][x], 'GPSLongitude');
                    var gaoq = EXIF.getTag(data[0][x], "GPSAltitude");
                    var cre = String(EXIF.getTag(data[0][x], "DateTimeOriginal"))
                    console.log(gaoq)
                    if (gaoq === undefined) {
                        alert("该图片没有GPS数据")
                        window.location.reload()
                    } else {
                        cre = cre.replace(/:/, "-")
                        cre = cre.replace(/:/, "-")
                        cre = moment(cre).format('YYYY-MM-DD HH:mm:ss')
                        var gao = Math.round(gaoq.numerator / gaoq.denominator);
                        var we = (a[0] + a[1] / 60 + a[2] / 60 / 60).toFixed(7);
                        var jing = (b[0] + b[1] / 60 + b[2] / 60 / 60).toFixed(7);
                        console.log(we + "," + jing)
                        console.log(cre)
                        $.ajax({
                            type: "post",
                            async: false,
                            url: Settings.AJAX_URL + "/v1/picture/calculate-by-gps?latitude=" + we + "&longitude=" + jing + "&uuid=" + store.getState().labels.imagesData[x].id,
                            success: function (msg) {
                                console.log(msg);
                                // console.log(store.getState().labels.imagesData)
                                if (msg.data.result === null) {
                                    alert("没有该条线路数据")
                                    window.location.reload()
                                } else {
                                    var imgData = store.getState().labels.imagesData[x];
                                    var msgData = msg.data.result[0];
                                    imgData.lineName = msgData.lineName;
                                    imgData.position = msgData.position;
                                    imgData.side = msgData.side;
                                    imgData.towerName = msgData.towerName;
                                    imgData.voltageLevel = msgData.voltageLevel;
                                    imgData.latitude = we;
                                    imgData.longitude = jing;
                                    imgData.height = gao;
                                    imgData.created = cre;
                                }

                            }
                        })
                    }

                })

            }
            updateProjectData({
                ...projectData,
                type: projectType
            });

            updateActiveImageIndex(0);
            addImageData(acceptedFiles.map((fileData: File) => FileUtil.mapFileDataToImageData(fileData)));
            console.log(data)
            // console.log(store.getState().labels.imagesData)
            updateActivePopupType(PopupWindowType.INSERT_LABEL_NAMES);

        }
    };
    $("#inputFile").change(
        function (e) {
            data.push(e.target.files)
        }
    )
    const getDropZoneContent = () => {
        if (acceptedFiles.length === 0)
            return <>
                <input {...getInputProps()} id="inputFile" />
                <img
                    draggable={false}
                    alt={"upload"}
                    src={"img/box-opened.png"}
                />
                <p className="extraBold">单击此处</p>
                <p></p>
                <p className="extraBold">添加图片</p>
            </>;
        else if (acceptedFiles.length === 1)
            return <>
                <img
                    draggable={false}
                    alt={"uploaded"}
                    src={"img/box-closed.png"}
                />
                <p className="extraBold">1 张图片加载完成</p>
            </>;
        else
            return <>
                {/* <input {...getInputProps()} /> */}
                <img
                    draggable={false}
                    key={1}
                    alt={"uploaded"}
                    src={"img/box-closed.png"}
                />
                <p key={2} className="extraBold">{acceptedFiles.length} 张图片加载完成</p>
            </>;
    };

    return (
        <div className="ImagesDropZone">
            <div {...getRootProps({ className: 'DropZone' })}>
                {getDropZoneContent()}
            </div>
            <div className="DropZoneButtons">
                <TextButton
                    label={"自动识别"}
                    isDisabled={true}
                    onClick={() => { }}
                />
                <TextButton
                    label={"人工识别"}
                    isDisabled={!acceptedFiles.length}
                    onClick={() => startEditor(ProjectType.OBJECT_DETECTION)}
                />
            </div>
        </div>
    )
};

const mapDispatchToProps = {
    updateActiveImageIndex,
    addImageData,
    updateProjectData,
    updateActivePopupType
};

const mapStateToProps = (state: AppState) => ({
    projectData: state.general.projectData
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ImagesDropZone);