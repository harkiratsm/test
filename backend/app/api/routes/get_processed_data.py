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

@router.get("/")
async def get_processed_data(db: Session = Depends(get_db)):
    try:
        transaction_types = db.query(Transaction.transaction_type, func.count(Transaction.id)).group_by(Transaction.transaction_type).all()
        payment_types = db.query(Transaction.payment_type, func.count(Transaction.id)).filter(Transaction.transaction_type == "Payment").group_by(Transaction.payment_type).all()

        transactions = db.query(Transaction).all()
        tolerance = db.query(ToleranceCheck).all()
        categories = categorize_transactions(transactions, tolerance, db)

        response = {
            "categories": categories
        }

        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/reimbursements")
async def get_reimbursement_summary(db: Session = Depends(get_db)):
    try:
        reimbursement_summary = db.query(ReimbursementSummary).all()

        response = {
            "reimbursements": clean_data_for_json([r.__dict__ for r in reimbursement_summary])
        }

        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/transactions")
async def get_transactions(db: Session = Depends(get_db)):
    try:
        transactions = db.query(Transaction).filter(
            Transaction.order_id.isnot(None),
            Transaction.net_amount.isnot(None),
            Transaction.invoice_amount.isnot(None)
        )
        
        response = {
            "order_payment": clean_data_for_json([t.__dict__ for t in transactions])
        }
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/blank_orders")
async def get_blank_orders(db: Session = Depends(get_db)):
    try:
        blank_orders = db.query(BlankOrderSummary).all()

        response = {
            "blank_orders": clean_data_for_json([b.__dict__ for b in blank_orders])
        }

        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/tolerance_breached")
async def get_tolerance_checks(db: Session = Depends(get_db)):
    try:
        tolerance_checks = db.query(ToleranceCheck).all()

        response = {
            "tolerance_breached": clean_data_for_json([t.__dict__ for t in tolerance_checks])
        }

        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/negative_payouts")
async def get_negative_payouts(db: Session = Depends(get_db)):
    try:
        negative_payouts = db.query(Transaction).filter(Transaction.net_amount < 0).all()

        response = {
            "negative_payouts": clean_data_for_json([n.__dict__ for n in negative_payouts])
        }

        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/payment_pending")
async def get_payment_pending(db: Session = Depends(get_db)):
    try:
        payment_pending = db.query(Transaction).filter(Transaction.net_amount.is_(None)).all()

        response = {
            "payment_pending": clean_data_for_json([p.__dict__ for p in payment_pending])
        }

        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/returns")
async def get_returns(db: Session = Depends(get_db)):
    try:
        returns = db.query(Transaction).filter(Transaction.transaction_type == "Return", Transaction.invoice_amount.isnot(None)).all()

        response = {
            "returns": clean_data_for_json([r.__dict__ for r in returns])
        }

        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))