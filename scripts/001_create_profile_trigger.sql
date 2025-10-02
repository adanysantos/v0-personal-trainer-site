-- Função que cria automaticamente um perfil quando um novo usuário é criado
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, user_type)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', null),
    coalesce(new.raw_user_meta_data ->> 'user_type', 'student')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Remove o trigger se já existir
drop trigger if exists on_auth_user_created on auth.users;

-- Cria o trigger que executa após inserir novo usuário
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
