from sqlalchemy import Column, Integer, String, Float, Date
from sqlalchemy.orm import declarative_base


Base = declarative_base()

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String, index=True)
    transaction_type = Column(String)
    payment_type = Column(String)
    invoice_amount = Column(Float)
    net_amount = Column(Float)
    p_description = Column(String)
    order_date = Column(Date)
    payment_date = Column(Date)

class BlankOrderSummary(Base):
    __tablename__ = "blank_order_summary"
    id = Column(Integer, primary_key=True, index=True)
    p_description = Column(String)
    net_amount = Column(Float)

class ReimbursementSummary(Base):
    __tablename__ = "reimbursement_summary"
    id = Column(Integer, primary_key=True, index=True)
    net_amount = Column(Float)
    reimbursement_type = Column(String)

class ToleranceCheck(Base):
    __tablename__ = "tolerance_check"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String, index=True)
    payment_net_amount = Column(Float)
    shipment_invoice_amount = Column(Float)
    percentage = Column(Float)
    tolerance_status = Column(String)


