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

fn GetNearestColorId(x: u32, y: u32, baseColor: vec3<f32>)->u32 {
    return FindNearestColor(baseColor);
}
fn FindNearestColor(targetColor: vec3<f32>)->u32 {
    var bestId: u32; // targetColorに近い12色を持つ配列
    var bestDist: f32; // bestIdsの各色のtarget colorとの距離

    // 初期化
    bestId = 0;
    bestDist = DistSqByLab(targetColor, usableColorList[0]);

    // 全色から近い12色を取る
    for (var i = 1u; i < usableColorListNum; i = i + 1u){
	  	// bestIds内の最大距離と比較して小さい方を入れる
        let d = DistSqByLab(targetColor, usableColorList[i]);

        let isBetter = d < bestDist;
        bestDist = select(bestDist, d, isBetter);
        bestId = select(bestId, i, isBetter);
    }

    return bestId;
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
    outputArray[y * imageSize.width + x] = GetNearestColorId(x, y, color);
}
