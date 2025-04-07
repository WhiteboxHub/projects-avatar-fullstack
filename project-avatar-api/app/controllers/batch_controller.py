# new-projects-avatar-fullstack/project-avatar-api/app/controllers/batch_controller.py

from datetime import datetime
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models import Batch, Course

def get_batches(db: Session, search_query: str = "", skip: int = 0, limit: int = 100):
    query = db.query(Batch).order_by(Batch.batchid.desc())
    if search_query:
        query = query.filter(Batch.batchname.like(f"%{search_query}%"))
    return query.offset(skip).limit(limit).all()

def get_batch_names_sorted_by_date(db: Session):
    # Assuming you want to sort by 'startdate' in descending order
    return db.query(Batch.batchname).order_by(Batch.startdate.desc()).all()


def insert_batch(db: Session, batch: dict):
    new_batch = Batch(

        batchname=batch['batchname'],
        current=batch['current'],
        orientationdate=batch['orientationdate'],  # already a date object
        subject=batch['subject'],
        startdate=batch['startdate'],  # already a date object
        enddate=batch['enddate'],  # already a date object or None
        courseid=batch['courseid']
    )
    db.add(new_batch)
    db.commit()
    db.refresh(new_batch)
    return new_batch

def update_batch(db: Session, batch_id: int, updated_batch: dict):
    # Fetch the batch from the database
    batch = db.query(Batch).filter(Batch.batchid == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    # Update the batch attributes
    for key, value in updated_batch.items():
        if key == 'courseid' and value is not None:
            # Check if the course exists
            course = db.query(Course).filter(Course.id == value).first()
            if not course:
                raise HTTPException(status_code=400, detail="Invalid course ID")

        setattr(batch, key, value)

    # Commit the changes to the database
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
