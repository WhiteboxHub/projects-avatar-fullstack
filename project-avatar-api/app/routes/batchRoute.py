# # from fastapi import APIRouter, Depends, HTTPException
# # from sqlalchemy.orm import Session
# # from app.controllers.batch_controller import get_batches, get_batch_names_sorted_by_date, insert_batch, update_batch, delete_batch
# # from app.models import Batch  
# # from app.database.db import get_db  
# # from app.schemas import BatchCreate
# # router = APIRouter()


# # # @router.get("/search")
# # # def get_batch_list(search_query: str = "", page: int = 1, page_size: int = 200, db: Session = Depends(get_db)):
# # #     skip = (page - 1) * page_size
# # #     batches = get_batches(db=db, search_query=search_query, skip=skip, limit=page_size)
# # #     return {"data": batches, "totalRows": len(batches)}

# # @router.get("/search")
# # def search_batches(
# #     search: str = "", 
# #     page: int = 1, 
# #     pageSize: int = 200, 
# #     db: Session = Depends(get_db)
# # ):
# #     skip = (page - 1) * pageSize
# #     batches = get_batches(db=db, search_query=search, skip=skip, limit=pageSize)
# #     return {"data": batches, "totalRows": len(batches)}



# # @router.get("/batchnames")
# # def get_batch_names(db: Session = Depends(get_db)):
# #     batch_names = get_batch_names_sorted_by_date(db)
# #     return {"batchNames": [batch.batchname for batch in batch_names]}


# # @router.post("/batches/insert")
# # def create_batch(batch: dict, db: Session = Depends(get_db)):
# #     new_batch = insert_batch(db=db, batch=batch)
# #     return {"id": new_batch.batchid, "batchname": new_batch.batchname}


# # @router.put("/batches/update/{batch_id}")
# # def update_existing_batch(batch_id: int, batch: dict, db: Session = Depends(get_db)):
# #     updated_batch = update_batch(db=db, batch_id=batch_id, updated_batch=batch)
# #     return {"batchid": updated_batch.batchid, "batchname": updated_batch.batchname}


# # @router.delete("/batches/delete/{batch_id}")
# # def delete_existing_batch(batch_id: int, db: Session = Depends(get_db)):
# #     delete_batch(db=db, batch_id=batch_id)
# #     return {"message": "Batch deleted successfully"}


# # new-projects-avatar-fullstack/project-avatar-api/app/routes/batchRoute.py
# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from app.controllers.batch_controller import get_batches, get_batch_names_sorted_by_date, insert_batch, update_batch, delete_batch
# from app.models import Batch
# from app.database.db import get_db
# from app.schemas import Batch
# router = APIRouter()

# @router.get("/search")
# def search_batches(
#     search: str = "",
#     page: int = 1,
#     pageSize: int = 1000,
#     db: Session = Depends(get_db)
# ):
#     skip = (page - 1) * pageSize
#     batches = get_batches(db=db, search_query=search, skip=skip, limit=pageSize)
#     return {"data": batches, "totalRows": len(batches)}

# @router.get("/batchnames")
# def get_batch_names(db: Session = Depends(get_db)):
#     batch_names = get_batch_names_sorted_by_date(db)
#     return {"batchNames": [batch.batchname for batch in batch_names]}

# @router.post("/batches/insert")
# def create_batch(batch: dict, db: Session = Depends(get_db)):
#     new_batch = insert_batch(db=db, batch=batch)
#     return {"id": new_batch.batchid, "batchname": new_batch.batchname}

# @router.put("/batches/update/{batch_id}")
# def update_existing_batch(batch_id: int, batch: dict, db: Session = Depends(get_db)):
#     updated_batch = update_batch(db=db, batch_id=batch_id, updated_batch=batch)
#     return {"batchid": updated_batch.batchid, "batchname": updated_batch.batchname}

# @router.delete("/batches/delete/{batch_id}")
# def delete_existing_batch(batch_id: int, db: Session = Depends(get_db)):
#     delete_batch(db=db, batch_id=batch_id)
#     return {"message": "Batch deleted successfully"}



from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.controllers.batch_controller import get_batches, get_batch_names_sorted_by_date, insert_batch, update_batch, delete_batch
from app.database.db import get_db
from app.schemas import BatchCreate, BatchUpdate

router = APIRouter()

@router.get("/search")
def search_batches(
    search: str = "",
    page: int = 1,
    pageSize: int = 50,  # Default to 50 per page
    db: Session = Depends(get_db)
):
    skip = (page - 1) * pageSize
    batches, total_count = get_batches(db=db, search_query=search, skip=skip, limit=pageSize)
    return {
        "data": batches, 
        "totalRows": total_count,
        "page": page,
        "pageSize": pageSize
    }

@router.get("/batchnames")
def get_batch_names(db: Session = Depends(get_db)):
    batch_names = get_batch_names_sorted_by_date(db)
    return {"batchNames": [batch.batchname for batch in batch_names]}

@router.post("/batches/insert")
def create_batch(batch: BatchCreate, db: Session = Depends(get_db)):
    new_batch = insert_batch(db=db, batch=batch.dict())
    return {"id": new_batch.batchid, "batchname": new_batch.batchname}

@router.put("/batches/update/{batch_id}")
def update_existing_batch(batch_id: int, batch: BatchUpdate, db: Session = Depends(get_db)):
    updated_batch = update_batch(db=db, batch_id=batch_id, updated_batch=batch.dict(exclude_unset=True))
    return {"batchid": updated_batch.batchid, "batchname": updated_batch.batchname}

@router.delete("/batches/delete/{batch_id}")
def delete_existing_batch(batch_id: int, db: Session = Depends(get_db)):
    delete_batch(db=db, batch_id=batch_id)
    return {"message": "Batch deleted successfully"}
