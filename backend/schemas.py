from typing import List, Optional

from pydantic import BaseModel


class DatasetUpdate(BaseModel):
    comment: str


class TextReadWithClient(BaseModel):

    id: int

    text: str

    temp: float
    top_p: float

    is_good: Optional[bool]

    client_id: int
    product_id: int
    channel_id: int


class ClientRead(BaseModel):
    id: int

    texts: List[TextReadWithClient]
