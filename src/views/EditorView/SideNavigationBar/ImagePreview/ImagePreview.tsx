import classNames from "classnames";
import React from 'react';
import { connect } from "react-redux";
import { ClipLoader } from "react-spinners";
import { ImageLoadManager } from "../../../../logic/imageRepository/ImageLoadManager";
import { IRect } from "../../../../interfaces/IRect";
import { ISize } from "../../../../interfaces/ISize";
import { ImageRepository } from "../../../../logic/imageRepository/ImageRepository";
import { AppState } from "../../../../store";
import { updateImageDataById } from "../../../../store/labels/actionCreators";
import { ImageData } from "../../../../store/labels/types";
import { FileUtil } from "../../../../utils/FileUtil";
import { RectUtil } from "../../../../utils/RectUtil";
import './ImagePreview.scss';
import { CSSHelper } from "../../../../logic/helpers/CSSHelper";
import $ from 'jquery'
import { LabelsSelector } from "../../../../store/selectors/LabelsSelector";
// import { func } from "prop-types";
// import { store } from "../../../../index";

interface IProps {
    imageData: ImageData;
    style: React.CSSProperties;
    size: ISize;
    isScrolling?: boolean;
    isChecked?: boolean;
    onClick?: () => any;
    isSelected?: boolean;
    updateImageDataById: (id: string, newImageData: ImageData) => any;
}

interface IState {
    image: HTMLImageElement;
}

class ImagePreview extends React.Component<IProps, IState> {
    private isLoading: boolean = false;

    constructor(props) {
        super(props);

        this.state = {
            image: null,
        }
    }

    public componentDidMount(): void {
        ImageLoadManager.addAndRun(this.loadImage(this.props.imageData, this.props.isScrolling));
    }

    public componentWillUpdate(nextProps: Readonly<IProps>, nextState: Readonly<IState>, nextContext: any): void {
        if (this.props.imageData.id !== nextProps.imageData.id) {
            if (nextProps.imageData.loadStatus) {
                ImageLoadManager.addAndRun(this.loadImage(nextProps.imageData, nextProps.isScrolling));
            }
            else {
                this.setState({ image: null });
            }
        }

        if (this.props.isScrolling && !nextProps.isScrolling) {
            ImageLoadManager.addAndRun(this.loadImage(nextProps.imageData, false));
        }
    }

    shouldComponentUpdate(nextProps: Readonly<IProps>, nextState: Readonly<IState>, nextContext: any): boolean {
        return (
            this.props.imageData.id !== nextProps.imageData.id ||
            this.state.image !== nextState.image ||
            this.props.isSelected !== nextProps.isSelected ||
            this.props.isChecked !== nextProps.isChecked
        )
    }

    private loadImage = async (imageData: ImageData, isScrolling: boolean) => {
        if (imageData.loadStatus) {
            const image = ImageRepository.getById(imageData.id);
            if (this.state.image !== image) {
                this.setState({ image });
            }
        }
        else if (!isScrolling || !this.isLoading) {
            this.isLoading = true;
            const saveLoadedImagePartial = (image: HTMLImageElement) => this.saveLoadedImage(image, imageData);
            await FileUtil.loadImage(imageData.fileData, saveLoadedImagePartial, this.handleLoadImageError);
        }
    };
    private saveLoadedImage = (image: HTMLImageElement, imageData: ImageData) => {
        imageData.loadStatus = true;
        this.props.updateImageDataById(imageData.id, imageData);
        ImageRepository.store(imageData.id, image);
        if (imageData.id === this.props.imageData.id) {
            this.setState({ image });
            this.isLoading = false;
        }
    };

    private getStyle = () => {
        const { size } = this.props;

        const containerRect: IRect = {
            x: 0.15 * size.width,
            y: 0.15 * size.height,
            width: 0.7 * size.width,
            height: 0.7 * size.height
        };

        const imageRect: IRect = {
            x: 0,
            y: 0,
            width: this.state.image.width,
            height: this.state.image.height
        };

        const imageRatio = RectUtil.getRatio(imageRect);
        const imagePosition: IRect = RectUtil.fitInsideRectWithRatio(containerRect, imageRatio);

        return {
            width: imagePosition.width,
            height: imagePosition.height,
            left: imagePosition.x,
            top: imagePosition.y
        }
    };

    private handleLoadImageError = () => { };

    private lineName = (e) =>{
        e.stopPropagation();
        // console.log(e.target)
        // console.log(this.props.imageData)
        this.props.imageData.lineName = $(e.target).val()
        console.log(this.props.imageData)
        console.log(LabelsSelector.getActiveImageData())
    }

    private towerName = (e) =>{
        e.stopPropagation();
        this.props.imageData.towerName = $(e.target).val()
    }

    private position = (e) =>{
        e.stopPropagation();
        this.props.imageData.position = $(e.target).val()
    }

    private side = (e) =>{
        e.stopPropagation();
        this.props.imageData.side = $(e.target).val()
    }

    private getClassName = () => {

        return classNames(
            "ImagePreview",
            {
                "selected": this.props.isSelected,
            }
        );
    };
    public render() {
        const {
            isChecked,
            style,
            onClick,
            imageData
        } = this.props;

        return (
            <div
                className={this.getClassName()}
                style={style}
                onClick={onClick ? onClick : undefined}
            >
                {(!!this.state.image) ?
                    [
                        <div
                            className="Foreground"
                            key={"Foreground"}
                            style={this.getStyle()}
                        >
                            <img
                                className="Image"
                                draggable={false}
                                src={this.state.image.src}
                                alt={this.state.image.alt}
                                style={{ ...this.getStyle(), left: 0, top: 0 }}
                            />
                            {isChecked && <img
                                className="CheckBox"
                                draggable={false}
                                src={"ico/ok.png"}
                                alt={"checkbox"}
                            />}
                            <div id={this.props.imageData.id} className="imgExif">
                                <input className="inputExif" onBlur={(e) =>{this.lineName(e)}} type="text" defaultValue={imageData.lineName} />
                                <input className="inputExif" onBlur={(e) =>{this.towerName(e)}} type="text" defaultValue={imageData.towerName} />
                                <input className="inputExif" onBlur={(e) =>{this.position(e)}} type="text" defaultValue={imageData.position} />
                                <input className="inputExif" onBlur={(e) =>{this.side(e)}} type="text" defaultValue={imageData.side} />
                                {/* {imageData.position}
                                {imageData.side} */}
                            </div>
                        </div>,
                        <div
                            className="Background"
                            key={"Background"}
                            style={this.getStyle()}
                        />
                    ] :
                    <ClipLoader
                        sizeUnit={"px"}
                        size={30}
                        color={CSSHelper.getLeadingColor()}
                        loading={true}
                    />}
            </div>)
    }
}

const mapDispatchToProps = {
    updateImageDataById
};

const mapStateToProps = (state: AppState) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ImagePreview);