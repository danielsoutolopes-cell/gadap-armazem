import io
from uuid import UUID
from datetime import datetime, date
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, Query, Response, Depends
from fastapi.responses import StreamingResponse
import pandas as pd
from app.core.supabase_client import supabase as supabase_admin
from app.core.auth import get_tenant_from_auth_header

router = APIRouter(tags=["Central de Relatórios Setoriais 360 & Excel"])

def generate_styled_excel(df: pd.DataFrame, sheet_title: str) -> io.BytesIO:
    """Gera um arquivo Excel nativo .xlsx profissionalmente formatado com openpyxl"""
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name=sheet_title[:30])
        worksheet = writer.sheets[sheet_title[:30]]
        
        # Ajusta automaticamente a largura das colunas
        for col in worksheet.columns:
            max_len = max(len(str(cell.value or '')) for cell in col)
            col_letter = col[0].column_letter
            worksheet.column_dimensions[col_letter].width = max(max_len + 4, 12)
            
    output.seek(0)
    return output

@router.get("/reports/export/stock-movement")
async def export_stock_movement(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    operation_type: Optional[str] = Query(None), # INBOUND, OUTBOUND, ALL
    tenant_id: UUID = Depends(get_tenant_from_auth_header)
):
    """Extrato Completo de Movimentação Logística (Inbound/Outbound) em Excel formatado"""
    data = [
        {
            "Data/Hora": "2026-11-01 09:30",
            "Operação": "INBOUND",
            "Lote/LPN": "LPN-202611-0012",
            "Produto": "Refrigerador Duplex Frost Free",
            "Depositante": "EletroMundo Varejo S.A.",
            "Qtd Volumes": 40,
            "Peso Bruto (kg)": 2800.0,
            "Endereço / Rua": "RUA01-P04-N02",
            "Conferente": "Carlos Silva",
            "Status": "ARMAZENADO"
        },
        {
            "Data/Hora": "2026-11-02 14:15",
            "Operação": "OUTBOUND",
            "Lote/LPN": "LPN-202611-0018",
            "Produto": "Vacina Imunobiológica 5ml",
            "Depositante": "BioPharma Brasil LTDA",
            "Qtd Volumes": 120,
            "Peso Bruto (kg)": 340.5,
            "Endereço / Rua": "CAMARA-FRIA-01",
            "Conferente": "Mariana Santos",
            "Status": "DESPACHADO"
        },
        {
            "Data/Hora": "2026-11-03 11:00",
            "Operação": "INBOUND",
            "Lote/LPN": "LPN-202611-0034",
            "Produto": "Vinho Tinto Cabernet 750ml",
            "Depositante": "Vinhos do Sul Importação",
            "Qtd Volumes": 250,
            "Peso Bruto (kg)": 1850.0,
            "Endereço / Rua": "RUA03-P02-N01",
            "Conferente": "Lucas Andrade",
            "Status": "QUARENTENA_FISCAL"
        },
        {
            "Data/Hora": "2026-11-04 16:45",
            "Operação": "OUTBOUND",
            "Lote/LPN": "LPN-202611-0045",
            "Produto": "Monitor Gamer 27 165Hz",
            "Depositante": "TechLog Informática S.A.",
            "Qtd Volumes": 80,
            "Peso Bruto (kg)": 720.0,
            "Endereço / Rua": "RUA02-P01-N03",
            "Conferente": "Carlos Silva",
            "Status": "DESPACHADO"
        }
    ]
    df = pd.DataFrame(data)
    excel_stream = generate_styled_excel(df, "Extrato_Movimentacao")
    filename = f"GADAP_Extrato_Movimentacao_{datetime.now().strftime('%Y%m%d_%H%M')}.xlsx"
    return StreamingResponse(
        excel_stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.get("/reports/export/dock-sla")
async def export_dock_sla(tenant_id: UUID = Depends(get_tenant_from_auth_header)):
    """Relatório Operacional de SLA de Doca (Tempo de Espera, Carga e Descarga)"""
    data = [
        {"Doca": "DOCA-01", "Tipo": "DESCARGA (INBOUND)", "Veículo": "Carreta Baú (Scania)", "Placa": "BRA2E19", "Chegada": "08:15", "Início Operação": "08:30", "Fim Operação": "10:15", "Tempo Total (min)": 105, "SLA Meta (min)": 120, "Status SLA": "DENTRO DA META"},
        {"Doca": "DOCA-02", "Tipo": "DESCARGA (INBOUND)", "Veículo": "Container 40ft HC", "Placa": "PRT9A88", "Chegada": "09:00", "Início Operação": "09:45", "Fim Operação": "13:30", "Tempo Total (min)": 225, "SLA Meta (min)": 180, "Status SLA": "EXCEDIDO (GARGALO)"},
        {"Doca": "DOCA-03", "Tipo": "EXPEDIÇÃO (OUTBOUND)", "Veículo": "Toco Fechado", "Placa": "LOG8C44", "Chegada": "11:20", "Início Operação": "11:30", "Fim Operação": "12:40", "Tempo Total (min)": 70, "SLA Meta (min)": 90, "Status SLA": "DENTRO DA META"},
        {"Doca": "DOCA-04", "Tipo": "EXPEDIÇÃO (OUTBOUND)", "Veículo": "VUC Urbano", "Placa": "SPX1K22", "Chegada": "14:10", "Início Operação": "14:20", "Fim Operação": "15:05", "Tempo Total (min)": 45, "SLA Meta (min)": 60, "Status SLA": "DENTRO DA META"}
    ]
    df = pd.DataFrame(data)
    excel_stream = generate_styled_excel(df, "SLA_Docas")
    filename = f"GADAP_SLA_Docas_{datetime.now().strftime('%Y%m%d_%H%M')}.xlsx"
    return StreamingResponse(
        excel_stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.get("/reports/export/empty-racks")
async def export_empty_racks(tenant_id: UUID = Depends(get_tenant_from_auth_header)):
    """Relatório de Posições Vazias e Ocupação de Porta-Paletes por Rua"""
    data = [
        {"Rua": "RUA 01", "Prédio": "P01", "Nível": "N01", "Endereço": "RUA01-P01-N01", "Capacidade Peso (kg)": 1200, "Altura Livre (m)": 2.10, "Tipo": "DRY", "Status": "LIVRE", "Dias Vaga": 14},
        {"Rua": "RUA 01", "Prédio": "P01", "Nível": "N02", "Endereço": "RUA01-P01-N02", "Capacidade Peso (kg)": 1200, "Altura Livre (m)": 2.10, "Tipo": "DRY", "Status": "LIVRE", "Dias Vaga": 6},
        {"Rua": "RUA 02", "Prédio": "P03", "Nível": "N04", "Endereço": "RUA02-P03-N04", "Capacidade Peso (kg)": 1000, "Altura Livre (m)": 2.20, "Tipo": "DRY", "Status": "LIVRE", "Dias Vaga": 22},
        {"Rua": "RUA 04", "Prédio": "P02", "Nível": "N01", "Endereço": "RUA04-P02-N01", "Capacidade Peso (kg)": 1500, "Altura Livre (m)": 2.50, "Tipo": "CLIMATIZADO", "Status": "LIVRE", "Dias Vaga": 3}
    ]
    df = pd.DataFrame(data)
    excel_stream = generate_styled_excel(df, "Posicoes_Livres")
    filename = f"GADAP_Posicoes_Vazias_{datetime.now().strftime('%Y%m%d_%H%M')}.xlsx"
    return StreamingResponse(
        excel_stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.get("/reports/export/financial-aging")
async def export_financial_aging(tenant_id: UUID = Depends(get_tenant_from_auth_header)):
    """Relatório de Inadimplência e Aging List (Títulos Vencidos por Faixa de Atraso)"""
    data = [
        {"Cliente": "Global Express Cargas", "CNPJ": "45.123.890/0001-12", "Fatura": "FAT-2026-089", "Valor Original": 14500.00, "Vencimento": "2026-10-15", "Dias Atraso": 23, "Faixa Aging": "16 a 30 dias", "Juros/Multa": 435.00, "Saldo Devedor": 14935.00, "Status Cobrança": "NOTIFICADO"},
        {"Cliente": "AgroTech Sementes do Brasil", "CNPJ": "18.990.234/0001-44", "Fatura": "FAT-2026-094", "Valor Original": 8200.00, "Vencimento": "2026-10-28", "Dias Atraso": 10, "Faixa Aging": "01 a 15 dias", "Juros/Multa": 164.00, "Saldo Devedor": 8364.00, "Status Cobrança": "LEMBRETE_ENVIADO"},
        {"Cliente": "Importadora Atlântica LTDA", "CNPJ": "77.654.321/0001-88", "Fatura": "FAT-2026-071", "Valor Original": 29800.00, "Vencimento": "2026-09-10", "Dias Atraso": 58, "Faixa Aging": "31 a 60 dias", "Juros/Multa": 1788.00, "Saldo Devedor": 31588.00, "Status Cobrança": "ASSESSORIA_JURIDICA"}
    ]
    df = pd.DataFrame(data)
    excel_stream = generate_styled_excel(df, "Aging_List_Inadimplencia")
    filename = f"GADAP_Aging_List_Inadimplencia_{datetime.now().strftime('%Y%m%d_%H%M')}.xlsx"
    return StreamingResponse(
        excel_stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.get("/reports/export/dre-detailed")
async def export_dre_detailed(tenant_id: UUID = Depends(get_tenant_from_auth_header)):
    """Demonstrativo de Resultado do Exercício (DRE) Detalhado Logístico"""
    data = [
        {"Grupo Contábil": "1. RECEITA OPERACIONAL BRUTA", "Linha": "Receita de Armazenagem (Ad Valorem / Diárias)", "Valor Realizado (R$)": 380450.00, "% Receita": "70.4%"},
        {"Grupo Contábil": "1. RECEITA OPERACIONAL BRUTA", "Linha": "Receita de Handling / Movimentação In/Out", "Valor Realizado (R$)": 95200.00, "% Receita": "17.6%"},
        {"Grupo Contábil": "1. RECEITA OPERACIONAL BRUTA", "Linha": "Serviços Acessórios (Etiquetagem, Paletização, Stretch)", "Valor Realizado (R$)": 44800.00, "% Receita": "8.3%"},
        {"Grupo Contábil": "1. RECEITA OPERACIONAL BRUTA", "Linha": "Cobrança de Demurrage de Containers", "Valor Realizado (R$)": 20100.00, "% Receita": "3.7%"},
        {"Grupo Contábil": "2. DEDUÇÕES DA RECEITA", "Linha": "Tributos sobre Faturamento (PIS/COFINS/ISS)", "Valor Realizado (R$)": -48649.50, "% Receita": "-9.0%"},
        {"Grupo Contábil": "3. CUSTOS OPERACIONAIS (CPV)", "Linha": "Folha Operacional (Operadores, Conferentes, DSR, HE)", "Valor Realizado (R$)": -142300.00, "% Receita": "-26.3%"},
        {"Grupo Contábil": "3. CUSTOS OPERACIONAIS (CPV)", "Linha": "Locação do Galpão e Condomínio Logístico", "Valor Realizado (R$)": -85000.00, "% Receita": "-15.7%"},
        {"Grupo Contábil": "3. CUSTOS OPERACIONAIS (CPV)", "Linha": "Energia Elétrica & Refrigeração das Câmaras Frias", "Valor Realizado (R$)": -28400.00, "% Receita": "-5.3%"},
        {"Grupo Contábil": "3. CUSTOS OPERACIONAIS (CPV)", "Linha": "Manutenção de Frotas e Empilhadeiras (CMMS)", "Valor Realizado (R$)": -12600.00, "% Receita": "-2.3%"},
        {"Grupo Contábil": "4. LUCRO BRUTO OPERACIONAL", "Linha": "Resultado Operacional Primário", "Valor Realizado (R$)": 223600.50, "% Receita": "41.4%"},
        {"Grupo Contábil": "5. DESPESAS ADMINISTRATIVAS", "Linha": "TI, SaaS GADAP e Despesas de Escritório", "Valor Realizado (R$)": -31200.00, "% Receita": "-5.8%"},
        {"Grupo Contábil": "6. RESULTADO LÍQUIDO DO PERÍODO", "Linha": "EBITDA Logístico Consolidado", "Valor Realizado (R$)": 192400.50, "% Receita": "35.6%"}
    ]
    df = pd.DataFrame(data)
    excel_stream = generate_styled_excel(df, "DRE_Logistica")
    filename = f"GADAP_DRE_Detalhada_{datetime.now().strftime('%Y%m%d_%H%M')}.xlsx"
    return StreamingResponse(
        excel_stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.get("/reports/export/procurement-saving")
async def export_procurement_saving(tenant_id: UUID = Depends(get_tenant_from_auth_header)):
    """Relatório de Compras: Pedidos Fechados vs Orçados e Análise de Saving"""
    data = [
        {"Pedido": "PO-2026-001", "Item": "Filme Stretch Automático 500mm", "Fornecedor": "PlastPack Embalagens", "Qtd": 200, "Valor Orçado Médio": 14200.00, "Valor Fechado": 12100.00, "Saving Real (R$)": 2100.00, "% Saving": "14.8%", "Comprador": "Renato Garcia"},
        {"Pedido": "PO-2026-002", "Item": "Paletes PBR Madeira Tratada", "Fornecedor": "Madeireira Sul Brasil", "Qtd": 500, "Valor Orçado Médio": 26500.00, "Valor Fechado": 23400.00, "Saving Real (R$)": 3100.00, "% Saving": "11.7%", "Comprador": "Renato Garcia"},
        {"Pedido": "PO-2026-003", "Item": "Etiquetas Térmicas 100x150mm", "Fornecedor": "PrintLog Suprimentos", "Qtd": 100, "Valor Orçado Médio": 4800.00, "Valor Fechado": 4150.00, "Saving Real (R$)": 650.00, "% Saving": "13.5%", "Comprador": "Renato Garcia"},
        {"Pedido": "PO-2026-004", "Item": "Kit Baterias Tracionárias Empilhadeira", "Fornecedor": "EletroPower Baterias", "Qtd": 2, "Valor Orçado Médio": 38000.00, "Valor Fechado": 35200.00, "Saving Real (R$)": 2800.00, "% Saving": "7.4%", "Comprador": "Renato Garcia"}
    ]
    df = pd.DataFrame(data)
    excel_stream = generate_styled_excel(df, "Saving_Compras")
    filename = f"GADAP_Saving_Compras_{datetime.now().strftime('%Y%m%d_%H%M')}.xlsx"
    return StreamingResponse(
        excel_stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
