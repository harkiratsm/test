from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
import pandas as pd
from utils import process_data, store_data_in_db
from core.database import Session
from api.deps import get_db
import io

router = APIRouter()

@router.post("/")
async def process_files(mtr_file: UploadFile = File(...), payment_file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        # Read the files
        mtr_df = read_file(mtr_file)
        payment_df = read_file(payment_file)

        # Process the data
        result = process_data(mtr_df, payment_df)

        # Store in database
        store_data_in_db(db, result)

        return {
            "message": "Data processed and stored successfully",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def read_file(file: UploadFile) -> pd.DataFrame:
    contents = file.file.read()
    file_like_object = io.BytesIO(contents)
    file_like_object.seek(0)

    if file.filename.endswith('.csv'):
        return pd.read_csv(file_like_object,na_values=['', 'N/A', 'NA', 'NaN', 'nan'])
    elif file.filename.endswith(('.xls', '.xlsx')):
        return pd.read_excel(file_like_object, na_values=['', 'N/A', 'NA', 'NaN', 'nan'])
    else:
        raise ValueError(f"Unsupported file format: {file.filename}")