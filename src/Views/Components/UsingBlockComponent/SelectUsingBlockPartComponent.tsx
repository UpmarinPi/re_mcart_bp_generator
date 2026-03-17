import { DropdownWithImageComponent } from "../DropdownWithImageComponent/DropdownWithImageComponent";

export class SelectUsingBlockPartComponent extends DropdownWithImageComponent {


    private _blockIds: string[] = [];

    private static BlockIdToName(id: string): string {
        // todo
        return id;
    }

    private static BlockIdToImageUrl(id: string): string {
        return `src/assets/block_textures/${id}.png`;
    }

    public SetBlockIds(blockIds: string[]): void {
        this.ResetValues();
        for (const blockId of blockIds) {
            this.AddBlockId(blockId);
        }
    }
    public AddBlockId(blockId: string): void {
        this._blockIds.push(blockId);
        this.AddValue(
            blockId,
            SelectUsingBlockPartComponent.BlockIdToName(blockId),
            SelectUsingBlockPartComponent.BlockIdToImageUrl(blockId)
        );
    }
}