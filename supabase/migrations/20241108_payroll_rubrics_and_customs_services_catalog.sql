-- ==============================================================================
-- MIGRATION: 20241108_payroll_rubrics_and_customs_services_catalog.sql
-- GADAP Armazém & WMS
-- 1. Catálogo Oficial de Rubricas da Folha de Pagamento (eSocial Simplificado S-1010)
-- 2. Tabela de Lançamentos de Rubricas do Colaborador (Proventos e Descontos)
-- 3. Catálogo Paramétrico de Serviços para Armazéns Gerais & Recintos Alfandegários (EADI/Porto Seco)
--    com Códigos Tributários Oficiais (NBS / LC 116 / CFOP) e Suporte a SKU/Código Único Exclusivo por Cliente (Multi-tenant)
-- ==============================================================================

-- 1. Catálogo Oficial de Rubricas da Folha
CREATE TABLE IF NOT EXISTS public.payroll_rubrics_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rubric_code VARCHAR(10) NOT NULL UNIQUE, -- '001', '105', '501', etc.
    name VARCHAR(150) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'PROVENTO', 'DESCONTO', 'INFORMATIVA'
    category VARCHAR(50) NOT NULL, -- 'SALARIAL', 'ADICIONAL', 'BENEFICIO', 'LEGAL', 'EXTRAORDINARIO'
    esocial_code VARCHAR(10), -- Tabela 03 do eSocial
    incides_inss BOOLEAN DEFAULT false,
    incides_fgts BOOLEAN DEFAULT false,
    incides_irrf BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seeds com TODAS as Rubricas da Legislação Trabalhista Brasileira
INSERT INTO public.payroll_rubrics_catalog (rubric_code, name, type, category, esocial_code, incides_inss, incides_fgts, incides_irrf)
VALUES
  -- Proventos Normais e Acréscimos
  ('001', 'Salário Base Contratual (220h)', 'PROVENTO', 'SALARIAL', '1000', true, true, true),
  ('101', 'Insalubridade (Grau Mínimo 10%)', 'PROVENTO', 'ADICIONAL', '1201', true, true, true),
  ('102', 'Insalubridade (Grau Médio 20% - Câmaras Frias)', 'PROVENTO', 'ADICIONAL', '1202', true, true, true),
  ('103', 'Insalubridade (Grau Máximo 40%)', 'PROVENTO', 'ADICIONAL', '1203', true, true, true),
  ('104', 'Periculosidade (30% - GLP/Operação Inflamáveis)', 'PROVENTO', 'ADICIONAL', '1205', true, true, true),
  ('105', 'Horas Extras 50% (Doca / Dias Úteis)', 'PROVENTO', 'ADICIONAL', '1003', true, true, true),
  ('106', 'Horas Extras 100% (Domingos e Feriados)', 'PROVENTO', 'ADICIONAL', '1004', true, true, true),
  ('120', 'Adicional Noturno 20% (Urbano)', 'PROVENTO', 'ADICIONAL', '1200', true, true, true),
  ('125', 'Hora Noturna Reduzida (Fator 52m30s)', 'PROVENTO', 'ADICIONAL', '1200', true, true, true),
  ('130', 'Reflexo DSR sobre Horas Extras e Adicionais', 'PROVENTO', 'ADICIONAL', '1010', true, true, true),
  ('140', 'Adicional de Função / Gratificação de Chefia', 'PROVENTO', 'SALARIAL', '1020', true, true, true),
  ('150', 'Diárias de Viagem / Ajuda de Custo (Acima 50%)', 'PROVENTO', 'EXTRAORDINARIO', '1300', true, true, true),
  ('160', 'Salário-Família (Previdenciário)', 'PROVENTO', 'BENEFICIO', '1401', false, false, false),
  -- Proventos Extraordinários
  ('201', 'Diferença de Dissídio Coletivo Retroativo (CCT)', 'PROVENTO', 'EXTRAORDINARIO', '1050', true, true, true),
  ('202', 'Multa Artigo 477 da CLT (Rescisão Atrasada)', 'PROVENTO', 'EXTRAORDINARIO', '6000', false, false, false),
  ('203', 'Auxílio Creche / Babá Regulamentar', 'PROVENTO', 'BENEFICIO', '1405', false, false, false),
  ('301', 'Participação nos Lucros e Resultados (PLR)', 'PROVENTO', 'EXTRAORDINARIO', '1025', false, false, true),
  ('305', 'Prêmio de Produtividade / Assiduidade', 'PROVENTO', 'EXTRAORDINARIO', '1030', false, false, true),
  ('310', 'Abono Pecuniário de Férias (Venda de 10 dias)', 'PROVENTO', 'EXTRAORDINARIO', '1021', false, false, false),
  -- Descontos Oficiais e Legais
  ('501', 'INSS Folha (Tabela Progressiva)', 'DESCONTO', 'LEGAL', '9201', false, false, false),
  ('502', 'IRRF Retido na Fonte', 'DESCONTO', 'LEGAL', '9203', false, false, false),
  ('510', 'Pensão Alimentícia Judicial', 'DESCONTO', 'LEGAL', '9210', false, false, false),
  ('540', 'Desconto DSR / Faltas Não Justificadas', 'DESCONTO', 'LEGAL', '9209', true, true, true),
  ('545', 'Atrasos / Saídas Antecipadas', 'DESCONTO', 'LEGAL', '9209', true, true, true),
  -- Descontos de Benefícios & Convênios
  ('520', 'Vale Transporte (Teto 6% Salário Base)', 'DESCONTO', 'BENEFICIO', '9215', false, false, false),
  ('530', 'Vale Refeição / Alimentação (Coparticipação PAT)', 'DESCONTO', 'BENEFICIO', '9216', false, false, false),
  ('550', 'Plano de Saúde Médico (Titular + Dependentes)', 'DESCONTO', 'BENEFICIO', '9219', false, false, false),
  ('551', 'Coparticipação em Consultas/Exames (Saúde)', 'DESCONTO', 'BENEFICIO', '9219', false, false, false),
  ('555', 'Plano Odontológico Coletivo', 'DESCONTO', 'BENEFICIO', '9220', false, false, false),
  ('560', 'Seguro de Vida em Grupo', 'DESCONTO', 'BENEFICIO', '9221', false, false, false),
  ('570', 'Empréstimo Consignado em Folha', 'DESCONTO', 'BENEFICIO', '9225', false, false, false),
  ('580', 'Contribuição Sindical / Assistencial Negocial', 'DESCONTO', 'LEGAL', '9230', false, false, false),
  ('590', 'Adiantamento Quinzenal de Salário', 'DESCONTO', 'SALARIAL', '9240', false, false, false)
ON CONFLICT (rubric_code) DO NOTHING;

-- 2. Tabela de Lançamentos de Rubricas por Colaborador
CREATE TABLE IF NOT EXISTS public.employee_payroll_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
    rubric_code VARCHAR(10) REFERENCES public.payroll_rubrics_catalog(rubric_code),
    competence_month VARCHAR(7) NOT NULL, -- '2026-11'
    reference VARCHAR(50), -- '18.5h', '6%', '2d', 'R$ 150.00'
    value NUMERIC(10,2) NOT NULL,
    is_recurrent BOOLEAN DEFAULT false,
    origin VARCHAR(50) DEFAULT 'MANUAL', -- 'MANUAL', 'IMPORT_CSV', 'PONTO_REP', 'CALCULADO'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_emp_entries ON public.employee_payroll_entries(employee_id, competence_month);

-- 3. Catálogo Universal de Serviços de Armazéns Gerais & Recintos Alfandegários (EADI / Porto Seco)
-- Suporte nativo a Código Único do Cliente (Client SKU), NBS, LC 116 e CFOP
CREATE TABLE IF NOT EXISTS public.customs_warehouse_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE, -- NULL se for serviço mestre global do armazém, preenchido se for exclusivo do cliente
    service_sku VARCHAR(50) NOT NULL, -- Código único exclusivo ao cliente (Ex: 'SKU-SAMS-001')
    service_name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'STORAGE', 'HANDLING', 'CUSTOMS_CLEARANCE', 'VALUE_ADDED', 'ANCILLARY'
    unit_of_measure VARCHAR(30) NOT NULL, -- 'DIARIA_PALETE', 'DECENDIO_CIF', 'TONELADA', 'CONTAINER_UN', 'HORA_OPERADOR', 'M3_MES'
    default_price NUMERIC(15,4) NOT NULL DEFAULT 0.0000,
    -- Códigos Tributários Oficiais Brasileiros
    item_lc116 VARCHAR(10) DEFAULT '11.04', -- Armazenamento, depósito, carga, descarga, arrumação e guarda de bens de qualquer espécie
    cnae_service VARCHAR(20) DEFAULT '5211-7/99',
    aliquota_iss NUMERIC(5,2) DEFAULT 5.00,
    codigo_tributacao_municipio VARCHAR(20) DEFAULT '1104-0/01-88',
    cfop_padrao VARCHAR(10) DEFAULT '5906',
    is_bonded_customs BOOLEAN DEFAULT false, -- Indicador de Recinto Alfandegado (EADI)
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cws_tenant_client ON public.customs_warehouse_services(tenant_id, client_id, service_sku);

-- Seeds com a Base Mestra dos Principais Serviços de Armazéns Gerais e Alfandegados
INSERT INTO public.customs_warehouse_services (
    tenant_id, client_id, service_sku, service_name, category, unit_of_measure, default_price, item_lc116, cfop_padrao, is_bonded_customs
) VALUES
  -- 1. Armazenagem Geral e Decendial
  (NULL, NULL, 'SRV-ARM-DEC-CIF', 'Armazenagem Decendial Geral Ad Valorem (Sobre Valor CIF)', 'STORAGE', 'DECENDIO_CIF', 0.0050, '11.04', '5906', false),
  (NULL, NULL, 'SRV-ARM-PAL-DIA', 'Diária de Armazenagem por Posição-Palete PBR (Dry)', 'STORAGE', 'DIARIA_PALETE', 2.8500, '11.04', '5906', false),
  (NULL, NULL, 'SRV-ARM-CLIMAT', 'Diária de Armazenagem Climatizada (15°C a 25°C) - Farmacêutico', 'STORAGE', 'DIARIA_PALETE', 5.4000, '11.04', '5906', false),
  (NULL, NULL, 'SRV-ARM-CONG-FR', 'Diária de Armazenagem em Câmara Frigorificada (-18°C a -22°C)', 'STORAGE', 'DIARIA_PALETE', 8.9000, '11.04', '5906', false),
  (NULL, NULL, 'SRV-ARM-M3-MES', 'Armazenagem de Carga Fracionada ou Projeto por m³ / Mês', 'STORAGE', 'M3_MES', 38.0000, '11.04', '5906', false),

  -- 2. Movimentação e Handling de Doca
  (NULL, NULL, 'SRV-HDL-IN-TON', 'Handling Inbound - Descarga, Triagem e Entrada em Porta-Paletes', 'HANDLING', 'TONELADA', 35.0000, '11.04', '1905', false),
  (NULL, NULL, 'SRV-HDL-OUT-TON', 'Handling Outbound - Separação, Picking e Carregamento de Saída', 'HANDLING', 'TONELADA', 32.0000, '11.04', '5906', false),
  (NULL, NULL, 'SRV-DESOVA-20FT', 'Desova Mecanizada de Container Dry 20 pés (Inbound Portuário)', 'HANDLING', 'CONTAINER_UN', 650.0000, '11.04', '1905', true),
  (NULL, NULL, 'SRV-DESOVA-40FT', 'Desova Mecanizada de Container High Cube 40 pés (Inbound)', 'HANDLING', 'CONTAINER_UN', 950.0000, '11.04', '1905', true),
  (NULL, NULL, 'SRV-DESOVA-MANUAL', 'Desova e Estufagem Manual Carga Batida / Fardos (Equipe Doca)', 'HANDLING', 'CONTAINER_UN', 1350.0000, '11.04', '1905', true),

  -- 3. Serviços Aduaneiros e Alfandegários (EADI / Porto Seco / CLIA)
  (NULL, NULL, 'SRV-ADU-POS-FISC', 'Posicionamento e Movimentação para Vistoria da Receita Federal / MAPA / Anvisa', 'CUSTOMS_CLEARANCE', 'CONTAINER_UN', 420.0000, '11.04', '5949', true),
  (NULL, NULL, 'SRV-ADU-COLETA-AMO', 'Deslacração, Acompanhamento de Perícia e Coleta de Amostras Fiscais', 'CUSTOMS_CLEARANCE', 'UNIDADE', 280.0000, '11.04', '5949', true),
  (NULL, NULL, 'SRV-ADU-DEMURRAGE', 'Monitoramento e Gestão Preventiva de Devolução de Container (Demurrage Free-Time)', 'CUSTOMS_CLEARANCE', 'CONTAINER_UN', 85.0000, '11.04', '0000', true),
  (NULL, NULL, 'SRV-ADU-PESAGEM', 'Pesagem Oficial Balança Rodoviária Homologada INMETRO (Tickets In/Out)', 'CUSTOMS_CLEARANCE', 'VEICULO_UN', 45.0000, '11.04', '0000', true),

  -- 4. Serviços de Valor Agregado (VAS) e Acessórios
  (NULL, NULL, 'SRV-VAS-PAL-PBR', 'Fornecimento e Montagem de Palete de Madeira PBR Tratamento Fitossanitário HT', 'VALUE_ADDED', 'UNIDADE', 48.0000, '14.05', '5949', false),
  (NULL, NULL, 'SRV-VAS-STRETCH', 'Aplicação de Filme Stretch Automático com Cinta de Arquear', 'VALUE_ADDED', 'UNIDADE', 22.0000, '14.05', '5949', false),
  (NULL, NULL, 'SRV-VAS-ETIQUETA', 'Rotulagem, Etiquetagem de LPN/Código de Barras e Tradução ANVISA', 'VALUE_ADDED', 'UNIDADE', 0.8500, '14.05', '5949', false),
  (NULL, NULL, 'SRV-VAS-KITTING', 'Kitting, Montagem de Kits Promocionais e Shrinkpack Retrátil', 'VALUE_ADDED', 'UNIDADE', 3.5000, '14.05', '5949', false),
  (NULL, NULL, 'SRV-VAS-ENERGIA-RF', 'Conexão e Fornecimento de Energia Elétrica para Container Reefer (Tomada/Hora)', 'ANCILLARY', 'HORA_OPERADOR', 28.0000, '11.04', '0000', true)
ON CONFLICT DO NOTHING;

