from typing import List

from fastapi import FastAPI, Depends, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import crud
from database import engine, SessionLocal

import models
from schemas import DatasetUpdate, ClientRead

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/datasets")
async def read_datasets(db: Session = Depends(get_db)):
    datasets = crud.get_datasets(db)
    return datasets


@app.get("/datasets/{id}")
async def update_product(id: int, db: Session = Depends(get_db)):
    dataset = crud.read_dataset(db, id)
    return dataset


@app.post("/datasets/upload")
async def upload_dataset(
        file: UploadFile,
        temp: float = Form(...),
        top_p: float = Form(...),
        channels_ids: List[int] = Form(...),
        products_ids: List[int] = Form(...),
        db: Session = Depends(get_db)
):
    dataset_id = await crud.upload_dataset(db, file, temp, top_p, channels_ids, products_ids)
    return dataset_id


@app.post("/datasets/{dataset_id}")
async def update_product(dataset_id: int, item: DatasetUpdate, db: Session = Depends(get_db)):
    crud.update_dataset(db, dataset_id, item)


@app.get("/datasets/{dataset_id}/clients", response_model=ClientRead)
def get_client(dataset_id: int, offset: int, categories: str, products: str, channels: str, db: Session = Depends(get_db)):

    c = []

    for category in categories.split(','):
        if category == "true":
            c.append(True)
        if category == "false":
            c.append(False)
        if category == "":
            c.append(None)

    products = list(map(int, products.split(','))) if len(products) else [0]
    channels = list(map(int, channels.split(','))) if len(channels) else [0]

    client = crud.read_dataset_client(db, dataset_id, offset, c, channels, products)
    return client


@app.get("/channels")
async def read_channels(db: Session = Depends(get_db)):
    channels = crud.get_channels(db)
    return channels


@app.post("/channels/{channel_id}")
async def update_channels(channel_id: int, item: dict, db: Session = Depends(get_db)):
    crud.update_channel(db, channel_id, item)


@app.get("/products")
async def read_products(db: Session = Depends(get_db)):
    products = crud.get_products(db)
    return products


@app.post("/products/{product_id}")
async def update_product(product_id: int, item: dict, db: Session = Depends(get_db)):
    crud.update_product(db, product_id, item)


@app.post("/texts/{id}")
async def update_text(id: int, item: dict, db: Session = Depends(get_db)):
    crud.update_text(db, id, item)


@app.post("/texts/{id}/regen")
async def update_text(id: int, item: dict, db: Session = Depends(get_db)):
    client_id = item['client_id'],
    channel_id = item['channel_id'],
    product_id = item['product_id'],
    text = item['text'],
    comment = item['comment'],
    temp = item['temp'],
    top_p = item['top_p'],

    crud.regen_text(db, id, client_id, channel_id, product_id, text, comment, temp, top_p)