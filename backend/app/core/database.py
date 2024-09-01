from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base

# //koyeb-adm:Bvx9FMhmUWL1@ep-broad-snow-a172zomv.ap-southeast-1.pg.koyeb.app/koyebdb it is remote database url
# DATABASE_URL = "postgresql://admin:admin@localhost:5432/interface"
DATABASE_URL = "postgresql:////koyeb-adm:Bvx9FMhmUWL1@ep-broad-snow-a172zomv.ap-southeast-1.pg.koyeb.app/koyebdb"

engine = create_engine(DATABASE_URL)
Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)