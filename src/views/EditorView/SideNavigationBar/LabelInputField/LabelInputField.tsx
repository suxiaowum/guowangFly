import React from 'react';
import { ISize } from "../../../../interfaces/ISize";
import './LabelInputField.scss';
import classNames from "classnames";
import { ImageButton } from "../../../Common/ImageButton/ImageButton";
import { IRect } from "../../../../interfaces/IRect";
import { IPoint } from "../../../../interfaces/IPoint";
import { RectUtil } from "../../../../utils/RectUtil";
import { AppState } from "../../../../store";
import { connect } from "react-redux";
import { updateActiveLabelId, updateHighlightedLabelId } from "../../../../store/labels/actionCreators";
import Scrollbars from 'react-custom-scrollbars';
import { EventType } from "../../../../data/enums/EventType";
import { LabelName } from "../../../../store/labels/types";
import { LabelsSelector } from "../../../../store/selectors/LabelsSelector";
import { PopupWindowType } from "../../../../data/enums/PopupWindowType";
import { updateActivePopupType } from "../../../../store/general/actionCreators";
import { Settings } from "../../../../settings/Settings";
import { store } from "../../../../index";

import $ from 'jquery';
// import { labelsReducer } from '../../../../store/labels/reducer';
// import { labelsReducer } from '../../../../store/labels/reducer';
interface IProps {
    size: ISize;
    isActive: boolean;
    isHighlighted: boolean;
    id: string;
    value: LabelName;
    options: LabelName[];
    onDelete: (id: string) => any;
    onSelectLabel: (labelRectId: string, labelNameId: string) => any;
    updateHighlightedLabelId: (highlightedLabelId: string) => any;
    updateActiveLabelId: (highlightedLabelId: string) => any;
    updateActivePopupType: (activePopupType: PopupWindowType) => any;

}

interface IState {
    animate: boolean;
    isOpen: boolean;
    isActive: boolean;
    msgBox: boolean;
    one: boolean;
    funC: any;
    msgVal: [];
}

class LabelInputField extends React.Component<IProps, IState> {
    private dropdownOptionHeight: number = 30;
    private dropdownOptionCount: number = 6;
    private dropdownMargin: number = 4;
    private dropdownLabel: HTMLDivElement;
    private dropdown: HTMLDivElement;

    public constructor(props) {
        super(props);
        this.state = {
            animate: false,
            isOpen: false,
            isActive: false,
            msgBox: false,
            one: false,
            msgVal: [],
            funC: "",
        }
    }

    public componentDidMount(): void {
        requestAnimationFrame(() => {
            this.setState({ animate: true });
        });
    }

    private getClassName() {
        return classNames(
            "LabelInputField",
            {
                "loaded": this.state.animate,
                "active": this.props.isActive,
                "highlighted": this.props.isHighlighted
            }
        );
    }
    private msgCenter = (e) => {
        e.stopPropagation();
        for (let v = 0; v < LabelsSelector.getActiveImageData().labelRects.length; v++) {
            if (LabelsSelector.getActiveImageData().labelRects[v].id === this.props.id) {
                var defectVal = LabelsSelector.getActiveImageData().labelRects[v]
            }
        }
        defectVal.faultCategory = $(e.target).html();
        $("#valueone").html($(e.target).html());
        $.ajax({
            type: "post",
            async: false,
            url: `${Settings.AJAX_URL}/v1/fault/get-element-by-category?category=${$(e.target).html()}`,
            success: (msg) => {
                this.setState({ msgVal: msg.data.elements })
                this.setState({ funC: this.msgCenter2 })
            }
        })
    }

    private msgCenter2 = (e) => {
        e.stopPropagation();
        for (let v = 0; v < LabelsSelector.getActiveImageData().labelRects.length; v++) {
            if (LabelsSelector.getActiveImageData().labelRects[v].id === this.props.id) {
                var defectVal = LabelsSelector.getActiveImageData().labelRects[v]
            }
        }
        defectVal.faultElement = $(e.target).html();
        $("#valuetwo").html($(e.target).html());
        $.ajax({
            type: "post",
            async: false,
            url: `${Settings.AJAX_URL}/v1/fault/get-part-by-category-element?category=${defectVal.faultCategory}&element=${$(e.target).html()}`,
            success: (msg) => {
                this.setState({ msgVal: msg.data.parts });
                this.setState({ funC: this.msgCenter3 })
            }
        })
    }

    private msgCenter3 = (e) => {
        e.stopPropagation();
        for (let v = 0; v < LabelsSelector.getActiveImageData().labelRects.length; v++) {
            if (LabelsSelector.getActiveImageData().labelRects[v].id === this.props.id) {
                var defectVal = LabelsSelector.getActiveImageData().labelRects[v]
            }
        }
        defectVal.faultPart = $(e.target).html();
        $("#valuethree").html($(e.target).html());
        $.ajax({
            type: "post",
            async: false,
            url: `${Settings.AJAX_URL}/v1/fault/get-fault-type-by-category-element-part?category=${defectVal.faultCategory}&element=${defectVal.faultElement}&part=${$(e.target).html()}`,
            success: (msg) => {
                this.setState({ msgVal: msg.data.faultTypes });
                this.setState({ funC: this.msgCenter4 })
            }
        })
    }

    private msgCenter4 = (e) => {
        e.stopPropagation();
        for (let v = 0; v < LabelsSelector.getActiveImageData().labelRects.length; v++) {
            if (LabelsSelector.getActiveImageData().labelRects[v].id === this.props.id) {
                var defectVal = LabelsSelector.getActiveImageData().labelRects[v]
            }
        }
        defectVal.faultType = $(e.target).html();
        $("#valuefore").html($(e.target).html());
        $.ajax({
            type: "post",
            async: false,
            url: `${Settings.AJAX_URL}/v1/fault/get-representation-by-category-element-part-fault-type?category=${defectVal.faultCategory}&element=${defectVal.faultElement}&part=${defectVal.faultPart}&fault-type=${$(e.target).html()}`,
            success: (msg) => {
                this.setState({ msgVal: msg.data.representations });
                this.setState({ funC: this.msgCenter5 })
            }
        })
    }

    private msgCenter5 = (e) => {
        e.stopPropagation();
        for (let v = 0; v < LabelsSelector.getActiveImageData().labelRects.length; v++) {
            if (LabelsSelector.getActiveImageData().labelRects[v].id === this.props.id) {
                var defectVal = LabelsSelector.getActiveImageData().labelRects[v]
            }
        }
        defectVal.faultRepresentation = $(e.target).html();
        $("#valuefive").val($(e.target).html());
        $.ajax({
            type: "post",
            async: true,
            url: `${Settings.AJAX_URL}/v1/fault/get-fault-level-by-category-element-part-fault-type-representation?category=${defectVal.faultCategory}&element=${defectVal.faultElement}&part=${defectVal.faultPart}&fault-type=${defectVal.faultType}&representation=${defectVal.faultRepresentation}`,
            success: (msg) => {
                this.setState({ msgVal: msg.data.faultLevels });
                this.setState({ funC: this.msgCenter6 })
            }
        })
    }

    private msgCenter6 = (e) => {
        e.stopPropagation();
        for (let v = 0; v < LabelsSelector.getActiveImageData().labelRects.length; v++) {
            if (LabelsSelector.getActiveImageData().labelRects[v].id === this.props.id) {
                var defectVal = LabelsSelector.getActiveImageData().labelRects[v]
            }
        }
        if ($(e.target).html()) {
            defectVal.faultLevel = $(e.target).html();
            $("#valuesix").html($(e.target).html());
        } else {
            defectVal.faultLevel = "一般"
        }
        this.setState({ msgBox: false })
        console.log(LabelsSelector.getActiveImageData())
    }

    private openDropdown = () => {
        this.setState({ msgBox: true })
        this.setState({ one: true })
        this.setState({ funC: this.msgCenter })
        console.log(this.state.msgBox)
        $.ajax({
            type: "post",
            async: false,
            url: Settings.AJAX_URL + "/v1/fault/get-category",
            success: (msg) => {
                store.getState().labels.labels = msg.data.categories
                this.setState({ msgVal: msg.data.categories });
            }
        })
        this.setState({ isActive: true })
    };

    private upTrue = (e) => {
        e.stopPropagation();
        this.setState({ msgBox: false })
        for (let v = 0; v < LabelsSelector.getActiveImageData().labelRects.length; v++) {
            if (LabelsSelector.getActiveImageData().labelRects[v].id === this.props.id) {
                var defectVal = LabelsSelector.getActiveImageData().labelRects[v]
            }
        }
        defectVal.faultLevel = "一般"
    }

    private upFalse = (e) => {
        e.stopPropagation();
        this.setState({ msgBox: false })
    }

    private closeDropdown = (event: MouseEvent) => {
        const mousePosition: IPoint = { x: event.clientX, y: event.clientY };
        const clientRect = this.dropdown.getBoundingClientRect();
        const dropDownRect: IRect = {
            x: clientRect.left,
            y: clientRect.top,
            width: clientRect.width,
            height: clientRect.height
        };

        if (!RectUtil.isPointInside(dropDownRect, mousePosition)) {
            this.setState({ isOpen: false });
            window.removeEventListener(EventType.MOUSE_DOWN, this.closeDropdown)
        }
    };

    private getDropdownStyle = (): React.CSSProperties => {
        const clientRect = this.dropdownLabel.getBoundingClientRect();
        const height: number = Math.min(this.props.options.length, this.dropdownOptionCount) * this.dropdownOptionHeight;
        const style = {
            width: clientRect.width,
            height: height,
            left: clientRect.left
        };

        if (window.innerHeight * 2 / 3 < clientRect.top)
            return Object.assign(style, { top: clientRect.top - this.dropdownMargin - height });
        else
            return Object.assign(style, { top: clientRect.bottom + this.dropdownMargin });
    };

    private getDropdownOptions = () => {

        const onClick = (id: string, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            this.setState({ isOpen: false });
            window.removeEventListener(EventType.MOUSE_DOWN, this.closeDropdown);
            this.props.onSelectLabel(this.props.id, id);
            this.props.updateHighlightedLabelId(null);
            this.props.updateActiveLabelId(this.props.id);
            event.stopPropagation();

        };

        return this.props.options.map((option: LabelName) => {
            //  console.log(this.props.options)
            return <div
                className="DropdownOption"
                key={option.id}
                style={{ height: this.dropdownOptionHeight }}
                onClick={(event) => onClick(option.id, event)}
            >

                {option.name}
            </div>

        })
    };

    private mouseEnterHandler = () => {
        this.props.updateHighlightedLabelId(this.props.id);
    };

    private mouseLeaveHandler = () => {
        this.props.updateHighlightedLabelId(null);
    };

    private onClickHandler = () => {
        console.log(this.props.id)
        console.log(1111)
        // this.props.updateActiveLabelId(this.props.id);

    };
    public render() {
        const { size, id, value, onDelete } = this.props;
        return (
            <div
                className={this.getClassName()}
                style={{
                    width: size.width,
                    height: size.height,
                }}
                key={id}
                onMouseEnter={this.mouseEnterHandler}
                onMouseLeave={this.mouseLeaveHandler}
                onClick={this.onClickHandler}
            >
                <div
                    className="LabelInputFieldWrapper"
                    style={{
                        width: size.width,
                        height: size.height,
                    }}
                >
                    <div className="Marker" />
                    <div className="Content">
                        <div className="ContentWrapper">

                            <div className="DropdownLabel"
                                ref={ref => this.dropdownLabel = ref}
                                onClick={this.openDropdown}
                            >
                                {value ? value.name : "选择缺陷"}
                            </div>
                            {this.state.msgBox && <div id="defectList">
                                <div className="defectListBox">
                                    <div id="inputBox">
                                        <div className="valueBox" id="valueone">选择缺陷</div>
                                        <div className="valueBox" id="valuetwo">选择缺陷</div>
                                        <div className="valueBox" id="valuethree">选择缺陷</div>
                                        <div className="valueBox" id="valuefore">选择缺陷</div>
                                        <input className="valueBox" id="valuefive" defaultValue="选择缺陷" type="text" />
                                        <div className="valueBox" id="valuesix">一般</div>
                                    </div>
                                    <div id="msgBox">
                                        {this.state.one &&
                                            this.state.msgVal.map((item, index) => {
                                                return <div className="msgcenter" key={index} onClick={this.state.funC}>{item}</div>
                                            })
                                        }
                                    </div>
                                    <div className="btnBOX">
                                        <button id="upTrue" onClick={(e) => this.upTrue(e)}>确认</button>
                                        <button id="upFalse" onClick={(e) => this.upFalse(e)}>取消</button>
                                    </div>
                                </div>
                            </div>}


                            {this.state.isOpen && <div
                                className="Dropdown"
                                style={this.getDropdownStyle()}
                                ref={ref => this.dropdown = ref}
                            >
                                <Scrollbars
                                    renderTrackHorizontal={props => <div {...props} className="track-horizontal" />}
                                >
                                    <div>
                                        {this.getDropdownOptions()}
                                    </div>
                                </Scrollbars>

                            </div>}
                        </div>
                        <div className="ContentWrapper">
                            <ImageButton
                                externalClassName={"trash"}
                                image={"ico/trash.png"}
                                imageAlt={"remove_rect"}
                                buttonSize={{ width: 30, height: 30 }}
                                onClick={() => onDelete(id)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = {
    updateHighlightedLabelId,
    updateActiveLabelId,
    updateActivePopupType
};

const mapStateToProps = (state: AppState) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LabelInputField);