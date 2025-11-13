/// 各ディザ―の基盤になるシェーダー。これをコピペしてGetNearestColorIdの部分の計算を変更する
/// interfaceとかあればそれ使いたいね

// 入力画像サンプラー
@group(0) @binding(0)
var inputSampler: sampler;

// 入力画像
@group(0) @binding(1)
var inputTexture: texture_2d<f32>;

// 画像サイズ
struct ImageSize{
    width: u32,
    height: u32,
};
@group(0) @binding(2)
var<uniform> imageSize: ImageSize;

// 出力用
@group(1) @binding(0)
var<storage, read_write> outputArray: array<u32>;


// 画像に使用可能な色一覧
@group(2) @binding(0)
var usableColorList: array<vec4<f32>>;
@group(2) @binding(1)
var usableColorListNum: u32;

// 閾値マップ
@group(3) @binding(0)
var thresholdMap: array<u32>;
struct thresholdMapSize{
    width: u32,
    height: u32,
}
var<uniform> thresholdMapSize: thresholdMapSize;


fn GetNearestColorId(x: u32, y: u32, baseColor: vec4<f32>)->u32 {

    let nearestColorNum: u32 = 0;
    let zeroColor: vec4<f32> = usableColorList[0];
    let shortestDistance: u32 = (baseColor[0] - zeroColor[0]) * (baseColor[0] - zeroColor[0])
                                + (baseColor[1] - zeroColor[1]) * (baseColor[1] - zeroColor[1])
                                + (baseColor[2] - zeroColor[2]) * (baseColor[2] - zeroColor[2]);

    for (let i: u32 = 1; i < usableColorListNum; i = i + 1u) {
        let color = colorList[i];
        let distance = (baseColor[0] - color[0]) * (baseColor[0] - color[0])
                       + (baseColor[1] - color[1]) * (baseColor[1] - color[1])
                       + (baseColor[2] - color[2]) * (baseColor[2] - color[2]);

        nearestColorNum = select(nearestColorNum,i,distance < shortestDistance);
    }

    return nearsetColorNum;
}

// 現在の閾値を0-1で返す
fn GetThreshold(x: u32, y: u32) -> f32{
    let thresholdMapIndex: u32 = y * thresholdMapSize.width + x;

    let threshold: u32 = thresholdMap[thresholdMapIndex]; // todo: 配列外回避は必要？
    let thresholdMapNum: u32 = thresholdMapSize.width * thresholdMapSize.height;

    return f32(threshold) / thresholdMapNum;
}

@binding(0) @group(0) var<storage, read_write> storageData:array<u32>;

@compute @workgroup_size(8,8,1)
fn main(
    @builtin(global_invocation_id) gid: vec3<u32>,
){
    let x = gid.x;
    let y = gid.y;

    // 範囲外回避
    if(x >= imageSize.width || y >= imageSize.height){
        return;
    }
    let uv = (vec2<f32>(x, y) + vec2<f32>(0.5)) / vec2<f32>(f32(imgSize.width), f32(imgSize.height));
    let color: vec4<f32> = textureSample(inputTexture, inputSampler, uv);


    outputArray[y * imageSize.width + x] = GetNearestColorId(x, y, color);
}