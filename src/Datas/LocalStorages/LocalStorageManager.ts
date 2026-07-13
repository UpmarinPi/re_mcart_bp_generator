import { Singleton } from "../../Cores/Singleton";
import { OptionManager } from "../Options/OptionManager";
import { OptionData } from "../Options/OptionData";
import { RGBColor } from "../../Cores/Color";
import { ColorDataRepository } from "../Repositories/ColorDataRepository";
import { RepositoryManager, ERepositoryIds } from "../Repositories/RepositoryManager";
import type { UsingBlockComponent } from "../../Views/Components/UsingBlockComponent/UsingBlockComponent";

interface ISerializedColor {
    r: number;
    g: number;
    b: number;
}

interface ISerializedColorToBlock {
    color: ISerializedColor;
    blockId: string;
}

interface ISerializedOptionData {
    magnification: number;
    convertMode: string;
    bIsDimensionalMode: boolean;
    bGeneratesSimpleDitherIntermediate: boolean;
    simpleDitherColorCutPow: number;
    usingColors: ISerializedColor[];
    colorsToBlocks: ISerializedColorToBlock[];
    params: any;
}

export class LocalStorageManager extends Singleton {
    private readonly STORAGE_KEY = "re_mcart_bp_generator_option_data";

    /**
     * 現在の OptionData を localStorage に保存する
     */
    public Save(): void {
        try {
            const optionData = OptionManager.get().GetOptionData();

            // colorsToBlocks (Map<RGBColor, string>) をシリアライズ可能な配列に変換
            const serializedColorsToBlocks: ISerializedColorToBlock[] = [];
            optionData.colorsToBlocks.forEach((blockId, color) => {
                serializedColorsToBlocks.push({
                    color: { r: color.r, g: color.g, b: color.b },
                    blockId: blockId
                });
            });

            // usingColors (RGBColor[]) をシリアライズ可能な配列に変換
            const serializedUsingColors: ISerializedColor[] = optionData.usingColors.map(color => ({
                r: color.r,
                g: color.g,
                b: color.b
            }));

            const serializedData: ISerializedOptionData = {
                magnification: optionData.magnification,
                convertMode: optionData.convertMode,
                bIsDimensionalMode: optionData.bIsDimensionalMode,
                bGeneratesSimpleDitherIntermediate: optionData.bGeneratesSimpleDitherIntermediate,
                simpleDitherColorCutPow: optionData.simpleDitherColorCutPow,
                usingColors: serializedUsingColors,
                colorsToBlocks: serializedColorsToBlocks,
                params: optionData.params
            };

            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(serializedData));
            console.debug("Saved OptionData to localStorage", serializedData);
        } catch (e) {
            console.error("Failed to save OptionData to localStorage", e);
        }
    }

    /**
     * localStorage からデータを読み込み、OptionManager の OptionData を復元する
     */
    public Load(): void {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (!raw) return;

            const serializedData = JSON.parse(raw) as ISerializedOptionData;
            const optionData = new OptionData();

            // 基本プロパティの復元
            if (serializedData.magnification !== undefined) optionData.magnification = serializedData.magnification;
            if (serializedData.convertMode !== undefined) optionData.convertMode = serializedData.convertMode;
            if (serializedData.bIsDimensionalMode !== undefined) optionData.bIsDimensionalMode = serializedData.bIsDimensionalMode;
            if (serializedData.bGeneratesSimpleDitherIntermediate !== undefined) optionData.bGeneratesSimpleDitherIntermediate = serializedData.bGeneratesSimpleDitherIntermediate;
            if (serializedData.simpleDitherColorCutPow !== undefined) optionData.simpleDitherColorCutPow = serializedData.simpleDitherColorCutPow;
            if (serializedData.params !== undefined) optionData.params = serializedData.params;

            // usingColors の復元 (RGBColor インスタンスに変換)
            const restoredColors: RGBColor[] = [];
            if (serializedData.usingColors) {
                serializedData.usingColors.forEach(c => {
                    restoredColors.push(new RGBColor(c.r, c.g, c.b));
                });
            }
            optionData.usingColors = restoredColors;

            // colorsToBlocks (Map<RGBColor, string>) の復元
            const restoredColorsToBlocks = new Map<RGBColor, string>();
            if (serializedData.colorsToBlocks) {
                serializedData.colorsToBlocks.forEach(item => {
                    // 同値の RGBColor が restoredColors にあればその参照を使う
                    let colorKey = restoredColors.find(c => c.r === item.color.r && c.g === item.color.g && c.b === item.color.b);
                    if (!colorKey) {
                        colorKey = new RGBColor(item.color.r, item.color.g, item.color.b);
                    }
                    restoredColorsToBlocks.set(colorKey, item.blockId);
                });
            }
            optionData.colorsToBlocks = restoredColorsToBlocks;

            // 画像データはロード時にユーザーに再アップロードさせるため空のままにする
            optionData.baseImage = new ImageData(1, 1);

            // OptionManagerにセット（セット時に各通知が発火し、UIに反映されます）
            OptionManager.get().SetOptionData(optionData);
            console.debug("Restored OptionData from localStorage", optionData);
        } catch (e) {
            console.error("Failed to load OptionData from localStorage", e);
        }
    }

    /**
     * OptionData.colorsToBlocks に基づいて画面上の UsingBlockComponent の選択状態を復元する
     */
    public RestoreUsingBlockComponent(usingBlockComponent: UsingBlockComponent): void {
        try {
            const optionData = OptionManager.get().GetOptionData();
            const colorRepository = RepositoryManager.get().GetRepository<ColorDataRepository>(ERepositoryIds.ColorData);
            if (!colorRepository || !optionData.colorsToBlocks || optionData.colorsToBlocks.size === 0) {
                return;
            }

            // colorsToBlocks の Map から、colorId -> blockId の Map を構築する
            const savedColorIdToBlockMap = new Map<string, string>();
            optionData.colorsToBlocks.forEach((blockId, color) => {
                const colorId = colorRepository.GetColorIdByRGB(color);
                if (colorId) {
                    savedColorIdToBlockMap.set(colorId, blockId);
                }
            });

            // 画面の UsingBlockComponent に存在する全ての colorId に対して適用する
            // colorToSelectColorItemMap は private ですが、UsingBlockComponent が提供する
            // 状態操作 API を使用して復元します。
            const allColorIds = Array.from((usingBlockComponent as any).colorToSelectColorItemMap.keys()) as string[];

            allColorIds.forEach(colorId => {
                const targetBlockId = savedColorIdToBlockMap.get(colorId);
                if (targetBlockId !== undefined) {
                    // 保存されているブロックがある場合、チェックをONにしてブロックIDを選択する
                    usingBlockComponent.Select(colorId);
                    usingBlockComponent.SetBlockId(colorId, targetBlockId);
                } else {
                    // 保存されていない場合、チェックをOFFにする
                    usingBlockComponent.UnSelect(colorId);
                }
            });

            console.debug("Successfully restored UsingBlockComponent state from OptionData");
        } catch (e) {
            console.error("Failed to restore UsingBlockComponent state", e);
        }
    }
}
