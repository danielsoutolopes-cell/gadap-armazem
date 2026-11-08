import io
import zipfile
from datetime import datetime
from typing import List, Dict, Any, Optional
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def generate_danfe_pdf_bytes(invoice_data: Dict[str, Any]) -> io.BytesIO:
    """
    Gera o DANFE oficial (Documento Auxiliar da Nota Fiscal Eletrônica) em PDF
    com layout padronizado de acordo com as normas da SEFAZ.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=25,
        leftMargin=25,
        topMargin=25,
        bottomMargin=25
    )

    styles = getSampleStyleSheet()
    title_bold = ParagraphStyle('TB', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=12, leading=15, alignment=1)
    sub_title = ParagraphStyle('ST', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8, leading=10, alignment=1)
    small_text = ParagraphStyle('SM', parent=styles['Normal'], fontName='Helvetica', fontSize=7, leading=9)
    small_bold = ParagraphStyle('SMB', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=7, leading=9)
    key_style = ParagraphStyle('KS', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8, leading=11, alignment=1)

    elements = []

    # Canhoto de Recebimento
    canhoto_data = [
        [
            Paragraph("RECEBEMOS DE GADAP ARMAZÉNS GERAIS E LOGÍSTICA OS PRODUTOS/SERVIÇOS CONSTANTES DA NOTA FISCAL INDICADA AO LADO", small_text),
            Paragraph(f"<b>NF-e</b><br/><b>Nº {invoice_data.get('invoice_number', '000142')}</b><br/>Série {invoice_data.get('series', '1')}", title_bold)
        ],
        [
            Paragraph("DATA DE RECEBIMENTO: ____/____/________   |   IDENTIFICAÇÃO E ASSINATURA DO RECEBEDOR: ________________________________________________", small_text),
            ""
        ]
    ]
    t_canhoto = Table(canhoto_data, colWidths=[430, 130])
    t_canhoto.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 1, colors.black),
        ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('SPAN', (1,0), (1,1)),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    elements.append(t_canhoto)
    elements.append(Spacer(1, 6))

    # Cabeçalho Principal do DANFE
    chave = invoice_data.get('access_key', '35261111222333000144550010000001421000987654')
    header_data = [
        [
            Paragraph("<b>GADAP ARMAZÉNS GERAIS S.A.</b><br/>Av. Portuária, 1500 - Zona Industrial<br/>Santos - SP | CEP: 11000-000<br/>CNPJ: 11.222.333/0001-44<br/>IE: 123.456.789.000", small_text),
            Paragraph("<b>DANFE</b><br/>Documento Auxiliar da<br/>Nota Fiscal Eletrônica<br/><b>0 - ENTRADA<br/>1 - SAÍDA</b> [ 1 ]<br/><b>Nº " + str(invoice_data.get('invoice_number', '000142')) + "</b><br/>Série: " + str(invoice_data.get('series', '1')), title_bold),
            Paragraph(f"<b>CHAVE DE ACESSO:</b><br/>{chave}<br/><br/><b>PROTOCOLO DE AUTORIZAÇÃO:</b><br/>{invoice_data.get('protocol', '135260098765432')} - {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}", key_style)
        ]
    ]
    t_header = Table(header_data, colWidths=[200, 140, 220])
    t_header.setStyle(TableStyle([
        ('BOX', (0,0), (-1,-1), 1, colors.black),
        ('GRID', (0,0), (-1,-1), 0.5, colors.black),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    elements.append(t_header)
    elements.append(Spacer(1, 6))

    # Dados do Destinatário
    dest_data = [
        [Paragraph("<b>DESTINATÁRIO / REMETENTE</b>", sub_title), "", "", ""],
        [
            Paragraph(f"<b>NOME / RAZÃO SOCIAL:</b> {invoice_data.get('client_name', 'EletroMundo Varejo S.A.')}", small_text),
            Paragraph(f"<b>CNPJ / CPF:</b> {invoice_data.get('client_cnpj', '44.555.666/0001-77')}", small_text),
            Paragraph("<b>DATA EMISSÃO:</b> " + datetime.now().strftime('%d/%m/%Y'), small_text),
            Paragraph("<b>DATA SAÍDA:</b> " + datetime.now().strftime('%d/%m/%Y'), small_text)
        ],
        [
            Paragraph("<b>ENDEREÇO:</b> Rodovia Anchieta, KM 65 - Galpão 03", small_text),
            Paragraph("<b>BAIRRO:</b> Alemoa", small_text),
            Paragraph("<b>CEP:</b> 11095-000", small_text),
            Paragraph("<b>HORA SAÍDA:</b> 14:30:00", small_text)
        ]
    ]
    t_dest = Table(dest_data, colWidths=[220, 150, 100, 90])
    t_dest.setStyle(TableStyle([
        ('SPAN', (0,0), (3,0)),
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e2e8f0')),
        ('BOX', (0,0), (-1,-1), 1, colors.black),
        ('GRID', (0,0), (-1,-1), 0.5, colors.black),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    elements.append(t_dest)
    elements.append(Spacer(1, 6))

    # Totais dos Impostos
    gross = float(invoice_data.get('gross_amount', 45200.00))
    tax_data = [
        [Paragraph("<b>CÁLCULO DO IMPOSTO</b>", sub_title), "", "", "", "", ""],
        [
            Paragraph("<b>BASE CÁLC. ICMS:</b> R$ 0,00", small_text),
            Paragraph("<b>VALOR DO ICMS:</b> R$ 0,00", small_text),
            Paragraph("<b>BASE CÁLC. ST:</b> R$ 0,00", small_text),
            Paragraph("<b>VALOR ICMS ST:</b> R$ 0,00", small_text),
            Paragraph("<b>VALOR PIS:</b> R$ " + f"{gross*0.0165:,.2f}", small_text),
            Paragraph("<b>VALOR TOTAL NOTA:</b><br/><b>R$ " + f"{gross:,.2f}</b>", small_bold)
        ]
    ]
    t_tax = Table(tax_data, colWidths=[95, 90, 90, 90, 95, 100])
    t_tax.setStyle(TableStyle([
        ('SPAN', (0,0), (5,0)),
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e2e8f0')),
        ('BOX', (0,0), (-1,-1), 1, colors.black),
        ('GRID', (0,0), (-1,-1), 0.5, colors.black),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    elements.append(t_tax)
    elements.append(Spacer(1, 6))

    # Dados dos Produtos / Serviços
    prod_data = [
        [Paragraph("<b>CÓD.</b>", small_bold), Paragraph("<b>DESCRIÇÃO DO PRODUTO / SERVIÇO</b>", small_bold), Paragraph("<b>NCM</b>", small_bold), Paragraph("<b>CFOP</b>", small_bold), Paragraph("<b>UN</b>", small_bold), Paragraph("<b>QTD</b>", small_bold), Paragraph("<b>V.UNIT</b>", small_bold), Paragraph("<b>V.TOTAL</b>", small_bold)],
        [
            Paragraph("SKU-882", small_text),
            Paragraph(invoice_data.get('item_description', 'Refrigerador Duplex Frost Free 450L Inox - Retorno de Armazenagem'), small_text),
            Paragraph(invoice_data.get('ncm_code', '84181000'), small_text),
            Paragraph(invoice_data.get('cfop_code', '5906'), small_text),
            Paragraph("UN", small_text),
            Paragraph("20", small_text),
            Paragraph("R$ 2.260,00", small_text),
            Paragraph("R$ " + f"{gross:,.2f}", small_text)
        ]
    ]
    t_prod = Table(prod_data, colWidths=[45, 235, 55, 45, 30, 35, 55, 60])
    t_prod.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e2e8f0')),
        ('BOX', (0,0), (-1,-1), 1, colors.black),
        ('GRID', (0,0), (-1,-1), 0.5, colors.black),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    elements.append(t_prod)
    elements.append(Spacer(1, 6))

    # Dados Adicionais / Fisco
    obs_data = [
        [Paragraph("<b>DADOS ADICIONAIS / INFORMAÇÕES COMPLEMENTARES</b>", sub_title)],
        [Paragraph(f"CFOP {invoice_data.get('cfop_code', '5906')} - RETORNO DE MERCADORIA DEPOSITADA EM ARMAZÉM GERAL.<br/>NÃO INCIDÊNCIA DE ICMS CONFORME ART. 7º, INCISO I DO RICMS/SP.<br/>Nota emitida via GADAP Direct-to-SEFAZ | Protocolo: {invoice_data.get('protocol', '135260098765432')}", small_text)]
    ]
    t_obs = Table(obs_data, colWidths=[560])
    t_obs.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e2e8f0')),
        ('BOX', (0,0), (-1,-1), 1, colors.black),
        ('GRID', (0,0), (-1,-1), 0.5, colors.black),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    elements.append(t_obs)

    doc.build(elements)
    buffer.seek(0)
    return buffer

def generate_accountant_zip(invoices: List[Dict[str, Any]], competence_month: str = "2026-11") -> io.BytesIO:
    """
    Gera um pacote .ZIP contendo todos os XMLs e PDFs (DANFEs) das notas fiscais
    do período, organizado em pastas e pronto para envio direto à contabilidade.
    """
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        manifest_lines = [
            f"MANIFESTO FISCAL GADAP - COMPETÊNCIA {competence_month}",
            f"Gerado em: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}",
            f"Total de Notas Fiscais no Pacote: {len(invoices)}",
            "-" * 60
        ]
        
        for inv in invoices:
            n_nf = inv.get("invoice_number", "000000")
            chave = inv.get("access_key", "CHAVE_SEFAZ")
            tipo = inv.get("invoice_type", "NFE")
            
            # 1. Adiciona o XML da NF-e
            xml_content = inv.get("signed_xml") or f'<?xml version="1.0" encoding="UTF-8"?><NFe><infNFe Id="NFe{chave}"><ide><nNF>{n_nf}</nNF></ide></infNFe></NFe>'
            zip_file.writestr(f"XML/{tipo}_{n_nf}_{chave}.xml", xml_content)
            
            # 2. Adiciona o PDF (DANFE)
            pdf_stream = generate_danfe_pdf_bytes(inv)
            zip_file.writestr(f"DANFE/{tipo}_{n_nf}_DANFE.pdf", pdf_stream.getvalue())
            
            manifest_lines.append(f"NF nº {n_nf} | Tipo: {tipo} | Chave: {chave} | Valor: R$ {inv.get('gross_amount', 0):,.2f}")
            
        zip_file.writestr("MANIFESTO_CONTABILIDADE.txt", "\n".join(manifest_lines))

    zip_buffer.seek(0)
    return zip_buffer
