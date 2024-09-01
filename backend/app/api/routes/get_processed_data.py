from fastapi import APIRouter, HTTPException, Depends
from core.database import Session
from models import Transaction, BlankOrderSummary, ToleranceCheck, ReimbursementSummary
from api.deps import get_db
from utils import clean_data_for_json
from collections import Counter
from sqlalchemy import func
from datetime import datetime, timedelta

router = APIRouter()

def categorize_transactions(transactions, tolerance, db: Session):
    categories = {
        "Previous Month Order": 0,
        "Return": 0,
        "Order & Payment Received": 0,
        "Negative Payout": 0,
        "Payment Pending": 0,
        "Tolerance rate breached": 0,
       
    }

    today = datetime.utcnow()
    first_day_of_current_month = today.replace(day=1)
    last_day_of_previous_month = first_day_of_current_month - timedelta(days=1)
    first_day_of_previous_month = last_day_of_previous_month.replace(day=1)

    categories["Previous Month Order"] = db.query(func.count(Transaction.id)).filter(
        Transaction.transaction_type == "Shipment",
        Transaction.order_date >= first_day_of_previous_month,
        Transaction.order_date <= last_day_of_previous_month
    ).scalar()

    for transaction in transactions:
        
        if transaction.transaction_type == "Return" and transaction.invoice_amount is not None:
            categories["Return"] += 1
        
        if transaction.net_amount is not None and transaction.net_amount < 0:
            categories["Negative Payout"] += 1
        
        if transaction.order_id and transaction.net_amount is not None:
            if transaction.invoice_amount is not None:
                categories["Order & Payment Received"] += 1
        elif transaction.order_id and transaction.invoice_amount is not None and transaction.net_amount is None:
            categories["Payment Pending"] += 1
    
    categories["Tolerance rate breached"] = len([t for t in tolerance if t.tolerance_status == "Tolerance Breached"])

    return categories

def process_data(db: Session):
    transaction_types = db.query(Transaction.transaction_type, func.count(Transaction.id)).group_by(Transaction.transaction_type).all()
    payment_types = db.query(Transaction.payment_type, func.count(Transaction.id)).filter(Transaction.transaction_type == "Payment").group_by(Transaction.payment_type).all()

    transactions = db.query(Transaction).all()
    tolerance = db.query(ToleranceCheck).all()
    categories = categorize_transactions(transactions, tolerance, db)

    return {
        "categories": categories
    }

@router.get("/")
async def get_processed_data(db: Session = Depends(get_db)):
    try:
        refined_data = process_data(db)

        transactions = db.query(Transaction).all()
        blank_order = db.query(BlankOrderSummary).all()
        tolerance_breached = db.query(ToleranceCheck).all()

        response = {
            "order_payment": clean_data_for_json([t.__dict__ for t in transactions]),
            "blank_order": clean_data_for_json([b.__dict__ for b in blank_order]),
            "tolerance_breached": clean_data_for_json([t.__dict__ for t in tolerance_breached]),
            "refined_data": refined_data
        }

        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/reim")
async def get_reimbursement_summary(db: Session = Depends(get_db)):
    try:
        reimbursement_summary = db.query(ReimbursementSummary).all()

        response = {
            "reimbursement_summary": clean_data_for_json([r.__dict__ for r in reimbursement_summary])
        }

        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))