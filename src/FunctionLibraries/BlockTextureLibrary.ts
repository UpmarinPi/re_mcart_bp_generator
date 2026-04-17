const textures = import.meta.glob<{ default: string }>("../assets/block_textures/*.png", { eager: true });

export function GetBlockTextureUrl(textureName: string): string {
    const textureKey = `../assets/block_textures/${textureName}.png`;
    return textures[textureKey]?.default || "";
}
