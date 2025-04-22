# from datetime import datetime
# from fastapi import APIRouter, Depends, HTTPException, status, Query
# from sqlalchemy import desc
# from sqlalchemy.orm import Session
# from typing import List
# from app.controllers.url_Controller import get_url_by_id, get_urls, insert_url, update_url, delete_url
# from app.models import Url
# from app.schemas import UrlCreate, UrlInDB, UrlUpdate
# from app.database.db import get_db

# router = APIRouter()

# @router.get("/urls")
# async def get_urls_route(
#     page: int = Query(1, description="Page number"),
#     page_size: int = Query(500, description="Number of URLs per page"),
#     db: Session = Depends(get_db),
# ):
    
#     offset = (page - 1) * page_size
#     result = get_urls(db, offset=offset, limit=page_size)

#     # Reindex IDs to start from (page - 1) * page_size + 1
#     urls = [{"id": offset + i + 1, "url": url.url} for i, url in enumerate(result["data"])]

#     total_pages = (result["totalRows"] + page_size - 1) // page_size

#     return {
#         "data": urls,
#         "totalRows": result["totalRows"],
#         "totalPages": total_pages,
#         "page": page,
#         "pageSize": page_size,
#     }

# @router.post("/urls/insert", response_model=UrlCreate)
# async def add_url(url: UrlCreate, db: Session = Depends(get_db)):
#     """
#     Add a new URL with the current timestamp for lastmoddatetime.
#     """
#     url_data = url.dict()
#     url_data["lastmoddatetime"] = datetime.utcnow()
#     return insert_url(db, UrlCreate(**url_data))

# @router.put("/urls/update/{reindexed_id}", response_model=UrlUpdate)
# async def update_url_by_reindexed_id(
#     reindexed_id: int,
#     url: UrlUpdate,
#     page: int = Query(1, description="Page number"),
#     page_size: int = Query(100, description="Number of URLs per page"),
#     db: Session = Depends(get_db),
# ):
#     """
#     Update an existing URL by reindexed ID.
#     """
#     offset = (page - 1) * page_size
#     result = get_urls(db, offset=offset, limit=page_size)
#     urls = result["data"]

#     if 1 <= reindexed_id <= len(urls):
#         db_url = urls[reindexed_id - 1]
#         existing_url = db.query(Url).filter(Url.url == url.url).first()
#         if existing_url and existing_url.id != db_url.id:
#             raise HTTPException(
#                 status_code=400,
#                 detail=f"URL '{url.url}' already exists in the database."
#             )

#         updated_url = update_url(db, db_url.id, url)
#         if updated_url:
#             return {"id": reindexed_id, "url": updated_url.url}

#     raise HTTPException(
#         status_code=status.HTTP_404_NOT_FOUND,
#         detail=f"URL with reindexed ID {reindexed_id} not found",
#     )

# @router.get("/urls/search")
# async def search_urls(
#     search: str = Query(..., description="Search term"),
#     page: int = Query(1, description="Page number"),
#     page_size: int = Query(500, description="Number of URLs per page"),
#     sort_by: str = Query("id", description="Sort by column (id or url)"),
#     order_by: str = Query("desc", description="Order by (asc or desc)"),
#     db: Session = Depends(get_db),
# ):
#     """
#     Search URLs with pagination and sorting.
#     """
#     offset = (page - 1) * page_size
#     result = get_urls(db, search=search, offset=offset, limit=page_size)
#     urls = result["data"]

#     if sort_by == "url":
#         urls = sorted(urls, key=lambda x: x.url, reverse=(order_by.lower() == "desc"))
#     else:
#         urls = sorted(urls, key=lambda x: x.id, reverse=(order_by.lower() == "desc"))

#     return {
#         "data": urls,
#         "totalRows": result["totalRows"],
#         "page": page,
#         "pageSize": page_size,
#     }

# @router.get("/urls/view/{id}", response_model=UrlInDB)
# async def view_url_by_id(id: int, db: Session = Depends(get_db)):
#     """
#     View a single URL by ID.
#     """
#     url = get_url_by_id(db, id)
#     if not url:
#         raise HTTPException(status_code=404, detail="URL not found")
#     return url

# # @router.delete("/urls/delete/{reindexed_id}")
# # async def delete_url_route(
# #     reindexed_id: int,
# #     page: int = Query(1, description="Page number"),
# #     page_size: int = Query(500, description="Number of URLs per page"),
# #     db: Session = Depends(get_db),
# # ):
# #     """
# #     Delete a URL by reindexed ID.
# #     """
# #     offset = (page - 1) * page_size
# #     result = get_urls(db, offset=offset, limit=page_size)
# #     urls = result["data"]

# #     if 1 <= reindexed_id <= len(urls):
# #         url_to_delete = urls[reindexed_id - 1]
# #         if delete_url(db, url_to_delete.id):
# #             return {"message": f"URL with reindexed ID {reindexed_id} deleted successfully"}

# #     raise HTTPException(
# #         status_code=status.HTTP_404_NOT_FOUND,
# #         detail=f"URL with reindexed ID {reindexed_id} not found",
# #     )

# @router.delete("/urls/delete/{reindexed_id}")
# async def delete_url_route(
#     reindexed_id: int,
#     page: int = Query(1, description="Page number"),
#     page_size: int = Query(500, description="Number of URLs per page"),
#     db: Session = Depends(get_db),
# ):
#     """
#     Delete a URL by reindexed ID.
#     """
#     current_page = page
#     while True:
#         offset = (current_page - 1) * page_size
#         result = get_urls(db, offset=offset, limit=page_size)
#         urls = result["data"]

#         if not urls:
#             # No more URLs to check
#             break

#         if 1 <= reindexed_id <= len(urls):
#             url_to_delete = urls[reindexed_id - 1]
#             if delete_url(db, url_to_delete.id):
#                 return {"message": f"URL with reindexed ID {reindexed_id} deleted successfully"}

#         current_page += 1

#     raise HTTPException(
#         status_code=status.HTTP_404_NOT_FOUND,
#         detail=f"URL with reindexed ID {reindexed_id} not found",
#     )
















# from datetime import datetime
# from fastapi import APIRouter, Depends, HTTPException, status, Query
# from sqlalchemy import desc
# from sqlalchemy.orm import Session
# from typing import List
# from app.controllers.url_Controller import get_url_by_id
# from app.models import Url
# from app.schemas import UrlCreate, UrlInDB, UrlUpdate
# from app.database.db import get_db

# router = APIRouter()

# @router.get("/urls")
# async def get_urls(
#     page: int = Query(1, description="Page number"),
#     page_size: int = Query(500, description="Number of URLs per page"),
#     db: Session = Depends(get_db),
# ):
#     """
#     Retrieve all URLs with pagination, sorted by lastmoddatetime in descending order.
#     IDs are sequential and start from 1, regardless of the database IDs.
#     """
#     offset = (page - 1) * page_size
#     query = db.query(Url)

#     # Apply sorting by lastmoddatetime in descending order
#     query = query.order_by(desc(Url.lastmoddatetime))

#     # Get total rows
#     total_rows = query.count()

#     # Calculate total pages
#     total_pages = (total_rows -1) / page_size

#     # Get paginated results
#     urls = query.offset(offset).limit(page_size).all()

#     # Reindex IDs to start from (page - 1) * page_size + 1
#     urls = [{"id": offset + i + 1, "url": url.url} for i, url in enumerate(urls)]

#     return {
#         "data": urls,
#         "totalRows": total_rows,
#         "totalPages": total_pages,
#         "page": page,
#         "pageSize": page_size,
#     }

# @router.post("/urls/insert", response_model=UrlCreate)
# async def add_url(url: UrlCreate, db: Session = Depends(get_db)):
#     """
#     Add a new URL with the current timestamp for lastmoddatetime.
#     """
#     # Create a dictionary from the input URL data
#     url_data = url.dict()

#     # Add the current timestamp to the dictionary
#     url_data["lastmoddatetime"] = datetime.utcnow()  # Use UTC time for consistency

#     # Create the database object
#     db_url = Url(**url_data)

#     # Add and commit to the database
#     db.add(db_url)
#     db.commit()
#     db.refresh(db_url)
#     return db_url

# @router.put("/urls/update/{reindexed_id}", response_model=UrlUpdate)
# async def update_url_by_reindexed_id(
#     reindexed_id: int,
#     url: UrlUpdate,
#     page: int = Query(1, description="Page number"),
#     page_size: int = Query(100, description="Number of URLs per page"),
#     db: Session = Depends(get_db),
# ):
#     """
#     Update an existing URL by reindexed ID.
#     """
#     offset = (page - 1) * page_size
#     query = db.query(Url).order_by(desc(Url.lastmoddatetime))
#     urls = query.offset(offset).limit(page_size).all()

#     # Find the URL with the matching reindexed ID
#     for i, db_url in enumerate(urls):
#         if i + 1 == reindexed_id:

#             existing_url = db.query(Url).filter(Url.url == url.url).first()
#             if existing_url and existing_url.id != db_url.id:
#                 raise HTTPException(
#                     status_code=400,
#                     detail=f"URL '{url.url}' already exists in the database."
#                 )

#             for key, value in url.dict().items():
#                 setattr(db_url, key, value)

#             db.commit()
#             db.refresh(db_url)
#             return {"id": reindexed_id, "url": db_url.url}

#     # If no URL is found with the reindexed ID, return a 404 error
#     raise HTTPException(
#         status_code=status.HTTP_404_NOT_FOUND,
#         detail=f"URL with reindexed ID {reindexed_id} not found",
#     )

# @router.get("/urls/search")
# async def search_urls(
#     search: str = Query(..., description="Search term"),  # Required search term
#     page: int = Query(1, description="Page number"),
#     page_size: int = Query(100, description="Number of URLs per page"),
#     sort_by: str = Query("id", description="Sort by column (id or url)"),
#     order_by: str = Query("desc", description="Order by (asc or desc)"),
#     db: Session = Depends(get_db),
# ):
#     """
#     Search URLs with pagination and sorting.
#     """
#     offset = (page - 1) * page_size
#     query = db.query(Url)

#     # Apply search filter
#     if search and len(search) > 2:  # Only apply search if the term is longer than 2 characters
#         query = query.filter(Url.url.ilike(f"%{search}%"))

#     if sort_by == "url":
#         if order_by.lower() == "asc":
#             query = query.order_by(Url.url.asc())
#         else:
#             query = query.order_by(Url.url.desc())
#     else:
#         if order_by.lower() == "asc":
#             query = query.order_by(Url.id.asc())
#         else:
#             query = query.order_by(desc(Url.id))  # Default: descending order

#     total_rows = query.count()
#     urls = query.offset(offset).limit(page_size).all()

#     return {
#         "data": urls,
#         "totalRows": total_rows,
#         "page": page,
#         "pageSize": page_size,
#     }

# @router.get("/urls/view/{id}", response_model=UrlInDB)
# async def view_url_by_id(id: int, db: Session = Depends(get_db)):
#     """
#     View a single URL by ID.
#     """
#     url = get_url_by_id(db, id)
#     if not url:
#         raise HTTPException(status_code=404, detail="URL not found")
#     return url

# @router.delete("/urls/delete/{id}")
# async def delete_url(id: int, db: Session = Depends(get_db)):
#     """
#     Delete by database ID (unchanged from your original)
#     """
#     url = db.query(Url).filter(Url.id == id).first()
#     if not url:
#         raise HTTPException(status_code=404, detail="URL not found")
    
#     db.delete(url)
#     db.commit()
#     return {"message": f"URL with ID {id} deleted successfully"}






from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy import desc, asc
from sqlalchemy.orm import Session
from typing import List
from app.controllers.url_Controller import get_url_by_id
from app.models import Url
from app.schemas import UrlCreate, UrlInDB, UrlUpdate
from app.database.db import get_db

router = APIRouter()

@router.get("/urls")
async def get_urls(
    page: int = Query(1, description="Page number"),
    page_size: int = Query(500, description="Number of URLs per page"),
    db: Session = Depends(get_db),
):
    offset = (page - 1) * page_size
    query = db.query(Url).order_by(desc(Url.id))  # Sort by ID by default
    
    total_rows = query.count()
    total_pages = (total_rows + page_size - 1) // page_size
    
    urls = query.offset(offset).limit(page_size).all()
    
    # Return only SL No and URL
    response_data = [{
        "sl_no": offset + i + 1,  # Sequential number for display
        "url": url.url
    } for i, url in enumerate(urls)]
    
    return {
        "data": response_data,
        "totalRows": total_rows,
        "totalPages": total_pages,
        "page": page,
        "pageSize": page_size,
    }

@router.post("/urls/insert", response_model=UrlCreate)
async def add_url(url: UrlCreate, db: Session = Depends(get_db)):
    """
    Add a new URL with the current timestamp for lastmoddatetime.
    """
    url_data = url.dict()
    url_data["lastmoddatetime"] = datetime.utcnow()
    db_url = Url(**url_data)
    db.add(db_url)
    db.commit()
    db.refresh(db_url)
    return db_url

@router.put("/urls/update/{sl_no}", response_model=dict)
async def update_url(
    sl_no: int,
    url_update: UrlUpdate,
    page: int = Query(1, description="Page number"),
    page_size: int = Query(500, description="Items per page"),
    db: Session = Depends(get_db),
):
    offset = (page - 1) * page_size
    urls = db.query(Url).order_by(desc(Url.id)).offset(offset).limit(page_size).all()
    
    if not 1 <= sl_no <= len(urls):
        raise HTTPException(
            status_code=404,
            detail=f"SL No {sl_no} not found on page {page}"
        )
    
    url_to_update = urls[sl_no - 1]
    
    # Check if new URL already exists
    existing_url = db.query(Url).filter(
        Url.url == url_update.url,
        Url.id != url_to_update.id
    ).first()
    
    if existing_url:
        raise HTTPException(
            status_code=400,
            detail=f"URL '{url_update.url}' already exists"
        )
    
    # Update the URL
    url_to_update.url = url_update.url
    db.commit()
    db.refresh(url_to_update)
    
    return {
        "message": f"Updated URL with SL No {sl_no}",
        "sl_no": sl_no,
        "url": url_to_update.url
    }

@router.get("/urls/search")
async def search_urls(
    search: str = Query(..., description="Search term"),
    page: int = Query(1, description="Page number"),
    page_size: int = Query(1000, description="Number of URLs per page"),
    sort_by: str = Query("id", description="Sort by column (id or url)"),
    order_by: str = Query("desc", description="Order by (asc or desc)"),
    db: Session = Depends(get_db),
):
    """
    Search URLs with pagination and sorting.
    """
    offset = (page - 1) * page_size
    query = db.query(Url)

    if search and len(search) > 2:
        query = query.filter(Url.url.ilike(f"%{search}%"))

    if sort_by == "url":
        if order_by.lower() == "asc":
            query = query.order_by(asc(Url.url))
        else:
            query = query.order_by(desc(Url.url))
    else:
        if order_by.lower() == "asc":
            query = query.order_by(asc(Url.id))
        else:
            query = query.order_by(desc(Url.id))

    total_rows = query.count()
    urls = query.offset(offset).limit(page_size).all()

    return {
        "data": urls,
        "totalRows": total_rows,
        "page": page,
        "pageSize": page_size,
    }

@router.get("/urls/view/{id}", response_model=UrlInDB)
async def view_url_by_id(id: int, db: Session = Depends(get_db)):
    """
    View a single URL by ID.
    """
    url = get_url_by_id(db, id)
    if not url:
        raise HTTPException(status_code=404, detail="URL not found")
    return url

@router.delete("/urls/delete/{sl_no}")
async def delete_url(
    sl_no: int,
    page: int = Query(1, description="Page number"),
    page_size: int = Query(500, description="Items per page"),
    db: Session = Depends(get_db),
):
    offset = (page - 1) * page_size
    urls = db.query(Url).order_by(desc(Url.id)).offset(offset).limit(page_size).all()
    
    if not 1 <= sl_no <= len(urls):
        raise HTTPException(
            status_code=404,
            detail=f"SL No {sl_no} not found on page {page}"
        )
    
    url_to_delete = urls[sl_no - 1]
    db.delete(url_to_delete)
    db.commit()
    
    return {"message": f"Deleted URL with SL No {sl_no}"}
