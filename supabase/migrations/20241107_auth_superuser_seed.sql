-- ==============================================================================
-- MIGRATION: SEED DE AUTENTICAÇÃO DO SUPERADMIN GADAP WMS
-- Email: danielsmlopes@hotmail.com
-- Role: SUPERADMIN
-- Senha: Gabriel2006
-- ==============================================================================

-- 1. Garante a extensão pgcrypto ativa
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
    v_company_id UUID;
    v_user_id UUID := '00000000-0000-0000-0000-000000000001'::uuid;
    v_email TEXT := 'danielsmlopes@hotmail.com';
    v_password TEXT := 'Gabriel2006';
    v_encrypted_pw TEXT;
BEGIN
    -- 2. Garante Tenant Master na tabela companies
    IF NOT EXISTS (SELECT 1 FROM public.companies WHERE cnpj = '00000000000191') THEN
        INSERT INTO public.companies (id, name, cnpj, created_at)
        VALUES (
            'a0000000-0000-0000-0000-000000000001'::uuid,
            'GADAP Logística & Armazéns Gerais S/A',
            '00000000000191',
            NOW()
        )
        RETURNING id INTO v_company_id;
    ELSE
        SELECT id INTO v_company_id FROM public.companies WHERE cnpj = '00000000000191' LIMIT 1;
    END IF;

    -- Gera hash bcrypt para a senha solicitada
    v_encrypted_pw := extensions.crypt(v_password, extensions.gen_salt('bf', 10));

    -- 3. Upsert no schema auth.users (Supabase Auth)
    IF EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
        UPDATE auth.users
        SET encrypted_password = v_encrypted_pw,
            email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
            updated_at = NOW(),
            raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"SUPERADMIN"}'::jsonb,
            raw_user_meta_data = '{"full_name":"Daniel Souto Lopes","role":"SUPERADMIN"}'::jsonb
        WHERE email = v_email
        RETURNING id INTO v_user_id;
    ELSE
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            recovery_sent_at,
            last_sign_in_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            v_user_id,
            'authenticated',
            'authenticated',
            v_email,
            v_encrypted_pw,
            NOW(),
            NOW(),
            NOW(),
            '{"provider":"email","providers":["email"],"role":"SUPERADMIN"}'::jsonb,
            '{"full_name":"Daniel Souto Lopes","role":"SUPERADMIN"}'::jsonb,
            NOW(),
            NOW(),
            '',
            '',
            '',
            ''
        );
    END IF;

    -- 4. Inserir identidade em auth.identities para o Supabase reconhecer login por senha
    IF NOT EXISTS (SELECT 1 FROM auth.identities WHERE user_id = v_user_id) THEN
        INSERT INTO auth.identities (
            id,
            user_id,
            identity_data,
            provider,
            last_sign_in_at,
            created_at,
            updated_at
        ) VALUES (
            v_user_id,
            v_user_id,
            format('{"sub":"%s","email":"%s"}', v_user_id::text, v_email)::jsonb,
            'email',
            NOW(),
            NOW(),
            NOW()
        );
    END IF;

    -- 5. Upsert na tabela de aplicação public.users
    INSERT INTO public.users (
        id,
        company_id,
        full_name,
        email,
        role,
        is_active,
        created_at
    ) VALUES (
        v_user_id,
        v_company_id,
        'Daniel Souto Lopes (Superadmin)',
        v_email,
        'SUPERADMIN',
        true,
        NOW()
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        role = 'SUPERADMIN',
        full_name = 'Daniel Souto Lopes (Superadmin)',
        company_id = EXCLUDED.company_id,
        is_active = true;

    RAISE NOTICE 'Superusuário Daniel Souto Lopes (%s) configurado com sucesso com papel SUPERADMIN!', v_email;
END $$;

