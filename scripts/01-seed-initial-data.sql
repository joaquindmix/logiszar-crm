-- Seed initial products for chlorine sales
INSERT INTO Product (id, nombre, unidad, dilucion, activo, createdAt) VALUES
  ('prod_cloro_litro', 'Cloro por Litro', 'litro', NULL, 1, datetime('now')),
  ('prod_cloro_kilo', 'Cloro por Kilo', 'kilo', NULL, 1, datetime('now')),
  ('prod_cloro_1pct', 'Cloro Diluido 1%', 'litro', 0.01, 1, datetime('now')),
  ('prod_cloro_2pct', 'Cloro Diluido 2%', 'litro', 0.02, 1, datetime('now')),
  ('prod_cloro_5pct', 'Cloro Diluido 5%', 'litro', 0.05, 1, datetime('now')),
  ('prod_cloro_10pct', 'Cloro Diluido 10%', 'litro', 0.10, 1, datetime('now'));

-- Create default admin user (password: admin123 - should be changed in production)
INSERT INTO User (id, nombre, email, password, rol, createdAt, updatedAt) VALUES
  ('user_admin', 'Administrador', 'admin@logizar.com', '$2a$10$rKZvVxZ5xGxJ5xGxJ5xGxOeKvVxZ5xGxJ5xGxJ5xGxOeKvVxZ5xGx', 'admin', datetime('now'), datetime('now'));

-- Create sample operator user
INSERT INTO User (id, nombre, email, password, rol, createdAt, updatedAt) VALUES
  ('user_operator', 'Operador Demo', 'operador@logizar.com', '$2a$10$rKZvVxZ5xGxJ5xGxJ5xGxOeKvVxZ5xGxJ5xGxJ5xGxOeKvVxZ5xGx', 'operador', datetime('now'), datetime('now'));
