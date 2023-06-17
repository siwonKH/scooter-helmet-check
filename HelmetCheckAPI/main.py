import io
from pathlib import Path

from fastapi import FastAPI, UploadFile
from fastapi.responses import FileResponse

from PIL import Image
from yolov5 import detect


app = FastAPI()

FILE = Path(__file__).resolve()
ROOT = FILE.parents[0]


@app.post("/api/check")
async def send_detect_result(file: UploadFile):
    im_bytes = await file.read()
    im = Image.open(io.BytesIO(im_bytes))
    im.save(ROOT / 'images/image.png')

    result = detect.run(
        weights=ROOT / 's200-best.pt',
        source=ROOT / 'images/image.png',
        conf_thres=0.5,
        name='helmet',
        save_conf=True,
        exist_ok=True,
        imgsz=32 * 7,
        )

    if len(result) != 1:
        if len(result) == 0:
            print('감지 실패')
        if len(result) > 1:
            print('두 명 이상이 감지됨')
        return {'wearingHelmet': "0"}

    if result[0][5] == 0:
        return {'wearingHelmet': "1"}
    return {'wearingHelmet': "0"}


@app.post("/api/detect")
async def send_detect_image(file: UploadFile):
    im_bytes = await file.read()
    im = Image.open(io.BytesIO(im_bytes))
    im.save(ROOT / 'images/image.png')

    detect.run(
        weights=ROOT / 's200-best.pt',
        source=ROOT / 'images/image.png',
        conf_thres=0.5,
        line_thickness=2,
        name='helmet',
        save_conf=True,
        exist_ok=True,
        imgsz=32*7,
        )

    return FileResponse(ROOT / 'runs/detect/helmet/image.png')
