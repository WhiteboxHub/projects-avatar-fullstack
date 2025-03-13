# avatar/projects-avatar-api/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.db import engine, Base
from app.routes.batchRoute import router as batch_router
from app.routes.accessRoute import router as access_router
from app.routes.authRoute import router as auth_router
from app.routes.accessRoute import router as user_router
from app.routes.leadsRoute import router as leads_router
from app.routes.candidateRoute import router as candidate_router
from app.routes.candidate_searchRoute import router as candidate_search_router
from app.routes.poRoute import router as po_router  
from app.routes.candidateMarketingRoute import router as candidate_marketing_router  
from app.routes.currentMarketingRoute import router as current_marketing_router  # Import the new router
from app.routes.overdueRoute import router as overdue_router
from app.routes.clientRoute import router as client_router  # Import the new router
from app.routes.clientSearchRoute import router as client_search_router  # Import the new router

app = FastAPI()

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],  
)

Base.metadata.create_all(bind=engine)


app.include_router(auth_router, prefix="/api/admin/auth", tags=["auth"])
app.include_router(access_router, prefix="/api/admin/access", tags=["access"])
app.include_router(batch_router, prefix="/api/admin/batch", tags=["batch"]) 
app.include_router(user_router, prefix="/api/admin/admin", tags=["users"])
app.include_router(leads_router, prefix="/api/admin/leads/search", tags=["leads"])  
app.include_router(candidate_router, prefix="/api/admin/candidates", tags=["candidates"])
app.include_router(candidate_search_router,tags=["search"])
app.include_router(po_router,tags=["po"])
app.include_router(candidate_marketing_router, tags=["candidatemarketing"])  
app.include_router(current_marketing_router, tags=["currentmarketing"])  
app.include_router(overdue_router, tags=["overdue"])
app.include_router(client_search_router, tags=["clientsearch"])
app.include_router(client_router, prefix="/api/admin/client", tags=["clients"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Avatar"}