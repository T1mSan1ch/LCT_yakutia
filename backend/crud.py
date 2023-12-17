import json
from io import BytesIO
from typing import List

import requests

import pandas as pd
import sqlalchemy

from fastapi import UploadFile
from sqlalchemy import func, or_, null
from sqlalchemy.orm import Session, lazyload, joinedload

from const import ML_URL
from models import Product, Channel, vDataset, Dataset, Client, Text
from schemas import DatasetUpdate


def get_datasets(db: Session):
    return db.query(vDataset).all()


def get_channels(db: Session):
    return db.query(Channel).all()


def update_channel(db: Session, id: int, item: dict):
    db.query(Channel).where(Channel.id==id).update(item)
    db.commit()


def get_products(db: Session):
    return db.query(Product).all()


def update_product(db: Session, id: int, item: dict):
    db.query(Product).where(Product.id == id).update(item)
    db.commit()


async def upload_dataset(
        db: Session,
        file: UploadFile,
        temp: float,
        top_p: float,
        channels_ids: List[int],
        products_ids: List[int]
):
    contents = await file.read()

    df = pd.read_excel(BytesIO(contents))

    clients = [Client(**row[row.notnull()]) for _, row in df.iterrows()]

    dataset = Dataset(name=file.filename, clients=clients)

    db.add(dataset)

    db.commit()

    db.refresh(dataset)

    channels = db.query(Channel).where(Channel.id.in_(channels_ids)).all()
    products = db.query(Product).where(Product.id.in_(products_ids)).all()

    body = {
        "clients": list(map(dict, clients)),
        "channels": list(map(dict, channels)),
        "products": list(map(dict, products)),
        "args": {
            "top_p": top_p,
            "temp": temp
        }
    }

    response = requests.post(ML_URL + '/text', json=body)

    resp_dict = response.json()

    print(resp_dict[0])

    texts = [Text(**row, temp=temp, top_p=top_p) for row in resp_dict]

    for text in texts:
        db.add(text)

    db.commit()

    return dataset.id


def read_dataset(db: Session, id: int):
    return db.get(vDataset, id)


def read_dataset_client(db: Session, dataset_id: int, offset: int, categories, channels, products):

    client = (db.query(Client)
                .options(
                    joinedload(
                        Client.texts.and_(
                            Text.is_good.in_(categories) if not (None in categories) else or_(Text.is_good.in_(categories), Text.is_good.is_(None)),
                            Text.channel_id.in_(channels),
                            Text.product_id.in_(products)
                        )
                    )
                )
                .where(Client.dataset_id == dataset_id)
                .offset(offset)
                .first()
              )

    return client


def update_dataset(db: Session, id: int, item: DatasetUpdate):
    db.query(Dataset).where(Dataset.id == id).update(item.dict())
    db.commit()


def update_text(db: Session, id: int, item: dict):
    db.query(Text).where(Text.id == id).update(item)
    db.commit()

def regen_text(db: Session, id: int,
                client_id: int,
                channel_id: int,
                product_id: int,
                text: str,
                comment: str,
                temp: float,
                top_p: float
                ):

    client = db.get(Client, client_id)
    channel = db.get(Channel, channel_id)
    product = db.get(Product, product_id)

    body = {
        "client": dict(client),
        "channel": dict(channel),
        "product": dict(product),
        "text": text[0],
        "comment": comment[0],
        "args": {
        "top_p": top_p[0],
        "temp": temp[0]
        }
    }
    print(text)
    response = requests.post(ML_URL + '/regen', json=body)

    data = response.json()

    print(data)



    db.query(Text).where(Text.id == id).update({
        "text": data,
        "top_p": top_p[0],
        "temp": temp[0]
    })
    db.commit()


