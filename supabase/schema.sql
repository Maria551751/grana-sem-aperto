-- Desafio GSA: contas, XP e ranking.
-- Rode este arquivo inteiro no SQL Editor do Supabase (pode rodar de novo: ele é idempotente).
--
-- Regras de segurança:
-- - O navegador NÃO grava XP direto: só pela função registrar_licao, que calcula o XP no servidor
--   e aceita uma vez por lição por dia. Assim ninguém sobe no ranking editando o JavaScript.
-- - No ranking aparecem só apelido e XP. O e-mail fica no Supabase Auth e nunca é exposto.

-- ---------------------------------------------------------------------------
-- Tabelas
-- ---------------------------------------------------------------------------

create table if not exists public.perfis (
    id uuid primary key references auth.users (id) on delete cascade,
    apelido text not null check (apelido ~ '^[A-Za-z0-9_.]{3,20}$'),
    xp integer not null default 0 check (xp >= 0),
    sequencia integer not null default 0 check (sequencia >= 0),
    melhor_sequencia integer not null default 0 check (melhor_sequencia >= 0),
    ultimo_dia date,
    criado_em timestamptz not null default now(),
    atualizado_em timestamptz not null default now()
);

create unique index if not exists perfis_apelido_unico on public.perfis (lower(apelido));

create table if not exists public.conclusoes (
    usuario_id uuid not null references auth.users (id) on delete cascade,
    licao_id text not null,
    dia date not null,
    acertos integer not null,
    total integer not null,
    xp_ganho integer not null,
    criado_em timestamptz not null default now(),
    primary key (usuario_id, licao_id, dia)
);

create index if not exists conclusoes_dia on public.conclusoes (dia);

-- ---------------------------------------------------------------------------
-- Permissões: cada pessoa vê e edita só o próprio perfil (e só o apelido)
-- ---------------------------------------------------------------------------

alter table public.perfis enable row level security;
alter table public.conclusoes enable row level security;

revoke all on public.perfis from anon, authenticated;
revoke all on public.conclusoes from anon, authenticated;

grant select on public.perfis to authenticated;
grant insert (id, apelido) on public.perfis to authenticated;
grant update (apelido) on public.perfis to authenticated;
grant select on public.conclusoes to authenticated;

drop policy if exists "ver o próprio perfil" on public.perfis;
create policy "ver o próprio perfil" on public.perfis
    for select to authenticated using ((select auth.uid()) = id);

drop policy if exists "criar o próprio perfil" on public.perfis;
create policy "criar o próprio perfil" on public.perfis
    for insert to authenticated with check ((select auth.uid()) = id);

drop policy if exists "editar o próprio perfil" on public.perfis;
create policy "editar o próprio perfil" on public.perfis
    for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

drop policy if exists "ver as próprias lições" on public.conclusoes;
create policy "ver as próprias lições" on public.conclusoes
    for select to authenticated using ((select auth.uid()) = usuario_id);

-- ---------------------------------------------------------------------------
-- registrar_licao: única forma de ganhar XP
-- ---------------------------------------------------------------------------

create or replace function public.registrar_licao(p_licao text, p_acertos integer, p_total integer)
returns table (xp_total integer, dias_seguidos integer, recorde_dias integer, xp_ganho integer)
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_usuario uuid := auth.uid();
    v_hoje date := (now() at time zone 'America/Sao_Paulo')::date;
    v_xp integer;
    v_novas integer;
begin
    if v_usuario is null then
        raise exception 'Entre na sua conta para salvar o XP.';
    end if;

    -- Mantenha igual aos ids de assets/js/jogo-licoes.js.
    if p_licao not in ('mentalidade', 'organizando-grana', 'reserva', 'cartao',
                       'tesouro', 'fiis', 'acoes', 'rebalanceamento') then
        raise exception 'Lição desconhecida: %', p_licao;
    end if;

    if p_total is null or p_acertos is null or p_total not between 1 and 10 or p_acertos not between 0 and p_total then
        raise exception 'Resultado inválido.';
    end if;

    if not exists (select 1 from public.perfis p where p.id = v_usuario) then
        raise exception 'Escolha um apelido antes de entrar no ranking.';
    end if;

    -- 10 XP por acerto de primeira + 10 de bônus se não errou nada (máximo 60 numa lição de 5).
    v_xp := p_acertos * 10 + case when p_acertos = p_total then 10 else 0 end;

    -- Cada lição rende XP uma vez por dia; repetir no mesmo dia é treino.
    insert into public.conclusoes (usuario_id, licao_id, dia, acertos, total, xp_ganho)
    values (v_usuario, p_licao, v_hoje, p_acertos, p_total, v_xp)
    on conflict (usuario_id, licao_id, dia) do nothing;

    get diagnostics v_novas = row_count;
    if v_novas = 0 then
        v_xp := 0;
    end if;

    update public.perfis p
    set xp = p.xp + v_xp,
        sequencia = case
            when p.ultimo_dia = v_hoje then p.sequencia
            when p.ultimo_dia = v_hoje - 1 then p.sequencia + 1
            else 1
        end,
        ultimo_dia = v_hoje,
        atualizado_em = now()
    where p.id = v_usuario;

    update public.perfis p
    set melhor_sequencia = greatest(p.melhor_sequencia, p.sequencia)
    where p.id = v_usuario;

    return query
    select p.xp, p.sequencia, p.melhor_sequencia, v_xp
    from public.perfis p
    where p.id = v_usuario;
end;
$$;

-- ---------------------------------------------------------------------------
-- obter_ranking: top 20 da semana (últimos 7 dias) ou geral, só com apelido e XP
-- ---------------------------------------------------------------------------

create or replace function public.obter_ranking(p_periodo text default 'semana')
returns table (posicao bigint, apelido text, xp bigint, sou_eu boolean)
language sql
stable
security definer
set search_path = ''
as $$
    with pontos as (
        select p.id, p.apelido, p.xp::bigint as xp, p.atualizado_em
        from public.perfis p
        where p_periodo = 'geral' and p.xp > 0
        union all
        select p.id, p.apelido, sum(c.xp_ganho)::bigint, max(c.criado_em)
        from public.conclusoes c
        join public.perfis p on p.id = c.usuario_id
        where p_periodo <> 'geral'
          and c.dia >= (now() at time zone 'America/Sao_Paulo')::date - 6
        group by p.id, p.apelido
        having sum(c.xp_ganho) > 0
    )
    select row_number() over (order by xp desc, atualizado_em asc),
           apelido,
           xp,
           id = auth.uid()
    from pontos
    order by xp desc, atualizado_em asc
    limit 20;
$$;

-- ---------------------------------------------------------------------------
-- excluir_minha_conta: apaga login, perfil e histórico (direito de exclusão da LGPD)
-- ---------------------------------------------------------------------------

create or replace function public.excluir_minha_conta()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
    if auth.uid() is null then
        raise exception 'Entre na sua conta para excluí-la.';
    end if;

    delete from auth.users u where u.id = auth.uid();
end;
$$;

revoke all on function public.registrar_licao(text, integer, integer) from public, anon;
revoke all on function public.excluir_minha_conta() from public, anon;
revoke all on function public.obter_ranking(text) from public;

grant execute on function public.registrar_licao(text, integer, integer) to authenticated;
grant execute on function public.excluir_minha_conta() to authenticated;
grant execute on function public.obter_ranking(text) to anon, authenticated;
