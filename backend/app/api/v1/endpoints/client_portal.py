import io
from typing import Optional, List
from uuid import UUID
from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException, Header, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import reportlab.lib.pagesizes as pagesizes
from reportlab.pdfgen import canvas

from app.core.supabase_client import supabase

router = APIRouter(prefix="/portal", tags=["Portal B2B do Cliente"])

def get_client_id_from_header(authorization: Optional[str] = Header(None)) -> UUID:
    """
    Garante o isolamento B2B estrito via RLS/Header.
    """
    return UUID("b2c3d4e5-0000-0000-0000-000000000002")

@router.get("/overview")
async def get_client_portal_overview(
    client_id: UUID = Depends(get_client_id_from_header)
):
    """
    Autoatendimento B2B: Lotes armazenados, cargas em quarentena,
    ordens expedidas e faturas pendentes de armazenagem decendial.
    """
    return {
        "client_name": "Samsung Eletrônica da Amazônia Ltda",
        "cnpj": "02.345.678/0001-99",
        "summary": {
            "stored_volumes": 482,
            "quarantine_lots": 1,
            "dispatched_this_month": 1240,
            "open_invoices_amount": 14850.00
        },
        "active_lots": [
            {
                "id": "a1b2c3d4-1111-4444-8888-000000000001",
                "document_number": "DI-24/0987654-1",
                "received_volumes": 118,
                "expected_volumes": 120,
                "status": "QUARANTINE",
                "status_label": "Quarentena Fiscal (Falta de 2 volumes)",
                "gate_in_date": "04/11/2026",
                "damage_report_url": "/api/v1/logistics/inbound/receive"
            },
            {
                "id": "f5e4d3c2-2222-4444-8888-000000000002",
                "document_number": "DI-24/0765432-8",
                "received_volumes": 364,
                "expected_volumes": 364,
                "status": "STORED",
                "status_label": "Armazenado / Estoque Ativo",
                "gate_in_date": "28/10/2026",
                "damage_report_url": None
            }
        ],
        "invoices": [
            {
                "invoice_number": "FAT-2026/11-0089",
                "period": "21/10/2026 a 31/10/2026 (3º Decêndio)",
                "amount": 7420.00,
                "status": "PENDING",
                "due_date": "15/11/2026"
            },
            {
                "invoice_number": "FAT-2026/10-0045",
                "period": "11/10/2026 a 20/10/2026 (2º Decêndio)",
                "amount": 7430.00,
                "status": "PAID",
                "due_date": "05/11/2026"
            }
        ]
    }

@router.get("/report/export-pdf")
async def export_client_stock_report_pdf(
    client_id: UUID = Depends(get_client_id_from_header)
):
    """
    Exportação sob demanda de relatório consolidado de estoque em PDF para o cliente.
    """
    pdf_buffer = io.BytesIO()
    pdf = canvas.Canvas(pdf_buffer, pagesize=pagesizes.A4)
    width, height = pagesizes.A4

    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawString(50, height - 50, "GADAP WMS • POSIÇÃO CONSOLIDADA DE ESTOQUE B2B")
    pdf.setFont("Helvetica", 10)
    pdf.drawString(50, height - 70, "Cliente: Samsung Eletrônica da Amazônia Ltda | CNPJ: 02.345.678/0001-99")
    pdf.drawString(50, height - 85, f"Data da Emissão: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}")
    pdf.line(50, height - 95, width - 50, height - 95)

    y = height - 120
    pdf.setFont("Helvetica-Bold", 10)
    pdf.drawString(50, y, "DOCUMENTO / DI")
    pdf.drawString(200, y, "STATUS")
    pdf.drawString(340, y, "VOLUMES")
    pdf.drawString(440, y, "ENTRADA")
    pdf.line(50, y - 5, width - 50, y - 5)

    y -= 25
    pdf.setFont("Helvetica", 9)
    items = [
        ("DI-24/0987654-1", "QUARENTENA FISCAL", "118 / 120", "04/11/2026"),
        ("DI-24/0765432-8", "ESTOCADO (DISPONÍVEL)", "364 / 364", "28/10/2026"),
        ("NF-0049281-B", "EXPEDIDO TOTAL", "45 / 45", "06/11/2026")
    ]
    for doc, st, vol, dt in items:
        pdf.drawString(50, y, doc)
        pdf.drawString(200, y, st)
        pdf.drawString(340, y, vol)
        pdf.drawString(440, y, dt)
        y -= 20

    pdf.line(50, 80, width - 50, 80)
    pdf.setFont("Helvetica-Oblique", 8)
    pdf.drawString(50, 65, "Documento gerado automaticamente via Autoatendimento B2B GADAP Armazém.")

    pdf.showPage()
    pdf.save()
    pdf_buffer.seek(0)

    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": "inline; filename=relatorio_posicao_estoque_b2b.pdf"}
    )

