# from fastapi import APIRouter, Depends, HTTPException, status, Query
# from fastapi.responses import Response
# from sqlalchemy.orm import Session
# from typing import List
# from app.controllers.url_controller import get_urls, insert_url, update_url, delete_url,get_url_by_id
# from app.models import Url  # Your SQLAlchemy model
# from app.schemas import UrlCreate, UrlInDB, UrlUpdate  # Your Pydantic schemas
# from app.database.db import get_db

# router = APIRouter()

# @router.get("/urls/")
# async def get_urls(
#     page: int = Query(1, description="Page number"),
#     page_size: int = Query(200, description="Number of URLs per page"),
#     search: str = Query(None, description="Search term"), 
#     db: Session = Depends(get_db),
# ):
#     """
#     Retrieve URLs with pagination. If search is provided, filter by URL.
#     If search is empty, return all URLs with pagination.
#     """
#     offset = (page - 1) * page_size
#     query = db.query(Url)

#     if search and len(search) > 2:  # Only apply search if the term is longer than 2 characters
#         query = query.filter(Url.url.ilike(f"%{search}%"))

#     total_rows = query.count()  
#     urls = query.offset(offset).limit(page_size).all()

#     return {"data": urls, "totalRows": total_rows}

# @router.post("/urls/insert", response_model=UrlCreate)
# async def create_url(url: UrlCreate, db: Session = Depends(get_db)):
#     """
#     Insert a new URL into the database.
#     """
#     db_url = Url(**url.dict())
#     db.add(db_url)
#     db.commit()
#     db.refresh(db_url)
#     return db_url

# @router.put("/urls/update/{id}", response_model=UrlUpdate)
# async def update_url(id: int, url: UrlUpdate, db: Session = Depends(get_db)):
#     """
#     Update an existing URL by ID.
#     """
#     db_url = db.query(Url).filter(Url.id == id).first()
#     if not db_url:
#         raise HTTPException(status_code=404, detail="URL not found")
#     for key, value in url.dict().items():
#         setattr(db_url, key, value)
#     db.commit()
#     db.refresh(db_url)
#     return db_url

# @router.get("/urls/view/{id}", response_model=UrlInDB)
# async def view_url_by_id(id: int, db: Session = Depends(get_db)):
#     """
#     View a single URL by ID.
#     """
#     url = get_url_by_id(db, id)
#     if not url:
#         raise HTTPException(status_code=404, detail="URL not found")
#     return url



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

#     # Apply sorting
#     if sort_by == "url":
#         if order_by.lower() == "asc":
#             query = query.order_by(Url.url.asc())
#         else:
#             query = query.order_by(Url.url.desc())
#     else:  # Default sorting by ID
#         if order_by.lower() == "asc":
#             query = query.order_by(Url.id.asc())
#         else:
#             query = query.order_by(desc(Url.id))  # Default: descending order

#     # Get total rows and paginated results
#     total_rows = query.count()
#     urls = query.offset(offset).limit(page_size).all()

#     return {
#         "data": urls,
#         "totalRows": total_rows,
#         "page": page,
#         "pageSize": page_size,
#     }




# # @router.delete("/urls/delete/{id}", response_model=UrlInDB)
# # async def delete_url(id: int, db: Session = Depends(get_db)):
# #     """
# #     Delete a URL by ID.
# #     """
# #     db_url = db.query(Url).filter(Url.id == id).first()
# #     if not db_url:
# #         raise HTTPException(status_code=404, detail="URL not found")
# #     db.delete(db_url)
# #     db.commit()
# #     return Response(status_code=status.HTTP_204_NO_CONTENT)





from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import Response
from sqlalchemy import desc
from sqlalchemy.orm import Session
from typing import List
from app.controllers.url_Controller import  get_url_by_id
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
    """
    Retrieve all URLs with pagination, sorted by lastmoddatetime in descending order.
    IDs are sequential and start from 1, regardless of the database IDs.
    """
    offset = (page - 1) * page_size
    query = db.query(Url)

    # Apply sorting by lastmoddatetime in descending order
    query = query.order_by(desc(Url.lastmoddatetime))

    # Get total rows and paginated results
    total_rows = query.count()
    urls = query.offset(offset).limit(page_size).all()

    # Reindex IDs to start from (page - 1) * page_size + 1
    urls = [{"id": offset + i + 1, "url": url.url} for i, url in enumerate(urls)]

    return {
        "data": urls,
        "totalRows": total_rows,
        "page": page,
        "pageSize": page_size,
    }


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

#     # Get total rows and paginated results
#     total_rows = query.count()
#     urls = query.offset(offset).limit(page_size).all()

#     # Reindex IDs to start from 1
#     #urls = [{"id": i + 1, "url": url.url, "lastmoddatetime": url.lastmoddatetime} for i, url in enumerate(urls)]
#     urls = [{"id": i + 1, "url": url.url} for i, url in enumerate(urls)]


#     return {
#         "data": urls,
#         "totalRows": total_rows,
#         "page": page,
#         "pageSize": page_size,
#     }
    
    
@router.post("/urls/insert", response_model=UrlCreate)
async def add_url(url: UrlCreate, db: Session = Depends(get_db)):
    """
    Add a new URL with the current timestamp for lastmoddatetime.
    """
    # Create a dictionary from the input URL data
    url_data = url.dict()
    
    # Add the current timestamp to the dictionary
    url_data["lastmoddatetime"] = datetime.utcnow()  # Use UTC time for consistency

    # Create the database object
    db_url = Url(**url_data)

    # Add and commit to the database
    db.add(db_url)
    db.commit()
    db.refresh(db_url)
    return db_url

@router.put("/urls/update/{reindexed_id}", response_model=UrlUpdate)
async def update_url_by_reindexed_id(
    reindexed_id: int,
    url: UrlUpdate,
    page: int = Query(1, description="Page number"),
    page_size: int = Query(100, description="Number of URLs per page"),
    db: Session = Depends(get_db),
):
    """
    Update an existing URL by reindexed ID.
    """
    offset = (page - 1) * page_size
    query = db.query(Url).order_by(desc(Url.lastmoddatetime))
    urls = query.offset(offset).limit(page_size).all()

    # Find the URL with the matching reindexed ID
    for i, db_url in enumerate(urls):
        if i + 1 == reindexed_id: 
           
            existing_url = db.query(Url).filter(Url.url == url.url).first()
            if existing_url and existing_url.id != db_url.id:
                raise HTTPException(
                    status_code=400,
                    detail=f"URL '{url.url}' already exists in the database."
                )

           
            for key, value in url.dict().items():
                setattr(db_url, key, value)

            db.commit()
            db.refresh(db_url)
            return {"id": reindexed_id, "url": db_url.url}

    # If no URL is found with the reindexed ID, return a 404 error
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"URL with reindexed ID {reindexed_id} not found",
    )

# Move the search route above the view/{id} route
@router.get("/urls/search")
async def search_urls(
    search: str = Query(..., description="Search term"),  # Required search term
    page: int = Query(1, description="Page number"),
    page_size: int = Query(100, description="Number of URLs per page"),
    sort_by: str = Query("id", description="Sort by column (id or url)"),
    order_by: str = Query("desc", description="Order by (asc or desc)"),
    db: Session = Depends(get_db),
):
    """
    Search URLs with pagination and sorting.
    """
    offset = (page - 1) * page_size
    query = db.query(Url)

    # Apply search filter
    if search and len(search) > 2:  # Only apply search if the term is longer than 2 characters
        query = query.filter(Url.url.ilike(f"%{search}%"))

 
    if sort_by == "url":
        if order_by.lower() == "asc":
            query = query.order_by(Url.url.asc())
        else:
            query = query.order_by(Url.url.desc())
    else:  
        if order_by.lower() == "asc":
            query = query.order_by(Url.id.asc())
        else:
            query = query.order_by(desc(Url.id))  # Default: descending order

    
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




@router.delete("/urls/delete/{reindexed_id}")
async def delete_url(
    reindexed_id: int,
    page: int = Query(1, description="Page number"),
    page_size: int = Query(100, description="Number of URLs per page"),
    db: Session = Depends(get_db),
):
    """
    Delete a URL by reindexed ID.
    """
    # Calculate the offset for pagination
    offset = (page - 1) * page_size

    # Fetch the URLs with pagination and sorting
    query = db.query(Url).order_by(desc(Url.lastmoddatetime))  
    urls = query.offset(offset).limit(page_size).all()

    # Find the URL with the matching reindexed ID
    if 1 <= reindexed_id <= len(urls):  
        url_to_delete = urls[reindexed_id - 1] 
        db.delete(url_to_delete)
        db.commit()
        return {"message": f"URL with reindexed ID {reindexed_id} deleted successfully"}
    else:
        # If no URL is found with the reindexed ID, return a 404 error
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"URL with reindexed ID {reindexed_id} not found",
        )
