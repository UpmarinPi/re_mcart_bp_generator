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
var<storage, read> usableColorList: array<vec3<f32>>;
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
const kNearest: u32 = 3;

fn RgbToLab(rgb: vec3<f32>) -> vec3<f32> {
    // RGB(0~255)を0.0~1.0の範囲へ正規化
    let c = rgb / 255.0;
    
    // sRGB -> Linear RGB 変換
    let b1 = c > vec3<f32>(0.04045);
    let s1 = pow((c + vec3<f32>(0.055)) / vec3<f32>(1.055), vec3<f32>(2.4));
    let s2 = c / vec3<f32>(12.92);
    let lin_rgb = select(s2, s1, b1) * 100.0;

    // Linear RGB -> XYZ 変換
    let x = dot(lin_rgb, vec3<f32>(0.4124564, 0.3575761, 0.1804375));
    let y = dot(lin_rgb, vec3<f32>(0.2126729, 0.7151522, 0.0721750));
    let z = dot(lin_rgb, vec3<f32>(0.0193339, 0.1191920, 0.9503041));
    
    // XYZ -> CIELAB 変換 (D65光源を基準)
    let v = vec3<f32>(x, y, z) / vec3<f32>(95.047, 100.000, 108.883);
    
    let b2 = v > vec3<f32>(0.008856);
    let s3 = pow(v, vec3<f32>(1.0 / 3.0));
    let s4 = (vec3<f32>(7.787) * v) + vec3<f32>(16.0 / 116.0);
    let f = select(s4, s3, b2);
    
    let l = 116.0 * f.y - 16.0;
    let a = 500.0 * (f.x - f.y);
    let b = 200.0 * (f.y - f.z);
    
    return vec3<f32>(l, a, b);
}

fn DistSqByLab(a: vec3<f32>, b: vec3<f32>)->f32{
    // 直線的なRGB距離ではなく、Lab空間でのユークリッド距離(⊿E)で求める
    let lab_a = RgbToLab(a);
    let lab_b = RgbToLab(b);
    let diff = lab_a - lab_b;
    return dot(diff, diff);
}

fn DistSqByRGB(a: vec3<f32>, b: vec3<f32>)->f32{
    let diff = a - b;
    return dot(diff, diff);
}
fn AddScaled(a: vec3<f32>, b: vec3<f32>, alpha: f32)-> vec3<f32> {
    return vec3(alpha * a.x + (1.f - alpha) * b.x,
	  			alpha * a.y + (1.f - alpha) * b.y,
	  			alpha * a.z + (1.f - alpha) * b.z
  				);
}


fn GetNearestColorIdByRGB(x: u32, y: u32, baseColor: vec3<f32>)->u32 {
    let bestApproxPair: array<i32, 2> = FindBestApproxWithRGB(baseColor);

    // 2つ目の要素が無効値(0未満)の場合は確定で1つ目の要素を返す
    return select(SelectNumByOrderedDitherInRGB(x, y, baseColor, u32(bestApproxPair[0]), u32(bestApproxPair[1])), u32(bestApproxPair[0]), bestApproxPair[1] < 0);
}

fn GetNearestColorIdByLab(x: u32, y: u32, baseColor: vec3<f32>)->u32 {
    let bestApproxPair: array<i32, 2> = FindBestApproxWithLab(baseColor);

    // 2つ目の要素が無効値(0未満)の場合は確定で1つ目の要素を返す
    return select(SelectNumByOrderedDitherInLab(x, y, baseColor, u32(bestApproxPair[0]), u32(bestApproxPair[1])), u32(bestApproxPair[0]), bestApproxPair[1] < 0);
}

fn FindBestApproxWithRGB(targetColor: vec3<f32>)->array<i32, 2> {
    var bestIds: array<i32, 3>; // targetColorに近い12色を持つ配列
    var bestDists: array<f32, 3>; // bestIdsの各色のtarget colorとの距離

    // 初期化
    for (var i = 0u; i < kNearest; i = i + 1u){
        bestIds[i] = -1;
        bestDists[i] = -1.0;
    }

    // 全色から近い12色を取る
    for (var i = 0u; i < usableColorListNum; i = i + 1u){
        // 最大値を取る

        var maxIdx = 0u; // bestIds内での最大距離ID
        var maxDist = bestDists[0]; // bestIds内での最大距離
        for (var j = 1u; j < kNearest; j = j + 1u) {
            let isBigger: bool = (maxDist >= 0.0) && (bestDists[j] < 0.0 || bestDists[j] > maxDist);
            maxIdx = select(maxIdx, j, isBigger);
            maxDist = select(maxDist, bestDists[j], isBigger);
        }

	  	// bestIds内の最大距離と比較して小さい方を入れる
        let d = DistSqByRGB(targetColor, usableColorList[i]);
        let needsUpdateBiggest: bool = (maxDist < 0.0 || d < maxDist);

        bestDists[maxIdx] = select(bestDists[maxIdx], d, needsUpdateBiggest);
        bestIds[maxIdx] = select(bestIds[maxIdx], i32(i), needsUpdateBiggest);
    }

    var bestPair: array<i32, 2> = array<i32, 2>(0, -1);
    var bestPairDist: f32 = -1.0;

    // 色がある程度近いkNearest個の配列のうち、最も綺麗な組み合わせを絞り込み
    for (var a = 0u; a < kNearest; a = a + 1u){
	  	let aId: i32 = bestIds[a];
	  	if(aId < 0 || i32(usableColorListNum) <= aId){
	  	    continue;
	  	}
        let aColor: vec3<f32> = usableColorList[aId];
        for (var b = 0u; b < kNearest; b = b + 1u){

		  	let bId: i32 = bestIds[b];
		    if(bId < 0|| i32(usableColorListNum) <= bId){
                continue;
            }
            let bColor: vec3<f32> = usableColorList[bId];
            let diff = aColor - bColor;
            let isTheSameColor: bool = (aId == bId || f32(dot(diff, diff)) < 1e-6);
            let denom = select(f32(dot(diff, diff)), 1.f, isTheSameColor); // 0除算を避けるために

            // ほぼ同じ色のとき
            let distInSameColor = DistSqByRGB(targetColor, aColor);

            // 違う色のとき
            let alphaStar = f32(dot(targetColor - bColor, diff)) / denom;
            let alpha = max(0.0, min(1.0, alphaStar));
            let mix = AddScaled(aColor, bColor, alpha);
            let distInDiffColor = DistSqByRGB(targetColor, mix);

            let dist = select(distInDiffColor, distInSameColor, isTheSameColor);

            // よりよい値なら更新
            let isBetter = (dist < bestPairDist || bestPairDist < 0.0);
            bestPair[0] = select(bestPair[0], i32(aId), isBetter);
		    bestPair[1] = select(bestPair[1], select(i32(bId), -1, isTheSameColor), isBetter);
            bestPairDist = select(bestPairDist, dist, isBetter);
        }
    }

    return bestPair;
}

fn FindBestApproxWithLab(targetColor: vec3<f32>)->array<i32, 2> {
    var bestIds: array<i32, 3>; // targetColorに近い12色を持つ配列
    var bestDists: array<f32, 3>; // bestIdsの各色のtarget colorとの距離

    // 初期化
    for (var i = 0u; i < kNearest; i = i + 1u){
        bestIds[i] = -1;
        bestDists[i] = -1.0;
    }

    // 全色から近い12色を取る
    for (var i = 0u; i < usableColorListNum; i = i + 1u){
        // 最大値を取る

        var maxIdx = 0u; // bestIds内での最大距離ID
        var maxDist = bestDists[0]; // bestIds内での最大距離
        for (var j = 1u; j < kNearest; j = j + 1u) {
            let isBigger: bool = (maxDist >= 0.0) && (bestDists[j] < 0.0 || bestDists[j] > maxDist);
            maxIdx = select(maxIdx, j, isBigger);
            maxDist = select(maxDist, bestDists[j], isBigger);
        }

	  	// bestIds内の最大距離と比較して小さい方を入れる
        let d = DistSqByLab(targetColor, usableColorList[i]);
        let needsUpdateBiggest: bool = (maxDist < 0.0 || d < maxDist);

        bestDists[maxIdx] = select(bestDists[maxIdx], d, needsUpdateBiggest);
        bestIds[maxIdx] = select(bestIds[maxIdx], i32(i), needsUpdateBiggest);
    }

    var bestPair: array<i32, 2> = array<i32, 2>(0, -1);
    var bestPairDist: f32 = -1.0;

    // 色がある程度近いkNearest個の配列のうち、最も綺麗な組み合わせを絞り込み
    for (var a = 0u; a < kNearest; a = a + 1u){
	  	let aId: i32 = bestIds[a];
	  	if(aId < 0 || i32(usableColorListNum) <= aId){
	  	    continue;
	  	}
        let aColor: vec3<f32> = usableColorList[aId];
        for (var b = 0u; b < kNearest; b = b + 1u){

		  	let bId: i32 = bestIds[b];
		    if(bId < 0|| i32(usableColorListNum) <= bId){
                continue;
            }
            let bColor: vec3<f32> = usableColorList[bId];
            let diff = aColor - bColor;
            let isTheSameColor: bool = (aId == bId || f32(dot(diff, diff)) < 1e-6);
            let denom = select(f32(dot(diff, diff)), 1.f, isTheSameColor); // 0除算を避けるために

            // ほぼ同じ色のとき
            let distInSameColor = DistSqByLab(targetColor, aColor);

            // 違う色のとき
            let alphaStar = f32(dot(targetColor - bColor, diff)) / denom;
            let alpha = max(0.0, min(1.0, alphaStar));
            let mix = AddScaled(aColor, bColor, alpha);
            let distInDiffColor = DistSqByLab(targetColor, mix);

            let dist = select(distInDiffColor, distInSameColor, isTheSameColor);

            // よりよい値なら更新
            let isBetter = (dist < bestPairDist || bestPairDist < 0.0);
            bestPair[0] = select(bestPair[0], i32(aId), isBetter);
		    bestPair[1] = select(bestPair[1], select(i32(bId), -1, isTheSameColor), isBetter);
            bestPairDist = select(bestPairDist, dist, isBetter);
        }
    }

    return bestPair;
}

fn SelectNumByOrderedDitherInRGB(x: u32, y: u32, targetColor: vec3<f32>, aColorIdx: u32, bColorIdx: u32)->u32{
    if(thresholdMapSize.height * thresholdMapSize.width <= 0){
        return aColorIdx;
    }
    let aColor: vec3<f32> = usableColorList[aColorIdx];
    let bColor: vec3<f32> = usableColorList[bColorIdx];

    let aDistance: f32 = DistSqByRGB(targetColor, aColor);
    let bDistance: f32 = DistSqByRGB(targetColor, bColor);

    if ((aDistance + bDistance) <= 0.0) {
        return aColorIdx;
    }

    let thresholdX = x % thresholdMapSize.width;
    let thresholdY = y % thresholdMapSize.height;
    let threshold = GetThreshold(thresholdX, thresholdY);

    return select(bColorIdx, aColorIdx, aDistance / (aDistance + bDistance) < threshold);
}

fn SelectNumByOrderedDitherInLab(x: u32, y: u32, targetColor: vec3<f32>, aColorIdx: u32, bColorIdx: u32)->u32{
    if(thresholdMapSize.height * thresholdMapSize.width <= 0){
        return aColorIdx;
    }
    let aColor: vec3<f32> = usableColorList[aColorIdx];
    let bColor: vec3<f32> = usableColorList[bColorIdx];

    let aDistance: f32 = DistSqByLab(targetColor, aColor);
    let bDistance: f32 = DistSqByLab(targetColor, bColor);

    if ((aDistance + bDistance) <= 0.0) {
        return aColorIdx;
    }

    let thresholdX = x % thresholdMapSize.width;
    let thresholdY = y % thresholdMapSize.height;
    let threshold = GetThreshold(thresholdX, thresholdY);

    return select(bColorIdx, aColorIdx, aDistance / (aDistance + bDistance) < threshold);
}

// 現在の閾値を0-1で返す
fn GetThreshold(x: u32, y: u32) -> f32{
    let thresholdMapIndex: u32 = y * thresholdMapSize.width + x;

    let threshold: u32 = thresholdMap[thresholdMapIndex];
    let thresholdMapNum: u32 = thresholdMapSize.width * thresholdMapSize.height;

    return f32(threshold) / f32(thresholdMapNum);
}

@compute @workgroup_size(16,16)
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
    let actualColor: vec4<f32> = textureLoad(inputTexture, vec2(x,y), 0);
    let color: vec3<f32> = vec3(actualColor.x * 256, actualColor.y * 256, actualColor.z * 256);

    // 取得した色に最も近い色を出力配列に書く
    outputArray[y * imageSize.width + x] = GetNearestColorIdByLab(x, y, color);
}
