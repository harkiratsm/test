import pandas as pd
from typing import Dict
import math
from core.database import Session
from models import Transaction, BlankOrderSummary, ToleranceCheck, ReimbursementSummary
import logging
import re

def process_data(mtr_df: pd.DataFrame, payment_df: pd.DataFrame) -> Dict[str, pd.DataFrame]:
    try:
        logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
        logger = logging.getLogger(__name__)

        logger.info("Processing data...")
        mtr_df = mtr_df.copy()
        mtr_df = mtr_df[mtr_df['Transaction Type'] != 'Cancel']
        mtr_df['Transaction Type'] = mtr_df['Transaction Type'].replace({'Refund': 'Return', 'FreeReplacement': 'Return'})

        payment_df = payment_df[payment_df['type'] != 'Transfer']
        payment_df = payment_df.rename(columns={'type': 'Payment Type'})
        payment_df['Payment Type'] = payment_df['Payment Type'].replace({
            'Adjustment': 'Order', 'FBA Inventory Fee': 'Order',
            'Fulfilment Fee Refund': 'Order', 'Service Fee': 'Order',
            'Refund': 'Return'
        })
        payment_df['Transaction Type'] = 'Payment'

        mtr_df = mtr_df.rename(columns={'Order Id': 'Order ID'})
        payment_df = payment_df.rename(columns={'order id': 'Order ID', 'total': 'Net Amount'})
        
        merged_df = pd.merge(
            mtr_df[['Order ID', 'Transaction Type', 'Invoice Amount', 'Order Date']],
            payment_df[['Order ID', 'Payment Type', 'Net Amount', 'description']],
            on='Order ID',
            how='inner'
        )

        def categorize_reimbursement(description):
            if 'Cost of Advertising' in description:
                return 'Cost of Advertising'
            elif 'FBA Inbound Pickup Service' in description:
                return 'FBA Inbound Pickup Service'
            elif 'FBA Inventory' in description:
                return 'FBA Inventory Storage Fee'
            else:
                return 'Other'

        blank_orders = payment_df[payment_df['Order ID'].isna() | (payment_df['Order ID'] == '')]
        blank_orders['Category'] = blank_orders['description'].apply(categorize_reimbursement)
        blank_order_summary = blank_orders.groupby('Category')['Net Amount'].sum().reset_index()
        blank_order_summary = blank_order_summary.rename(columns={'Category': 'description'})
        blank_order_summary = blank_order_summary.sort_values('Net Amount', ascending=False)

        merged_df = merged_df[merged_df['Order ID'].notna()]

        reimbursements = merged_df[
            (merged_df['description'].str.contains('Reimbursement', case=False, na=False)) |
            (merged_df['Payment Type'].str.contains('Reimbursement', case=False, na=False))
        ]


        reimbursements['Reimbursement Type'] = reimbursements['description'].apply(categorize_reimbursement)

        reimbursement_summary = reimbursements.groupby('Reimbursement Type')['Net Amount'].sum().reset_index()
        
        merged_df['Invoice Amount'] = pd.to_numeric(merged_df['Invoice Amount'], errors='coerce')
        merged_df['Net Amount'] = pd.to_numeric(merged_df['Net Amount'], errors='coerce')


        def check_tolerance(row):
            pna = row['Net Amount']
            if row['Invoice Amount'] is None or row['Invoice Amount'] == 0 or pd.isna(row['Net Amount']):
                return 'N/A'
            percentage = (row['Net Amount'] / row['Invoice Amount']) * 100

            if 0 < pna <= 300:
                return 'Within Tolerance' if percentage > 50 else 'Tolerance Breached'
            elif 300 < pna <= 500:
                return 'Within Tolerance' if percentage > 45 else 'Tolerance Breached'
            elif 500 < pna <= 900:
                return 'Within Tolerance' if percentage > 43 else 'Tolerance Breached'
            elif 900 < pna <= 1500:
                return 'Within Tolerance' if percentage > 38 else 'Tolerance Breached'
            elif pna > 1500:
                return 'Within Tolerance' if percentage > 30 else 'Tolerance Breached'
            else:
                return 'N/A'

        tolerance_check = merged_df.groupby('Order ID')[['Net Amount', 'Invoice Amount']].sum().reset_index()

        tolerance_check.columns = ['Order ID', 'Net Amount', 'Invoice Amount']
        tolerance_check['Percentage'] = (tolerance_check['Net Amount'] / tolerance_check['Invoice Amount']) * 100
        tolerance_check['Tolerance Status'] = tolerance_check.apply(check_tolerance, axis=1)

        tolerance_check = tolerance_check[tolerance_check["Tolerance Status"] == 'Tolerance Breached']

        logger.info("Data processed successfully")
        return {
            'order_payment': merged_df,
            'blank_order': blank_order_summary,
            'tolerance_breached': tolerance_check,
            'reimbursement_summary': reimbursement_summary
        }

    except Exception as e:
        raise ValueError(f"Error processing data: {str(e)}")

def clean_data_for_json(data):
    """
    Recursively clean the data dictionary by replacing inf, -inf, and NaN with None.
    """
    if isinstance(data, dict):
        return {k: clean_data_for_json(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [clean_data_for_json(item) for item in data]
    elif isinstance(data, float):
        if math.isinf(data) or math.isnan(data):
            return None
    return data

def store_data_in_db(db: Session, result: Dict):
    db.query(Transaction).delete()
    db.query(BlankOrderSummary).delete()
    db.query(ToleranceCheck).delete()
    db.query(ReimbursementSummary).delete()

    def handle_date(date):
        return None if pd.isna(date) else date.strftime('%Y-%m-%d')

    def handle_float(value):
        if pd.isna(value):
            return None
        else:
            value = str(value).replace(',', '')
            
            if any(char.isdigit() for char in value):
                numeric_values = [float(s) for s in re.findall(r'-?\d+\.?\d*', value)]
                return sum(numeric_values)
            else:
                return float(value)

    def handle_string(value):
        return '' if pd.isna(value) else str(value).strip()

    # Store processed data
    for _, row in result['order_payment'].iterrows():
        db_item = Transaction(
            order_id=handle_string(row.get('Order ID')),
            transaction_type=handle_string(row.get('Transaction Type')),
            payment_type=handle_string(row.get('Payment Type')),
            invoice_amount=handle_float(row.get('Invoice Amount')),
            net_amount=handle_float(row.get('Net Amount')),
            p_description=handle_string(row.get('description')),
            order_date=handle_date(row.get('Order Date')),
            payment_date=handle_date(row.get('Payment Date'))
        )
        db.add(db_item)

    # Store blank order summary
    for _, row in result['blank_order'].iterrows():
        db_item = BlankOrderSummary(
            p_description=handle_string(row.get('description')),
            net_amount=handle_float(row.get('Net Amount'))
        )
        db.add(db_item)

    for _, row in result['reimbursement_summary'].iterrows():
        db_item = ReimbursementSummary(
            net_amount=handle_float(row.get('Net Amount')),
            reimbursement_type=handle_string(row.get('Reimbursement Type')),
        )
        db.add(db_item)

    # Store tolerance check results
    for _, row in result['tolerance_breached'].iterrows():
        db_item = ToleranceCheck(
            order_id=handle_string(row.get('Order ID')),
            payment_net_amount=handle_float(row.get('Net Amount')),
            shipment_invoice_amount=handle_float(row.get('Invoice Amount')),
            percentage=handle_float(row.get('Percentage')),
            tolerance_status=handle_string(row.get('Tolerance Status'))
        )
        db.add(db_item)

    db.commit()
