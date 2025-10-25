-- Insert sample chlorine products
insert into public.products (name, description, unit, dilution_ratio, base_price_ars, base_price_usd, is_active)
values
  ('Cloro Líquido 10%', 'Hipoclorito de sodio al 10% para tratamiento de agua', 'liter', '1:100', 1500.00, 5.00, true),
  ('Cloro Líquido 13%', 'Hipoclorito de sodio al 13% concentrado', 'liter', '1:130', 2000.00, 6.50, true),
  ('Cloro Granulado 65%', 'Cloro granulado de alta concentración', 'kilo', '1:650', 8500.00, 28.00, true),
  ('Cloro en Pastillas', 'Pastillas de cloro para dosificación continua', 'kilo', '1:500', 7000.00, 23.00, true),
  ('Hipoclorito de Calcio 70%', 'Cloro en polvo de alta pureza', 'kilo', '1:700', 9500.00, 31.00, true)
on conflict do nothing;
