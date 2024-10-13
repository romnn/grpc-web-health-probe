from pathlib import Path
from proto_compile import proto_compile

ROOT_DIR = Path(__file__).parent
PROTO_DIR = ROOT_DIR / "proto"
WEB_PROTO_OUT_DIR = ROOT_DIR / "src" / "gen"

if __name__ == "__main__":
    print("compiling into {}".format(WEB_PROTO_OUT_DIR))
    proto_compile.compile_grpc_web(
        options=proto_compile.BaseCompilerOptions(
            proto_source_dir=ROOT_DIR,
            clear_output_dirs=True,
            output_dir=WEB_PROTO_OUT_DIR,
        ),
        grpc_web_plugin_version="1.3.1",
        improbable=True,
    )
