const textures = import.meta.glob<{ default: string }>("../assets/block_textures/*.png", { eager: true });

export function GetBlockTextureUrl(textureName: string): string {
    const textureKey = `../assets/block_textures/${textureName}.png`;
    const url = textures[textureKey]?.default;

    if (url) {
        return url;
    }

    console.log("No texture found for block: " + textureName);
    return "";
}
