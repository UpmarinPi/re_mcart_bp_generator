// 組織的ディザリングシェーダ

// 入力画像
@group(0) @binding(0)
var inputTexture: texture_2d<f32>;

// 画像サイズ
struct ImageSize{
    width: u32,
    height: u32,
};
@group(0) @binding(1)
var<uniform> imageSize: ImageSize;

// 出力用
@group(1) @binding(0)
var<storage, read_write> outputArray: array<u32>;


// 画像に使用可能な色一覧
@group(2) @binding(0)
var<storage, read> usableColorList: array<vec4<f32>>;
@group(2) @binding(1)
var<uniform> usableColorListNum: u32;

// 閾値マップ
@group(3) @binding(0)
var<storage, read> thresholdMap: array<u32>;
struct ThresholdMapSize{
    width: u32,
    height: u32,
}
@group(3) @binding(1)
var<uniform> thresholdMapSize: ThresholdMapSize;

// その他パラメータ
const kNearest = 12;

fn DistSq(a: vec4<f32>, b: vec4<f32>)->f32{
    let diff = a.xyz - b.xyz;
    return dot(diff, diff);
}
fn AddScaled(a: vec4<f32>, b: vec4<f32>, alpha: f32)-> vec4<f32> {
    return vec4(alpha * a.x + (1.f - alpha) * b.x,
	  			alpha * a.y + (1.f - alpha) * b.y,
	  			alpha * a.z + (1.f - alpha) * b.z,
  				1.f
  				);
}


fn GetNearestColorId(x: u32, y: u32, baseColor: vec4<f32>)->u32 {
    let bestApproxPair = FindBestApproxWithRGB(baseColor);

    // 2つ目の要素が無効値(0未満)の場合は確定で1つ目の要素を返す
    return select(SelectNumByOrderedDither(x, y, baseColor, bestApproxPair[0], bestApproxPair[1]), u32(bestApproxPair[0]), bestApproxPair[1] < 0);
}
fn FindBestApproxWithRGB(targetColor: vec4<f32>)->array<i32, 2> {
    var bestIds: array<u32, kNearest>;
    var bestDists: array<f32, kNearest>;

    // 初期化
    for (var i = 0u; i < kNearest; i = i + 1u){
        bestIds[i] = 0;
        bestDists[i] = 1e9;
    }

    // 全色から近い12色を取る
    for (var i = 0u; i < usableColorListNum; i = i + 1u){
        // 最大値を取る(冗長すぎない？)
        var maxIdx = 0u;
        var maxDist = bestDists[0];
        for (var j = 1u; j < kNearest; j = j + 1u) {
            let isBigger: bool = (bestDists[j] > maxDist);
            maxIdx = select(maxIdx, j, isBigger);
            maxDist = select(maxDist, bestDists[j], isBigger);
        }

        let d = DistSq(targetColor, usableColorList[i]);
        let needsUpdateBiggest = d < maxDist;

        bestDists[maxIdx] = select(bestDists[maxIdx], d, needsUpdateBiggest);
        bestIds[maxIdx] = select(bestIds[maxIdx], i, needsUpdateBiggest);
    }

    var bestPair: array<i32, 2> = array(0,-1);
    var bestPairDist: f32 = bestDists[0];

    // kNearest候補の組み合わせを全探索、混色が最も近くなる色を抽選
    for (var a = 0u; a < kNearest; a = a + 1u){
        let aColor: vec4<f32> = usableColorList[bestIds[a]];
        for (var b = 1u; b < kNearest; b = b + 1u){
            let bColor: vec4<f32> = usableColorList[bestIds[b]];
            let diff = aColor.xyz - bColor.xyz;
            let denom = dot(diff, diff);

            let alphaStar = dot(targetColor.xyz - bColor.xyz, diff) / denom;
            let alpha = max(0, min(1, alphaStar));
            let mix = AddScaled(aColor, bColor, alpha);
            let dist = DistSq(targetColor, mix);

            // よりよい値なら更新
            let isBetter = dist < bestPairDist;
            bestPair[0] = select(bestPair[0], i32(a), isBetter);
		    bestPair[1] = select(bestPair[1], i32(b), isBetter);
            bestPairDist = select(bestPairDist, dist, isBetter);

        }
    }

    return bestPair;
}

fn SelectNumByOrderedDither(x: u32, y: u32, targetColor: vec4<f32>, aColorIdx: i32, bColorIdx: i32)->u32{
    if(bColorIdx < 0){
        return u32(aColorIdx);
    }
    let aColor: vec4<f32> = usableColorList[aColorIdx];
    let bColor: vec4<f32> = usableColorList[bColorIdx];

    let aDistance: f32 = DistSq(targetColor, aColor);
    let bDistance: f32 = DistSq(targetColor, bColor);

    if ((aDistance + bDistance) <= 0) {
        return u32(aColorIdx);
    }

    let layerIndex = thresholdMap[(y % thresholdMapSize.height) * thresholdMapSize.width + (x % thresholdMapSize.width)];

    return select(u32(bColorIdx), u32(aColorIdx), aDistance / (aDistance + bDistance) < f32(layerIndex) / f32(thresholdMapSize.height * thresholdMapSize.width));
}

// 現在の閾値を0-1で返す
fn GetThreshold(x: u32, y: u32) -> f32{
    let thresholdMapIndex: u32 = y * thresholdMapSize.width + x;

    let threshold: u32 = thresholdMap[thresholdMapIndex]; // todo: 配列外回避は必要？
    let thresholdMapNum: u32 = thresholdMapSize.width * thresholdMapSize.height;

    return f32(threshold) / f32(thresholdMapNum);
}

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
    // 色の取得
    let color: vec4<f32> = textureLoad(inputTexture, vec2(x,y), 0);

    // 取得した色に最も近い色を出力配列に書く
    outputArray[y * imageSize.width + x] = GetNearestColorId(x, y, color);
}
