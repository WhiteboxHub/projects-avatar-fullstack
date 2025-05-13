# avatar/projects-avatar-api/app/controllers/accessController.py
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from datetime import datetime
from app.models import AuthUser
from app.schemas import AuthUserCreateSchema, AuthUserUpdateSchema
from typing import Optional, Dict, Any, List

def get_authuser_list(db: Session, skip: int = 0, limit: int = 100, sort_field: str = "lastlogin", sort_order: str = "desc", filters: Optional[Dict[str, Any]] = None):
    """
    Get a list of auth users with pagination and sorting.
    Compatible with the PHP grid implementation.
    
    Args:
        db: Database session
        skip: Number of records to skip (for pagination)
        limit: Maximum number of records to return
        sort_field: Field to sort by
        sort_order: Sort order (asc or desc)
        filters: Optional dictionary of filters to apply
    """
    # Build the base query
    base_query = """
        SELECT
            id, uname, team, level, instructor, override, status, lastlogin, logincount,
            fullname, address, phone, state, zip, city, country, message, registereddate,
            level3date, lastmoddatetime, demo, enddate, googleId, reset_token, token_expiry, role
        FROM
            authuser
    """
    
    # Initialize parameters and where clauses
    params = {"limit": limit, "skip": skip}
    where_clauses = []
    
    # Add filters if provided
    if filters:
        for field, value in filters.items():
            if field in ['registereddate', 'lastlogin', 'level3date'] and value:
                # Handle date filters
                if isinstance(value, dict) and ('from' in value or 'to' in value):
                    if 'from' in value and value['from']:
                        where_clauses.append(f"{field} >= :{field}_from")
                        params[f"{field}_from"] = value['from']
                    if 'to' in value and value['to']:
                        where_clauses.append(f"{field} <= :{field}_to")
                        params[f"{field}_to"] = value['to']
                else:
                    where_clauses.append(f"{field} = :{field}")
                    params[field] = value
            elif field == 'uname' and value:
                # Handle partial text search for username
                where_clauses.append(f"{field} LIKE :{field}")
                params[field] = f"%{value}%"
            elif field == 'fullname' and value:
                # Handle partial text search for fullname
                where_clauses.append(f"{field} LIKE :{field}")
                params[field] = f"%{value}%"
            elif value is not None and value != '':
                # Handle other filters
                where_clauses.append(f"{field} = :{field}")
                params[field] = value
    
    # Construct the WHERE clause if needed
    where_clause = ""
    if where_clauses:
        where_clause = "WHERE " + " AND ".join(where_clauses)
    
    # Construct the final query with ORDER BY and LIMIT
    query = text(f"""
        {base_query}
        {where_clause}
        ORDER BY
            {sort_field} {sort_order}
        LIMIT
            :limit OFFSET :skip
    """)
    
    # Execute the query
    result = db.execute(query, params).mappings().all()
    
    # Get total count for pagination, considering filters
    count_query_text = f"""
        SELECT COUNT(*) as count 
        FROM authuser
        {where_clause}
    """
    count_query = text(count_query_text)
    total_count = db.execute(count_query, params).scalar()
    
    # Format the response to match the PHP jqGrid implementation
    return {
        "data": result,
        "totalRows": total_count,
        "page": skip // limit + 1,
        "total": (total_count + limit - 1) // limit,  # Total pages
        "records": total_count
    }

def search_authusers(db: Session, search_term: str, fields: List[str] = None):
    """
    Search for auth users across multiple fields.
    
    Args:
        db: Database session
        search_term: Term to search for
        fields: List of fields to search in (defaults to uname and fullname)
    """
    if fields is None:
        fields = ["uname", "fullname"]
    
    # Build OR conditions for each field
    or_conditions = []
    params = {}
    
    for i, field in enumerate(fields):
        param_name = f"term_{i}"
        or_conditions.append(f"{field} LIKE :{param_name}")
        params[param_name] = f"%{search_term}%"
    
    # Construct the query
    query = text(f"""
        SELECT
            id, uname, team, level, instructor, override, status, lastlogin, logincount,
            fullname, address, phone, state, zip, city, country, message, registereddate,
            level3date, lastmoddatetime, demo, enddate, googleId, reset_token, token_expiry, role
        FROM
            authuser
        WHERE
            {" OR ".join(or_conditions)}
        ORDER BY lastlogin DESC
    """)
    
    result = db.execute(query, params).mappings().all()
    return result

def get_authuser_by_uname(db: Session, authuser_uname: str):
    """
    Search for auth users by username with partial matching.
    Compatible with the search functionality in the UI.
    """
    query = text("""
        SELECT
            id, uname, team, level, instructor, override, status, lastlogin, logincount,
            fullname, address, phone, state, zip, city, country, message, registereddate,
            level3date, lastmoddatetime, demo, enddate, googleId, reset_token, token_expiry, role
        FROM
            authuser
        WHERE
            uname LIKE :authuser_uname
        ORDER BY lastlogin DESC
    """)
    
    # Add wildcards for partial matching
    wildcard_uname = f"%{authuser_uname}%"
    
    result = db.execute(query, {"authuser_uname": wildcard_uname}).mappings().all()
    return result

def create_authuser(db: Session, authuser_data: AuthUserCreateSchema):
    """Create a new auth user"""
    # Set default values for dates if not provided
    if not authuser_data.registereddate:
        authuser_data.registereddate = datetime.now()
    
    authuser = AuthUser(**authuser_data.dict())
    db.add(authuser)
    db.commit()
    db.refresh(authuser)
    return authuser

ALLOW_LOGIN_STATUSES = {"Active", "Marketing", "Placed", "OnProject-Mkt"}

def get_linked_candidate(db: Session, authuser_id: int):
    """Find candidate by either portalid OR email=authuser.id"""
    return db.execute(
        text("""
            SELECT * FROM candidate 
            WHERE portalid = :id 
               OR email = (SELECT id::text FROM authuser WHERE id = :id)
            LIMIT 1
        """), 
        {"id": authuser_id}
    ).first()

def update_authuser(db: Session, authuser_id: int, authuser_data: AuthUserUpdateSchema):
    authuser = db.query(AuthUser).filter(AuthUser.id == authuser_id).first()
    if not authuser:
        return {"error": "AuthUser not found"}

    update_data = authuser_data.dict(exclude_unset=True)
    candidate = get_linked_candidate(db, authuser_id)

    # Status synchronization and validation
    if 'status' in update_data:
        # Validate candidate status if linked
        if candidate and candidate.status not in ALLOW_LOGIN_STATUSES:
            return {
                "error": f"Cannot update - candidate status '{candidate.status}' "
                        "doesn't allow modifications"
            }
        
        # Sync status to candidate table
        sync_status(db, authuser_id, update_data['status'], 'authuser')
        
        # Update login permission
        update_data['override'] = update_data['status'] in ALLOW_LOGIN_STATUSES

    # Date handling
    for date_field in ['lastlogin', 'registereddate', 'level3date']:
        if date_field in update_data:
            if update_data[date_field] in ["0000-00-00 00:00:00", "0000-00-00"]:
                update_data[date_field] = None
            elif isinstance(update_data[date_field], str):
                try:
                    update_data[date_field] = datetime.strptime(
                        update_data[date_field], 
                        "%Y-%m-%d %H:%M:%S" if " " in update_data[date_field] else "%Y-%m-%d"
                    )
                except ValueError:
                    pass

    # Always update modification timestamp
    update_data["lastmoddatetime"] = datetime.now()
    
    # Build and execute update query
    set_parts = [f"{key} = :{key}" for key in update_data]
    params = {**update_data, "id": authuser_id}
    
    db.execute(
        text(f"UPDATE authuser SET {', '.join(set_parts)} WHERE id = :id"),
        params
    )
    db.commit()

    return {
        "message": "AuthUser updated successfully",
        "user": db.query(AuthUser).filter(AuthUser.id == authuser_id).first(),
        "candidate_status": candidate.status if candidate else None
    }

def sync_status(db: Session, authuser_id: int, new_status: str, source: str):
    """Bidirectional status synchronization"""
    try:
        # Update candidate if source is authuser
        if source == 'authuser':
            db.execute(text("""
                UPDATE candidate 
                SET status = :status, 
                    statuschangedate = CURRENT_TIMESTAMP 
                WHERE portalid = :authuser_id
                   OR email = (SELECT id::text FROM authuser WHERE id = :authuser_id)
            """), {"status": new_status, "authuser_id": authuser_id})
        
        db.commit()
        return {"message": "Status synchronized successfully"}
    except Exception as e:
        db.rollback()
        return {"error": f"Status sync failed: {str(e)}"}

def delete_authuser(db: Session, authuser_id: int):
    """Delete an auth user"""
    authuser = db.query(AuthUser).filter(AuthUser.id == authuser_id).first()
    if not authuser:
        return {"error": "AuthUser not found"}

    db.delete(authuser)
    db.commit()
    return {"message": "AuthUser deleted successfully"}

def get_authuser_stats(db: Session):
    """Get statistics about auth users"""
    stats_query = text("""
        SELECT 
            COUNT(*) as total_users,
            SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_users,
            SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive_users,
            SUM(CASE WHEN level = '3' THEN 1 ELSE 0 END) as level3_users,
            SUM(CASE WHEN level = '2' THEN 1 ELSE 0 END) as level2_users,
            SUM(CASE WHEN instructor = 'Y' THEN 1 ELSE 0 END) as instructors
        FROM authuser
    """)
    
    result = db.execute(stats_query).mappings().first()
    return result
