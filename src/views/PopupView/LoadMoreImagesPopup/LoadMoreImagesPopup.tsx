import React from 'react'
import './LoadMoreImagesPopup.scss'
import {AppState} from "../../../store";
import {connect} from "react-redux";
import {addImageData} from "../../../store/labels/actionCreators";
import {GenericYesNoPopup} from "../GenericYesNoPopup/GenericYesNoPopup";
import {useDropzone} from "react-dropzone";
import {FileUtil} from "../../../utils/FileUtil";
import {ImageData} from "../../../store/labels/types";
import {AcceptedFileType} from "../../../data/enums/AcceptedFileType";
import {PopupActions} from "../../../logic/actions/PopupActions";

interface IProps {
    addImageData: (imageData: ImageData[]) => any;
}

const LoadMoreImagesPopup: React.FC<IProps> = ({addImageData}) => {
    const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
        accept: AcceptedFileType.IMAGE
    });

    const onAccept = () => {
        if (acceptedFiles.length > 0) {
            addImageData(acceptedFiles.map((fileData:File) => FileUtil.mapFileDataToImageData(fileData)));
            PopupActions.close();
        }
    };

    const onReject = () => {
        PopupActions.close();
    };

    const getDropZoneContent = () => {
        if (acceptedFiles.length === 0)
            return <>
                <input {...getInputProps()} />
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
                <img
                    draggable={false}
                    key={1}
                    alt={"uploaded"}
                    src={"img/box-closed.png"}
                />
                <p key={2} className="extraBold">{acceptedFiles.length} 张图片加载完成</p>
            </>;
    };

    const renderContent = () => {
        return(<div className="LoadMoreImagesPopupContent">
            <div {...getRootProps({className: 'DropZone'})}>
                {getDropZoneContent()}
            </div>
        </div>);
    };

    return(
        <GenericYesNoPopup
            title={"添加图片"}
            renderContent={renderContent}
            acceptLabel={"添加"}
            disableAcceptButton={acceptedFiles.length < 1}
            onAccept={onAccept}
            rejectLabel={"取消"}
            onReject={onReject}
        />
    );
};

const mapDispatchToProps = {
    addImageData
};

const mapStateToProps = (state: AppState) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoadMoreImagesPopup);