import usingBlockTemplateJson from "../jsons/using_block_template.json";
import { RepositoryBase } from "./RepositoryBase";

export class UsingBlockTemplateRepository extends RepositoryBase {

    private templateIdToBlocksMap: Map<string, { name: string, blocks: string[] }> = new Map();

    constructor() {
        super();
        this.InitializeTemplateList();
    }

    private InitializeTemplateList() {
        for (const [templateId, templateDatas] of Object.entries(usingBlockTemplateJson)) {
            for (const templateData of templateDatas) {
                this.templateIdToBlocksMap.set(templateId, templateData);
            }
        }
    }

    GetBlocks(templateId: string): string[] {
        return this.templateIdToBlocksMap.get(templateId)?.blocks || [];
    }

    GetBlocksByIds(templateIds: string[]): string[] {
        let returnValue: string[] = [];
        templateIds.forEach(templateId => {
            const blocksInSingle = this.GetBlocks(templateId);
            blocksInSingle.forEach(block => {
                // 同じブロックは重複して登録しない
                if (returnValue.includes(block)) {
                    return;
                }
                returnValue.push(block);
            });
        });
        return returnValue;
    }

    GetTemplateName(templateId: string): string {
        return this.templateIdToBlocksMap.get(templateId)?.name || "";
    }

    GetTemplateIds(): string[] {
        return Array.from(this.templateIdToBlocksMap.keys());
    }

    GetTemplateNames(): string[] {
        return Array.from(this.templateIdToBlocksMap.values()).map(templateData => templateData.name);
    }

    GetTemplateList(): { id: string, name: string }[] {
        const ReturnValues: { id: string, name: string }[] = [];
        this.templateIdToBlocksMap.forEach((templateData, templateId) => {
            ReturnValues.push({ id: templateId, name: templateData.name });
        });
        return ReturnValues;
    }


}