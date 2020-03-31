import {LabelType} from "../enums/LabelType";

export interface ILabelToolkit {
    labelType: LabelType;
    headerText:string;
    imageSrc:string;
    imageAlt:string;
}

export const LabelToolkitData: ILabelToolkit[] = [
    {
        labelType: LabelType.NAME,
        headerText: "Image recognition",
        imageSrc: "ico/object.png",
        imageAlt: "object",
    },
    {
        labelType: LabelType.RECTANGLE,
        headerText: "矩形标注",
        imageSrc: "ico/rectangle.png",
        imageAlt: "rectangle",
    },
    {
        labelType: LabelType.POINT,
        headerText: "点标注",
        imageSrc: "ico/point.png",
        imageAlt: "point",
    },
    {
        labelType: LabelType.POLYGON,
        headerText: "自定义",
        imageSrc: "ico/polygon.png",
        imageAlt: "polygon",
    },
];