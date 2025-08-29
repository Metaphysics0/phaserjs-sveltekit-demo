interface AssetConfig {
  key: string;
  path: string;
  type: "image" | "spritesheet";
  options?: {
    frameWidth?: number;
    frameHeight?: number;
  };
}

/**
 * Asset configuration for the game
 * Add new assets here and they'll be automatically loaded
 */
const ASSET_CONFIG: AssetConfig[] = [
  { key: "star", path: "star.png", type: "image" },
  { key: "ground", path: "platform.png", type: "image" },
  { key: "sky", path: "sky.png", type: "image" },
  { key: "bomb", path: "bomb.png", type: "image" },
  { key: "bg", path: "bg.png", type: "image" },
  { key: "logo", path: "logo.png", type: "image" },
  {
    key: "dude",
    path: "dude.png",
    type: "spritesheet",
    options: { frameWidth: 32, frameHeight: 48 },
  },
] as const;

export function loadAssets(loader: Phaser.Loader.LoaderPlugin) {
  loader.setPath("assets");

  for (const asset of ASSET_CONFIG) {
    if (asset.type === "image") {
      loader.image(asset.key, asset.path);
      continue;
    }
    if (asset.type === "spritesheet" && asset.options) {
      loader.spritesheet(asset.key, asset.path, {
        frameWidth: asset.options.frameWidth!,
        frameHeight: asset.options.frameHeight!,
      });
    }
  }
}

export { ASSET_CONFIG };
