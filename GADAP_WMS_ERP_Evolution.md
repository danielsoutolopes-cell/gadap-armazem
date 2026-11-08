# GADAP WMS / ERP - Documento de Evolução Backoffice & Supply Chain
**Gerado em:** 07/11/2026 21:34:09  
**Versão:** 4.0.0-ENTERPRISE  
**Escopo:** Prompts 04 ao 09 Homologados (Outbound, Portal B2B, Inventário Cego ABC, TMS Lite, Billing Final e Academy)

---

## 1. Visão Geral da Arquitetura WMS / ERP

O sistema **GADAP Armazém** integra em tempo real as operações físicas de galpão ao backoffice administrativo e fiscal de armazéns gerais e recintos alfandegados.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ARQUITETURA GADAP WMS / ERP                     │
├─────────────────────┬──────────────────────────┬───────────────────────┤
│   FRONTEND NEXT.JS  │      BACKEND FASTAPI     │    SUPABASE DB + RLS  │
├─────────────────────┼──────────────────────────┼───────────────────────┤
│ • Torre de Controle │ • Picking & Outbound     │ • inventory_audits    │
│ • Conciliação ABC   │ • Cycle Counting ABC     │ • tms_shipments       │
│ • TMS Rastreio      │ • ZPL Label Engine       │ • fiscal_closures     │
│ • Fechamento Lote   │ • Carrier Webhooks       │ • RLS por Client /    │
│ • Portal B2B Cliente│ • Asaas Gateway Billing  │   Tenant              │
│ • Academy Treinamento│ • NFS-e & NF-e CFOP 5906│ • Triggers & Índices  │
└─────────────────────┴──────────────────────────┴───────────────────────┘
```

---

## 2. Prompt 04: Motor de Expedição e Faturamento de Armazenagem

1. **Alteração de Status para `DISPATCHED`:** Ao concluir 100% da conferência cega do pedido na doca de expedição, o lote passa ao status `DISPATCHED` / `LOADED`, liberando a vaga física e emitindo o Romaneio/Packing List oficial.
2. **Faturamento de Armazenagem por Espaço Ocupado:** Rotina periódica que calcula as diárias por decêndio (10 dias) considerando a taxa *Ad Valorem* sobre o valor CIF da carga, peso bruto (Handling In/Out) e dias de permanência.

---

## 3. Prompt 05: Portal B2B do Depositante (Autoatendimento)

- **Segurança RLS Restrita:** Regra de Row Level Security garantindo que usuários com role `CLIENT` acessem estritamente os registros vinculados ao seu `client_id`.
- **Visibilidade Integral:** Painel moderno com status da mercadoria em tempo real (`Armazenado`, `Quarentena Fiscal`, `Expedido`), faturas decendiais e botão de **Exportação de Posição de Estoque em PDF**.

---

## 4. Prompt 06: Motor de Inventário Cego (Conciliação ERP / Curva ABC)

### 4.1. Algoritmo de Classificação Curva ABC
- **Classe A (80% do valor):** Auditado semanalmente por contagem cega.
- **Classe B (15% do valor):** Auditado quinzenalmente.
- **Classe C (5% do valor):** Auditado mensalmente.

### 4.2. Contagem Cega e Reconciliação
- O conferente de campo digita as quantidades físicas sem visualizar o saldo contábil da posição (`blind_counted_qty`).
- Discrepâncias emitem alertas de **Quebra de Estoque** (falta) ou **Sobra Física**.
- A tela de **Conciliação de Inventário** permite que o auditor fiscal homologue o ajuste no ERP.

---

## 5. Prompt 07: TMS Lite (Roteirização e Integração de Etiquetas)

- **Geração de Etiquetas ZPL/GS1:** Rota `POST /api/v1/logistics/tms/shipping-labels` compilando comandos térmicos Zebra nativos para caixas e paletes.
- **Webhooks de Telemetria:** Endpoint para recepção de eventos de rastreamento das transportadoras com atualização no painel TMS e no portal do cliente.

---

## 6. Prompt 08: Billing Final e Emissão Fiscal (NFS-e e NF-e Retorno)

No encerramento da competência mensal:
1. **Consolidação Financeira:** Agregação de diárias de armazenagem decendial, movimentação de pátio (handling) e serviços extras spot.
2. **Integração de Cobrança:** Disparo via Gateway de Pagamento (Asaas) gerando boleto bancário e chave Pix.
3. **Emissão de NFS-e:** Nota de Serviço municipal para tributação de armazenagem.
4. **Emissão de NF-e de Retorno Simbólico:** Emissão com **CFOP 5.906 / 6.906** (Retorno simbólico de mercadorias em depósito fechado ou armazém geral), encerrando o ciclo fiscal junto à Receita/SEFAZ.

---

## 7. Prompt 09: Academy e Manuais de Campo

O módulo Academy (`app/dashboard/academy/page.tsx`) disponibiliza trilhas interativas para:
- Recebimento cego na doca com Zero-Storage.
- Operação de Inventário Rotativo ABC.
- Roteirização TMS e impressão térmica ZPL.
- Fechamento mensal em lote e compliance tributário.
