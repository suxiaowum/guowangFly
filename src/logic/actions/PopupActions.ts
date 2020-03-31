import {ContextManager} from "../context/ContextManager";
import {store} from "../../index";
import {updateActivePopupType} from "../../store/general/actionCreators";

export class PopupActions {
    public static close() {
        console.log("关闭")
        store.dispatch(updateActivePopupType(null));
        ContextManager.restoreCtx();
    }
}