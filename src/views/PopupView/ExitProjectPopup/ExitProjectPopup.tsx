import React from 'react'
import './ExitProjectPopup.scss'
import {GenericYesNoPopup} from "../GenericYesNoPopup/GenericYesNoPopup";
import {
    updateActiveImageIndex,
    updateActiveLabelNameId,
    updateFirstLabelCreatedFlag,
    updateImageData,
    updateLabelNames
} from "../../../store/labels/actionCreators";
import {AppState} from "../../../store";
import {connect} from "react-redux";
import {ImageData, LabelName} from "../../../store/labels/types";
import {PopupActions} from "../../../logic/actions/PopupActions";
import {ProjectData} from "../../../store/general/types";
import {updateProjectData} from "../../../store/general/actionCreators";

interface IProps {
    updateActiveImageIndex: (activeImageIndex: number) => any;
    updateActiveLabelNameId: (activeLabelId: string) => any;
    updateLabelNames: (labelNames: LabelName[]) => any;
    updateImageData: (imageData: ImageData[]) => any;
    updateFirstLabelCreatedFlag: (firstLabelCreatedFlag: boolean) => any;
    updateProjectData: (projectData: ProjectData) => any;
}

const ExitProjectPopup: React.FC<IProps> = (props) => {
    const {
        updateActiveLabelNameId,
        updateLabelNames,
        updateActiveImageIndex,
        updateImageData,
        updateFirstLabelCreatedFlag,
        updateProjectData
    } = props;

    const renderContent = () => {
        return(
            <div className="ExitProjectPopupContent">
                <div className="Message">
                    确定退出本次标注吗？
                </div>
            </div>
        )
    };

    const onAccept = () => {
        updateActiveLabelNameId(null);
        updateLabelNames([]);
        updateProjectData({type: null, name: "my-project-name"});
        updateActiveImageIndex(null);
        updateImageData([]);
        updateFirstLabelCreatedFlag(false);
        PopupActions.close();
    };

    const onReject = () => {
        PopupActions.close();
    };

    return(
        <GenericYesNoPopup
            title={"退出编辑"}
            renderContent={renderContent}
            acceptLabel={"确定"}
            onAccept={onAccept}
            rejectLabel={"取消"}
            onReject={onReject}
        />)
};

const mapDispatchToProps = {
    updateActiveLabelNameId,
    updateLabelNames,
    updateProjectData,
    updateActiveImageIndex,
    updateImageData,
    updateFirstLabelCreatedFlag
};

const mapStateToProps = (state: AppState) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ExitProjectPopup);