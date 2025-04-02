from sqlalchemy.orm import Session
from app.models import Url 
# from app.schemas import UrlCreate, UrlUpdate 

def get_urls(db: Session, search: str = None, offset: int = 0, limit: int = 100):
    """
    Retrieve URLs from the database with optional search and pagination.
    """
    query = db.query(Url)
    if search and len(search) > 2: 
        query = query.filter(Url.url.ilike(f"%{search}%"))
    total_rows = query.count()
    urls = query.offset(offset).limit(limit).all()
    return {"data": urls, "totalRows": total_rows}

def get_url_by_id(db: Session, id: int):
    """
    Retrieve a single URL by ID.
    """
    return db.query(Url).filter(Url.id == id).first()

# def insert_url(db: Session, url: UrlCreate):
#     """
#     Insert a new URL into the database.
#     """
#     db_url = Url(**url.dict())
#     db.add(db_url)
#     db.commit()
#     db.refresh(db_url)
#     return db_url

# def update_url(db: Session, id: int, url: UrlUpdate):
#     """
#     Update an existing URL by ID.
#     """
#     db_url = db.query(Url).filter(Url.id == id).first()
#     if not db_url:
#         return None
#     for key, value in url.dict().items():
#         setattr(db_url, key, value)
#     db.commit()
#     db.refresh(db_url)
#     return db_url

# def delete_url(db: Session, id: int):
#     """
#     Delete a URL by ID.
#     """
#     db_url = db.query(Url).filter(Url.id == id).first()
#     if not db_url:
#         return False
#     db.delete(db_url)
#     db.commit()
#     return True