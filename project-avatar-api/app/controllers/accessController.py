# avatar/projects-avatar-api/app/controllers/accessController.py
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from datetime import datetime
from app.models import AuthUser
from app.schemas import AuthUserCreateSchema, AuthUserUpdateSchema

def get_authuser_list(db: Session, skip: int, limit: int):
    query = text("""
        SELECT
            id, uname, team, level, instructor, override, status, lastlogin, logincount,
            fullname, address, phone, state, zip, city, country, message, registereddate,
            level3date, lastmoddatetime, demo, enddate, googleId, reset_token, token_expiry, role
        FROM
            authuser
        ORDER BY
            id DESC
        LIMIT
            :limit OFFSET :skip
    """)
    result = db.execute(query, {"limit": limit, "skip": skip}).mappings().all()
    return result

# def get_authuser_by_fullname(db: Session, authuser_fullname: str):
#     query = text("""
#         SELECT
#             id, uname, team, level, instructor, override, status, lastlogin, logincount,
#             fullname, address, phone, state, zip, city, country, message, registereddate,
#             level3date, lastmoddatetime, demo, enddate, googleId, reset_token, token_expiry, role
#         FROM
#             authuser
#         WHERE
#             fullname = :authuser_fullname   
#     """)
#     result = db.execute(query, {"authuser_fullname": authuser_fullname}).mappings().first()
#     return result



# def get_authuser_by_fullname(db: Session, authuser_fullname: str):
#     query = text("""
#         SELECT
#             id, uname, team, level, instructor, override, status, lastlogin, logincount,
#             fullname, address, phone, state, zip, city, country, message, registereddate,
#             level3date, lastmoddatetime, demo, enddate, googleId, reset_token, token_expiry, role
#         FROM
#             authuser
#         WHERE
#             fullname LIKE :authuser_fullname
#     """)
    
#     # Add wildcards for partial matching
#     wildcard_name = f"%{authuser_fullname}%"
    
#     result = db.execute(query, {"authuser_fullname": wildcard_name}).mappings().first()
#     return result

def get_authuser_by_uname(db: Session, authuser_uname: str):
    query = text("""
        SELECT
            id, uname, team, level, instructor, override, status, lastlogin, logincount,
            fullname, address, phone, state, zip, city, country, message, registereddate,
            level3date, lastmoddatetime, demo, enddate, googleId, reset_token, token_expiry, role
        FROM
            authuser
        WHERE
            uname LIKE :authuser_uname
    """)
    
    # Add wildcards for partial matching
    wildcard_uname = f"%{authuser_uname}%"
    
    result = db.execute(query, {"authuser_uname": wildcard_uname}).mappings().all()
    return result


def create_authuser(db: Session, authuser_data: AuthUserCreateSchema):
    authuser = AuthUser(**authuser_data.dict())
    db.add(authuser)
    db.commit()
    db.refresh(authuser)
    return authuser

# def update_authuser(db: Session, authuser_id: int, authuser_data: AuthUserUpdateSchema):
#     authuser = db.query(AuthUser).filter(AuthUser.id == authuser_id).first()
#     if not authuser:
#         return {"error": "AuthUser not found"}

#     for key, value in authuser_data.dict(exclude_unset=True).items():
#         if key == "lastlogin" and value == "0000-00-00 00:00:00":
#             # Set to None or a valid date
#             value = None  # or use datetime.now() for current date
#         setattr(authuser, key, value)

#     db.commit()
#     db.refresh(authuser)
#     return {"message": "AuthUser updated successfully"}


def update_authuser(db: Session, authuser_id: int, authuser_data: AuthUserUpdateSchema):

    authuser = db.query(AuthUser).filter(AuthUser.id == authuser_id).first()
    if not authuser:
        return {"error": "AuthUser not found"}


    update_data = authuser_data.dict(exclude_unset=True)
    

    if "lastlogin" in update_data and update_data["lastlogin"] == "0000-00-00 00:00:00":
        update_data["lastlogin"] = None
    

    set_parts = []
    params = {}
    for key, value in update_data.items():
        set_parts.append(f"{key} = :{key}")
        params[key] = value
    
    if not set_parts:
        return {"message": "No fields to update"}

    params["id"] = authuser_id
    query = text(f"""
        UPDATE authuser 
        SET {', '.join(set_parts)}
        WHERE id = :id
    """)
    db.execute(query, params)
    db.commit()
    # Refresh and return the updated user
    db.refresh(authuser)
    return {"message": "AuthUser updated successfully", "user": authuser}


def delete_authuser(db: Session, authuser_id: int):
    authuser = db.query(AuthUser).filter(AuthUser.id == authuser_id).first()
    if not authuser:
        return {"error": "AuthUser not found"}

    db.delete(authuser)
    db.commit()
    return {"message": "AuthUser deleted successfully"}
