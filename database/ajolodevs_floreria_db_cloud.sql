-- ============================================================
--  🌸 AjoloDevs Florería — Base de Datos MySQL Completa
--  Versión: 1.0
--  Descripción: E-commerce para florería con roles, inventario,
--               pedidos, pagos manuales y reportes.
-- ============================================================



-- ============================================================
-- 1. USUARIOS
-- ============================================================
CREATE TABLE usuarios (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nombre        VARCHAR(100)  NOT NULL,
  apellido      VARCHAR(100)  NOT NULL,
  email         VARCHAR(150)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  telefono      VARCHAR(20),
  rol           ENUM('cliente', 'admin') NOT NULL DEFAULT 'cliente',
  activo        BOOLEAN       NOT NULL DEFAULT TRUE,
  creado_en     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. DIRECCIONES DE ENTREGA
-- ============================================================
CREATE TABLE direcciones (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id    INT          NOT NULL,
  calle         VARCHAR(200) NOT NULL,
  numero        VARCHAR(20),
  colonia       VARCHAR(100),
  ciudad        VARCHAR(100) NOT NULL,
  estado        VARCHAR(100),
  codigo_postal VARCHAR(10),
  referencias   TEXT,
  es_principal  BOOLEAN      NOT NULL DEFAULT FALSE,
  creado_en     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_dir_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ============================================================
-- 3. CATEGORÍAS
-- ============================================================
CREATE TABLE categorias (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nombre        VARCHAR(100) NOT NULL UNIQUE,
  descripcion   TEXT,
  imagen_url    VARCHAR(500),
  activo        BOOLEAN      NOT NULL DEFAULT TRUE,
  creado_en     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 4. PRODUCTOS
-- ============================================================
CREATE TABLE productos (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  categoria_id    INT            NOT NULL,
  nombre          VARCHAR(150)   NOT NULL,
  descripcion     TEXT,
  precio          DECIMAL(10,2)  NOT NULL,
  imagen_url      VARCHAR(500),
  destacado       BOOLEAN        NOT NULL DEFAULT FALSE,
  activo          BOOLEAN        NOT NULL DEFAULT TRUE,
  creado_en       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_prod_categoria FOREIGN KEY (categoria_id)
    REFERENCES categorias(id) ON DELETE RESTRICT
);

-- ============================================================
-- 5. INVENTARIO
-- ============================================================
CREATE TABLE inventario (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  producto_id     INT  NOT NULL UNIQUE,
  stock_actual    INT  NOT NULL DEFAULT 0,
  stock_minimo    INT  NOT NULL DEFAULT 5,   -- alerta de stock bajo
  actualizado_en  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_inv_producto FOREIGN KEY (producto_id)
    REFERENCES productos(id) ON DELETE CASCADE
);

-- Movimientos de inventario (entradas / salidas / ajustes)
CREATE TABLE inventario_movimientos (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  producto_id   INT          NOT NULL,
  tipo          ENUM('entrada', 'salida', 'ajuste') NOT NULL,
  cantidad      INT          NOT NULL,
  motivo        VARCHAR(200),
  usuario_id    INT,                          -- admin que realizó el movimiento
  creado_en     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_mov_producto FOREIGN KEY (producto_id)
    REFERENCES productos(id) ON DELETE CASCADE,
  CONSTRAINT fk_mov_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ============================================================
-- 6. CARRITO (temporal hasta confirmar pedido)
-- ============================================================
CREATE TABLE carrito (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id    INT  NOT NULL,
  producto_id   INT  NOT NULL,
  cantidad      INT  NOT NULL DEFAULT 1,
  agregado_en   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uq_carrito (usuario_id, producto_id),

  CONSTRAINT fk_cart_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT fk_cart_producto FOREIGN KEY (producto_id)
    REFERENCES productos(id) ON DELETE CASCADE
);

-- ============================================================
-- 7. PEDIDOS
-- ============================================================
CREATE TABLE pedidos (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id        INT            NOT NULL,
  direccion_id      INT,                        -- NULL si es pago en efectivo/recoger
  subtotal          DECIMAL(10,2)  NOT NULL,
  descuento         DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  total             DECIMAL(10,2)  NOT NULL,
  metodo_pago       ENUM('transferencia', 'efectivo_contra_entrega') NOT NULL,
  estatus           ENUM('pendiente','en_proceso','enviado','entregado','cancelado')
                    NOT NULL DEFAULT 'pendiente',
  notas_cliente     TEXT,
  notas_admin       TEXT,
  creado_en         DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_ped_usuario   FOREIGN KEY (usuario_id)   REFERENCES usuarios(id)   ON DELETE RESTRICT,
  CONSTRAINT fk_ped_direccion FOREIGN KEY (direccion_id) REFERENCES direcciones(id) ON DELETE SET NULL
);

-- ============================================================
-- 8. DETALLE DE PEDIDOS
-- ============================================================
CREATE TABLE pedido_items (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id       INT            NOT NULL,
  producto_id     INT            NOT NULL,
  nombre_producto VARCHAR(150)   NOT NULL,  -- snapshot del nombre al momento de comprar
  precio_unitario DECIMAL(10,2)  NOT NULL,  -- snapshot del precio
  cantidad        INT            NOT NULL,
  subtotal        DECIMAL(10,2)  NOT NULL,  -- precio_unitario * cantidad

  CONSTRAINT fk_item_pedido   FOREIGN KEY (pedido_id)   REFERENCES pedidos(id)   ON DELETE CASCADE,
  CONSTRAINT fk_item_producto FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT
);

-- ============================================================
-- 9. PAGOS / COMPROBANTES
-- ============================================================
CREATE TABLE pagos (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id           INT           NOT NULL,
  metodo              ENUM('transferencia', 'efectivo_contra_entrega') NOT NULL,
  estatus             ENUM('pendiente', 'verificando', 'confirmado', 'rechazado')
                      NOT NULL DEFAULT 'pendiente',
  referencia          VARCHAR(200),           -- número de transferencia
  comprobante_url     VARCHAR(500),           -- imagen subida a Cloudinary
  monto               DECIMAL(10,2) NOT NULL,
  verificado_por      INT,                    -- admin que confirmó
  fecha_pago          DATETIME,
  creado_en           DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_pago_pedido    FOREIGN KEY (pedido_id)      REFERENCES pedidos(id)   ON DELETE CASCADE,
  CONSTRAINT fk_pago_verificador FOREIGN KEY (verificado_por) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ============================================================
-- 10. HISTORIAL DE ESTATUS DE PEDIDOS
-- ============================================================
CREATE TABLE pedido_historial (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id     INT          NOT NULL,
  estatus       ENUM('pendiente','en_proceso','enviado','entregado','cancelado') NOT NULL,
  comentario    TEXT,
  usuario_id    INT,                          -- quien hizo el cambio
  creado_en     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_hist_pedido  FOREIGN KEY (pedido_id)  REFERENCES pedidos(id)   ON DELETE CASCADE,
  CONSTRAINT fk_hist_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)  ON DELETE SET NULL
);

-- ============================================================
-- 11. RESEÑAS / CALIFICACIONES (opcional futuro)
-- ============================================================
CREATE TABLE resenas (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  producto_id   INT  NOT NULL,
  usuario_id    INT  NOT NULL,
  calificacion  TINYINT NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
  comentario    TEXT,
  creado_en     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uq_resena (producto_id, usuario_id),

  CONSTRAINT fk_res_producto FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
  CONSTRAINT fk_res_usuario  FOREIGN KEY (usuario_id)  REFERENCES usuarios(id)  ON DELETE CASCADE
);

-- ============================================================
-- 12. DATOS SEMILLA (seed) — Admin inicial + Categorías base
-- ============================================================

-- Admin por defecto (password: Admin123! — cambiar en producción)
INSERT INTO usuarios (nombre, apellido, email, password_hash, rol) VALUES
('Admin', 'AjoloDevs', 'admin@ajolodevs.com',
 '$2b$10$exampleHashCambiarEnProduccion', 'admin');

-- Categorías base de florería
INSERT INTO categorias (nombre, descripcion) VALUES
('Ramos',          'Arreglos en forma de ramo para todo tipo de ocasión'),
('Arreglos',       'Arreglos florales en base, canasta o florero'),
('Plantas',        'Plantas de interior y exterior'),
('Coronas',        'Coronas y arreglos especiales'),
('Bouquets novia', 'Bouquets especiales para bodas'),
('Ocasiones',      'Cumpleaños, aniversarios, condolencias');

-- ============================================================
-- 13. VISTAS ÚTILES PARA REPORTES
-- ============================================================

-- Vista: ventas por periodo
CREATE OR REPLACE VIEW vista_ventas AS
SELECT
  p.id                          AS pedido_id,
  p.creado_en                   AS fecha,
  p.total,
  p.metodo_pago,
  p.estatus,
  u.nombre                      AS cliente_nombre,
  u.email                       AS cliente_email
FROM pedidos p
JOIN usuarios u ON u.id = p.usuario_id
WHERE p.estatus NOT IN ('cancelado');

-- Vista: productos más vendidos
CREATE OR REPLACE VIEW vista_productos_vendidos AS
SELECT
  pi.producto_id,
  pi.nombre_producto,
  SUM(pi.cantidad)              AS total_vendido,
  SUM(pi.subtotal)              AS ingresos_generados
FROM pedido_items pi
JOIN pedidos p ON p.id = pi.pedido_id
WHERE p.estatus NOT IN ('cancelado')
GROUP BY pi.producto_id, pi.nombre_producto
ORDER BY total_vendido DESC;

-- Vista: stock bajo (alerta de inventario)
CREATE OR REPLACE VIEW vista_stock_bajo AS
SELECT
  pr.id,
  pr.nombre,
  i.stock_actual,
  i.stock_minimo
FROM inventario i
JOIN productos pr ON pr.id = i.producto_id
WHERE i.stock_actual <= i.stock_minimo
ORDER BY i.stock_actual ASC;
