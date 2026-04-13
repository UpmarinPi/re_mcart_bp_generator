import { ButtonComponent, ButtonStyle } from "../ButtonComponent/ButtonComponent";
import { ComponentBase } from "../ComponentBase";
import { InputCheckBoxListComponent } from "../InputComponents/InputCheckBoxListComponent/InputCheckBoxListComponent";

namespace BlockBulkSettingComponentIds {
    export const inputCheckBoxListComponentId: string = "inputCheckBoxListComponent";
    export const applyChecksButtonId: string = "applyChecksButton";
    export const selectAllButtonId: string = "selectAllButton";
    export const deselectAllButtonId: string = "deselectAllButton";
}

export class BlockBulkSettingComponent extends ComponentBase {
    inputCheckBoxList: InputCheckBoxListComponent;
    applyChecksButton: ButtonComponent;
    selectAllButton: ButtonComponent;
    deselectAllButton: ButtonComponent;
    constructor(id: string) {
        super(id);
        this.inputCheckBoxList = this.CreateView(InputCheckBoxListComponent, BlockBulkSettingComponentIds.inputCheckBoxListComponentId);
        this.applyChecksButton = this.CreateView(ButtonComponent, BlockBulkSettingComponentIds.applyChecksButtonId, "適用", ButtonStyle.Default);
        this.selectAllButton = this.CreateView(ButtonComponent, BlockBulkSettingComponentIds.selectAllButtonId, "すべて選択", ButtonStyle.Default);
        this.deselectAllButton = this.CreateView(ButtonComponent, BlockBulkSettingComponentIds.deselectAllButtonId, "すべて選択解除", ButtonStyle.Default);
    }

    override GetRender(): React.JSX.Element {
        return (
            <div className={"block-bulk-setting-component " + this.id}>
                {this.inputCheckBoxList.GetRender()}
                {this.applyChecksButton.GetRender()}
                <div className="block-bulk-setting-component-buttons">
                    {this.deselectAllButton.GetRender()}
                    {this.selectAllButton.GetRender()}
                </div>
            </div>
        );
    }
}