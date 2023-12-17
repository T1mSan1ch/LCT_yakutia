import json

from sqlalchemy import Column, Integer, String, DateTime, func, Boolean, Float, ForeignKey
from sqlalchemy.orm import relationship

from database import Base


class Serializable(object):
    def __iter__(self):
        for c in self.__table__.columns:
            yield c.key, getattr(self, c.key)

    def __repr__(self):
        return json.dumps(self.__dict__)

    def __dict__(self):
        return {c.key: getattr(self, c.key) for c in self.__table__.columns}

class Dataset(Base):
    __tablename__ = 'dataset'

    id = Column(Integer, primary_key=True)

    name = Column(String)
    comment = Column(String)
    uploaded_at = Column(DateTime, server_default=func.now())

    clients = relationship("Client", back_populates="dataset")


class Channel(Base, Serializable):
    __tablename__ = 'channel'

    id = Column(Integer, primary_key=True)

    name = Column(String)
    description = Column(String)

    texts = relationship("Text", back_populates="channel")


class Product(Base, Serializable):
    __tablename__ = 'product'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(String)

    texts = relationship("Text", back_populates="product")


class Text(Base):
    __tablename__ = 'text'

    id = Column(Integer, primary_key=True)

    text = Column(String)
    is_good = Column(Boolean)
    temp = Column(Float)
    top_p = Column(Float)

    client_id = Column(Integer, ForeignKey("client.id"))
    product_id = Column(Integer, ForeignKey("product.id"))
    channel_id = Column(Integer, ForeignKey("channel.id"))

    client = relationship("Client", back_populates="texts")
    product = relationship("Product", back_populates="texts")
    channel = relationship("Channel", back_populates="texts")


class Client(Base, Serializable):
    __tablename__ = 'client'

    id = Column(Integer, primary_key=True)

    gender = Column(Integer)
    age = Column(Float)
    reg_region_nm = Column(String)
    cnt_tr_all_3m = Column(Integer)
    cnt_tr_top_up_3m = Column(Integer)
    cnt_tr_cash_3m = Column(Integer)
    cnt_tr_buy_3m = Column(Integer)
    cnt_tr_mobile_3m = Column(Integer)
    cnt_tr_oil_3m = Column(Integer)
    cnt_tr_on_card_3m = Column(Integer)
    cnt_tr_service_3m = Column(Integer)
    cnt_zp_12m = Column(Integer)
    sum_zp_12m = Column(Float)
    limit_exchange_count = Column(Integer)
    max_outstanding_amount_6m = Column(Float)
    avg_outstanding_amount_3m = Column(Float)
    cnt_dep_act = Column(Integer)
    sum_dep_now = Column(Float)
    avg_dep_avg_balance_1month = Column(Float)
    max_dep_avg_balance_3month = Column(Float)
    app_vehicle_ind = Column(Integer)
    app_position_type_nm = Column(String)
    visit_purposes = Column(String)
    qnt_months_from_last_visit = Column(Integer)
    super_clust = Column(String)

    dataset_id = Column(Integer, ForeignKey("dataset.id"))

    dataset = relationship("Dataset", back_populates="clients")

    texts = relationship("Text", back_populates="client", uselist=True)


class vDataset(Base):
    __tablename__ = "vdataset"

    id = Column(Integer, primary_key=True)

    name = Column(String)
    comment = Column(String)
    uploaded_at = Column(DateTime)

    client_count = Column(Integer)
    text_count = Column(Integer)

    good_count = Column(Integer)
    bad_count = Column(Integer)
    left_count = Column(Integer)
