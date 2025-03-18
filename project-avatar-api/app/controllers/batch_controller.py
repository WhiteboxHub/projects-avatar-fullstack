from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models import Batch  


def get_batches(db: Session, search_query: str = "", skip: int = 0, limit: int = 100):
    if search_query:
        return db.query(Batch).filter(Batch.batchname.like(f"%{search_query}%")).offset(skip).limit(limit).all()
    return db.query(Batch).offset(skip).limit(limit).all()

def get_batch_names_sorted_by_date(db: Session):
    return db.query(Batch.batchname).order_by(Batch.batchname).all()

def insert_batch(db: Session, batch: dict):
    new_batch = Batch(**batch)
    db.add(new_batch)
    db.commit()
    db.refresh(new_batch)
    return new_batch

def update_batch(db: Session, batch_id: int, updated_batch: dict):
    batch = db.query(Batch).filter(Batch.batchid == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    for key, value in updated_batch.items():
        setattr(batch, key, value)
    db.commit()
    db.refresh(batch)
    return batch


def delete_batch(db: Session, batch_id: int):
    batch = db.query(Batch).filter(Batch.batchid == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    db.delete(batch)
    db.commit()
    return {"message": "Batch deleted successfully"}
