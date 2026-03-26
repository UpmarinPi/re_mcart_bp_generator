import usingBlockTemplateJson from "../jsons/using_block_template.json";
import { RepositoryBase } from "./RepositoryBase";

export class UsingBlockTemplateRepository extends RepositoryBase {

    private templateIdToBlocksMap: Map<string, { name: string, blocks: string[] }> = new Map();

    constructor() {
        super();
        this.InitializeTemplateList();
    }

    InitializeTemplateList() {
        for (const [templateId, templateDatas] of Object.entries(usingBlockTemplateJson)) {
            for (const templateData of templateDatas) {
                this.templateIdToBlocksMap.set(templateId, templateData);
            }
        }
    }

    GetBlocks(templateId: string): string[] {
        return this.templateIdToBlocksMap.get(templateId)?.blocks || [];
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
        return Array.from(this.templateIdToBlocksMap.values()).map(templateData => { return { id: templateData.name, name: templateData.name } });
    }


}