@binding(0) @group(0) var<storage, read_write> storageData:array<u32>;
@compute @workgroup_size(8,1,1)
fn main(
    @builtin(global_invocation_id) gid:vec3<u32>,
){
    storageData[gid.x] = storageData[gid.x] + 1u;
}