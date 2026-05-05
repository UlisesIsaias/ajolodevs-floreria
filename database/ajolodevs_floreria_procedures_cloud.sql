-- ============================================================
--  🌸 AjoloDevs Florería — Stored Procedures Completos
--  Versión: 1.0
--  Módulos: Usuarios, Productos, Inventario,
--           Carrito, Pedidos, Pagos, Reportes
-- ============================================================


DELIMITER $$

-- ============================================================
-- MÓDULO 1: USUARIOS
-- ============================================================

-- Registrar nuevo cliente
CREATE PROCEDURE sp_usuario_registrar(
  IN p_nombre    VARCHAR(100),
  IN p_apellido  VARCHAR(100),
  IN p_email     VARCHAR(150),
  IN p_password  VARCHAR(255),
  IN p_telefono  VARCHAR(20)
)
BEGIN
  DECLARE v_existe INT DEFAULT 0;
  SELECT COUNT(*) INTO v_existe FROM usuarios WHERE email = p_email;

  IF v_existe > 0 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'El correo electrónico ya está registrado';
  ELSE
    INSERT INTO usuarios (nombre, apellido, email, password_hash, telefono, rol)
    VALUES (p_nombre, p_apellido, p_email, p_password, p_telefono, 'cliente');
    SELECT LAST_INSERT_ID() AS id, p_nombre AS nombre, p_email AS email, 'cliente' AS rol;
  END IF;
END$$

-- Obtener usuario por email (para login)
CREATE PROCEDURE sp_usuario_login(
  IN p_email VARCHAR(150)
)
BEGIN
  SELECT id, nombre, apellido, email, password_hash, rol, activo
  FROM usuarios
  WHERE email = p_email AND activo = TRUE;
END$$

-- Obtener perfil de usuario por ID
CREATE PROCEDURE sp_usuario_obtener(
  IN p_id INT
)
BEGIN
  SELECT id, nombre, apellido, email, telefono, rol, creado_en
  FROM usuarios
  WHERE id = p_id AND activo = TRUE;
END$$

-- Actualizar perfil
CREATE PROCEDURE sp_usuario_actualizar(
  IN p_id       INT,
  IN p_nombre   VARCHAR(100),
  IN p_apellido VARCHAR(100),
  IN p_telefono VARCHAR(20)
)
BEGIN
  UPDATE usuarios
  SET nombre = p_nombre, apellido = p_apellido, telefono = p_telefono
  WHERE id = p_id;
  SELECT ROW_COUNT() AS filas_afectadas;
END$$

-- Cambiar contraseña
CREATE PROCEDURE sp_usuario_cambiar_password(
  IN p_id           INT,
  IN p_password_new VARCHAR(255)
)
BEGIN
  UPDATE usuarios SET password_hash = p_password_new WHERE id = p_id;
  SELECT ROW_COUNT() AS filas_afectadas;
END$$

-- Listar todos los usuarios (admin)
CREATE PROCEDURE sp_usuario_listar()
BEGIN
  SELECT id, nombre, apellido, email, telefono, rol, activo, creado_en
  FROM usuarios ORDER BY creado_en DESC;
END$$

-- Activar / desactivar usuario
CREATE PROCEDURE sp_usuario_toggle_activo(
  IN p_id     INT,
  IN p_activo BOOLEAN
)
BEGIN
  UPDATE usuarios SET activo = p_activo WHERE id = p_id;
  SELECT ROW_COUNT() AS filas_afectadas;
END$$

-- ============================================================
-- MÓDULO 2: DIRECCIONES
-- ============================================================

CREATE PROCEDURE sp_direccion_agregar(
  IN p_usuario_id    INT,
  IN p_calle         VARCHAR(200),
  IN p_numero        VARCHAR(20),
  IN p_colonia       VARCHAR(100),
  IN p_ciudad        VARCHAR(100),
  IN p_estado        VARCHAR(100),
  IN p_codigo_postal VARCHAR(10),
  IN p_referencias   TEXT,
  IN p_es_principal  BOOLEAN
)
BEGIN
  IF p_es_principal THEN
    UPDATE direcciones SET es_principal = FALSE WHERE usuario_id = p_usuario_id;
  END IF;

  INSERT INTO direcciones
    (usuario_id, calle, numero, colonia, ciudad, estado, codigo_postal, referencias, es_principal)
  VALUES
    (p_usuario_id, p_calle, p_numero, p_colonia, p_ciudad, p_estado, p_codigo_postal, p_referencias, p_es_principal);

  SELECT LAST_INSERT_ID() AS id;
END$$

CREATE PROCEDURE sp_direccion_listar(IN p_usuario_id INT)
BEGIN
  SELECT * FROM direcciones WHERE usuario_id = p_usuario_id ORDER BY es_principal DESC;
END$$

CREATE PROCEDURE sp_direccion_eliminar(IN p_id INT, IN p_usuario_id INT)
BEGIN
  DELETE FROM direcciones WHERE id = p_id AND usuario_id = p_usuario_id;
  SELECT ROW_COUNT() AS filas_afectadas;
END$$

-- ============================================================
-- MÓDULO 3: CATEGORÍAS
-- ============================================================

CREATE PROCEDURE sp_categoria_crear(
  IN p_nombre      VARCHAR(100),
  IN p_descripcion TEXT,
  IN p_imagen_url  VARCHAR(500)
)
BEGIN
  DECLARE v_existe INT DEFAULT 0;
  SELECT COUNT(*) INTO v_existe FROM categorias WHERE nombre = p_nombre;

  IF v_existe > 0 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Ya existe una categoría con ese nombre';
  ELSE
    INSERT INTO categorias (nombre, descripcion, imagen_url)
    VALUES (p_nombre, p_descripcion, p_imagen_url);
    SELECT LAST_INSERT_ID() AS id;
  END IF;
END$$

CREATE PROCEDURE sp_categoria_listar()
BEGIN
  SELECT * FROM categorias WHERE activo = TRUE ORDER BY nombre;
END$$

CREATE PROCEDURE sp_categoria_actualizar(
  IN p_id INT, IN p_nombre VARCHAR(100),
  IN p_descripcion TEXT, IN p_imagen_url VARCHAR(500)
)
BEGIN
  UPDATE categorias
  SET nombre = p_nombre, descripcion = p_descripcion, imagen_url = p_imagen_url
  WHERE id = p_id;
  SELECT ROW_COUNT() AS filas_afectadas;
END$$

CREATE PROCEDURE sp_categoria_eliminar(IN p_id INT)
BEGIN
  UPDATE categorias SET activo = FALSE WHERE id = p_id;
  SELECT ROW_COUNT() AS filas_afectadas;
END$$

-- ============================================================
-- MÓDULO 4: PRODUCTOS
-- ============================================================

-- Crear producto + inventario automático
CREATE PROCEDURE sp_producto_crear(
  IN p_categoria_id  INT,
  IN p_nombre        VARCHAR(150),
  IN p_descripcion   TEXT,
  IN p_precio        DECIMAL(10,2),
  IN p_imagen_url    VARCHAR(500),
  IN p_stock_inicial INT,
  IN p_stock_minimo  INT,
  IN p_destacado     BOOLEAN
)
BEGIN
  DECLARE v_producto_id INT;

  INSERT INTO productos (categoria_id, nombre, descripcion, precio, imagen_url, destacado)
  VALUES (p_categoria_id, p_nombre, p_descripcion, p_precio, p_imagen_url, p_destacado);

  SET v_producto_id = LAST_INSERT_ID();

  INSERT INTO inventario (producto_id, stock_actual, stock_minimo)
  VALUES (v_producto_id, p_stock_inicial, p_stock_minimo);

  IF p_stock_inicial > 0 THEN
    INSERT INTO inventario_movimientos (producto_id, tipo, cantidad, motivo)
    VALUES (v_producto_id, 'entrada', p_stock_inicial, 'Stock inicial del producto');
  END IF;

  SELECT v_producto_id AS id, p_nombre AS nombre;
END$$

-- Listar productos (NULL = todos, o filtrar por categoría)
CREATE PROCEDURE sp_producto_listar(IN p_categoria_id INT)
BEGIN
  IF p_categoria_id IS NULL THEN
    SELECT p.*, c.nombre AS categoria_nombre, i.stock_actual
    FROM productos p
    JOIN categorias c ON c.id = p.categoria_id
    JOIN inventario i ON i.producto_id = p.id
    WHERE p.activo = TRUE
    ORDER BY p.destacado DESC, p.nombre;
  ELSE
    SELECT p.*, c.nombre AS categoria_nombre, i.stock_actual
    FROM productos p
    JOIN categorias c ON c.id = p.categoria_id
    JOIN inventario i ON i.producto_id = p.id
    WHERE p.activo = TRUE AND p.categoria_id = p_categoria_id
    ORDER BY p.nombre;
  END IF;
END$$

CREATE PROCEDURE sp_producto_obtener(IN p_id INT)
BEGIN
  SELECT p.*, c.nombre AS categoria_nombre, i.stock_actual, i.stock_minimo
  FROM productos p
  JOIN categorias c ON c.id = p.categoria_id
  JOIN inventario i ON i.producto_id = p.id
  WHERE p.id = p_id;
END$$

CREATE PROCEDURE sp_producto_actualizar(
  IN p_id INT, IN p_categoria_id INT, IN p_nombre VARCHAR(150),
  IN p_descripcion TEXT, IN p_precio DECIMAL(10,2),
  IN p_imagen_url VARCHAR(500), IN p_destacado BOOLEAN
)
BEGIN
  UPDATE productos
  SET categoria_id = p_categoria_id, nombre = p_nombre, descripcion = p_descripcion,
      precio = p_precio, imagen_url = p_imagen_url, destacado = p_destacado
  WHERE id = p_id;
  SELECT ROW_COUNT() AS filas_afectadas;
END$$

CREATE PROCEDURE sp_producto_eliminar(IN p_id INT)
BEGIN
  UPDATE productos SET activo = FALSE WHERE id = p_id;
  SELECT ROW_COUNT() AS filas_afectadas;
END$$

CREATE PROCEDURE sp_producto_buscar(IN p_busqueda VARCHAR(150))
BEGIN
  SELECT p.*, c.nombre AS categoria_nombre, i.stock_actual
  FROM productos p
  JOIN categorias c ON c.id = p.categoria_id
  JOIN inventario i ON i.producto_id = p.id
  WHERE p.activo = TRUE AND p.nombre LIKE CONCAT('%', p_busqueda, '%')
  ORDER BY p.nombre;
END$$

-- ============================================================
-- MÓDULO 5: INVENTARIO
-- ============================================================

CREATE PROCEDURE sp_inventario_entrada(
  IN p_producto_id INT, IN p_cantidad INT,
  IN p_motivo VARCHAR(200), IN p_usuario_id INT
)
BEGIN
  UPDATE inventario SET stock_actual = stock_actual + p_cantidad
  WHERE producto_id = p_producto_id;

  INSERT INTO inventario_movimientos (producto_id, tipo, cantidad, motivo, usuario_id)
  VALUES (p_producto_id, 'entrada', p_cantidad, p_motivo, p_usuario_id);

  SELECT stock_actual FROM inventario WHERE producto_id = p_producto_id;
END$$

CREATE PROCEDURE sp_inventario_ajuste(
  IN p_producto_id INT, IN p_stock_nuevo INT,
  IN p_motivo VARCHAR(200), IN p_usuario_id INT
)
BEGIN
  DECLARE v_stock_anterior INT;
  SELECT stock_actual INTO v_stock_anterior FROM inventario WHERE producto_id = p_producto_id;

  UPDATE inventario SET stock_actual = p_stock_nuevo WHERE producto_id = p_producto_id;

  INSERT INTO inventario_movimientos (producto_id, tipo, cantidad, motivo, usuario_id)
  VALUES (p_producto_id, 'ajuste', (p_stock_nuevo - v_stock_anterior), p_motivo, p_usuario_id);

  SELECT p_stock_nuevo AS stock_actual;
END$$

CREATE PROCEDURE sp_inventario_stock_bajo()
BEGIN
  SELECT * FROM vista_stock_bajo;
END$$

CREATE PROCEDURE sp_inventario_historial(IN p_producto_id INT)
BEGIN
  SELECT m.*, u.nombre AS usuario_nombre
  FROM inventario_movimientos m
  LEFT JOIN usuarios u ON u.id = m.usuario_id
  WHERE m.producto_id = p_producto_id
  ORDER BY m.creado_en DESC;
END$$

-- ============================================================
-- MÓDULO 6: CARRITO
-- ============================================================

CREATE PROCEDURE sp_carrito_agregar(
  IN p_usuario_id INT, IN p_producto_id INT, IN p_cantidad INT
)
BEGIN
  DECLARE v_stock INT;
  SELECT stock_actual INTO v_stock FROM inventario WHERE producto_id = p_producto_id;

  IF v_stock < p_cantidad THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Stock insuficiente para la cantidad solicitada';
  ELSE
    INSERT INTO carrito (usuario_id, producto_id, cantidad)
    VALUES (p_usuario_id, p_producto_id, p_cantidad)
    ON DUPLICATE KEY UPDATE cantidad = p_cantidad;
    SELECT 'Producto agregado al carrito' AS mensaje;
  END IF;
END$$

CREATE PROCEDURE sp_carrito_ver(IN p_usuario_id INT)
BEGIN
  SELECT c.id, c.producto_id, p.nombre, p.precio, p.imagen_url,
         c.cantidad, (p.precio * c.cantidad) AS subtotal, i.stock_actual
  FROM carrito c
  JOIN productos p ON p.id = c.producto_id
  JOIN inventario i ON i.producto_id = c.producto_id
  WHERE c.usuario_id = p_usuario_id AND p.activo = TRUE;
END$$

CREATE PROCEDURE sp_carrito_eliminar_item(IN p_usuario_id INT, IN p_producto_id INT)
BEGIN
  DELETE FROM carrito WHERE usuario_id = p_usuario_id AND producto_id = p_producto_id;
  SELECT ROW_COUNT() AS filas_afectadas;
END$$

CREATE PROCEDURE sp_carrito_vaciar(IN p_usuario_id INT)
BEGIN
  DELETE FROM carrito WHERE usuario_id = p_usuario_id;
  SELECT ROW_COUNT() AS filas_afectadas;
END$$

-- ============================================================
-- MÓDULO 7: PEDIDOS
-- ============================================================

CREATE PROCEDURE sp_pedido_crear(
  IN p_usuario_id   INT,
  IN p_direccion_id INT,
  IN p_metodo_pago  ENUM('transferencia','efectivo_contra_entrega'),
  IN p_notas        TEXT
)
BEGIN
  DECLARE v_pedido_id INT;
  DECLARE v_subtotal  DECIMAL(10,2) DEFAULT 0;
  DECLARE v_items     INT DEFAULT 0;

  SELECT COUNT(*) INTO v_items FROM carrito WHERE usuario_id = p_usuario_id;
  IF v_items = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El carrito está vacío';
  END IF;

  SELECT SUM(p.precio * c.cantidad) INTO v_subtotal
  FROM carrito c JOIN productos p ON p.id = c.producto_id
  WHERE c.usuario_id = p_usuario_id;

  INSERT INTO pedidos (usuario_id, direccion_id, subtotal, total, metodo_pago, notas_cliente)
  VALUES (p_usuario_id, p_direccion_id, v_subtotal, v_subtotal, p_metodo_pago, p_notas);

  SET v_pedido_id = LAST_INSERT_ID();

  -- Copiar items del carrito al pedido
  INSERT INTO pedido_items (pedido_id, producto_id, nombre_producto, precio_unitario, cantidad, subtotal)
  SELECT v_pedido_id, c.producto_id, p.nombre, p.precio, c.cantidad, (p.precio * c.cantidad)
  FROM carrito c JOIN productos p ON p.id = c.producto_id
  WHERE c.usuario_id = p_usuario_id;

  -- Descontar stock
  UPDATE inventario i
  JOIN carrito c ON c.producto_id = i.producto_id
  SET i.stock_actual = i.stock_actual - c.cantidad
  WHERE c.usuario_id = p_usuario_id;

  -- Registrar salidas en inventario
  INSERT INTO inventario_movimientos (producto_id, tipo, cantidad, motivo)
  SELECT c.producto_id, 'salida', c.cantidad, CONCAT('Pedido #', v_pedido_id)
  FROM carrito c WHERE c.usuario_id = p_usuario_id;

  -- Historial inicial
  INSERT INTO pedido_historial (pedido_id, estatus, comentario, usuario_id)
  VALUES (v_pedido_id, 'pendiente', 'Pedido creado', p_usuario_id);

  -- Registro de pago pendiente
  INSERT INTO pagos (pedido_id, metodo, monto)
  VALUES (v_pedido_id, p_metodo_pago, v_subtotal);

  -- Vaciar carrito
  DELETE FROM carrito WHERE usuario_id = p_usuario_id;

  SELECT v_pedido_id AS pedido_id, v_subtotal AS total, 'Pedido creado exitosamente' AS mensaje;
END$$

CREATE PROCEDURE sp_pedido_obtener(IN p_pedido_id INT)
BEGIN
  SELECT p.*, u.nombre AS cliente_nombre, u.email AS cliente_email, u.telefono,
         d.calle, d.numero, d.colonia, d.ciudad, d.estado, d.codigo_postal
  FROM pedidos p
  JOIN usuarios u ON u.id = p.usuario_id
  LEFT JOIN direcciones d ON d.id = p.direccion_id
  WHERE p.id = p_pedido_id;

  SELECT * FROM pedido_items WHERE pedido_id = p_pedido_id;

  SELECT h.*, u.nombre AS usuario_nombre
  FROM pedido_historial h
  LEFT JOIN usuarios u ON u.id = h.usuario_id
  WHERE h.pedido_id = p_pedido_id ORDER BY h.creado_en ASC;
END$$

CREATE PROCEDURE sp_pedido_listar_cliente(IN p_usuario_id INT)
BEGIN
  SELECT p.id, p.total, p.metodo_pago, p.estatus, p.creado_en,
         COUNT(pi.id) AS total_items
  FROM pedidos p
  JOIN pedido_items pi ON pi.pedido_id = p.id
  WHERE p.usuario_id = p_usuario_id
  GROUP BY p.id ORDER BY p.creado_en DESC;
END$$

CREATE PROCEDURE sp_pedido_listar_admin(IN p_estatus VARCHAR(20))
BEGIN
  IF p_estatus IS NULL THEN
    SELECT p.id, p.total, p.metodo_pago, p.estatus, p.creado_en,
           u.nombre AS cliente, u.email
    FROM pedidos p JOIN usuarios u ON u.id = p.usuario_id
    ORDER BY p.creado_en DESC;
  ELSE
    SELECT p.id, p.total, p.metodo_pago, p.estatus, p.creado_en,
           u.nombre AS cliente, u.email
    FROM pedidos p JOIN usuarios u ON u.id = p.usuario_id
    WHERE p.estatus = p_estatus ORDER BY p.creado_en DESC;
  END IF;
END$$

-- Cambiar estatus + regresa stock si se cancela
CREATE PROCEDURE sp_pedido_cambiar_estatus(
  IN p_pedido_id  INT,
  IN p_estatus    ENUM('pendiente','en_proceso','enviado','entregado','cancelado'),
  IN p_comentario TEXT,
  IN p_admin_id   INT
)
BEGIN
  UPDATE pedidos SET estatus = p_estatus WHERE id = p_pedido_id;

  INSERT INTO pedido_historial (pedido_id, estatus, comentario, usuario_id)
  VALUES (p_pedido_id, p_estatus, p_comentario, p_admin_id);

  IF p_estatus = 'cancelado' THEN
    UPDATE inventario i
    JOIN pedido_items pi ON pi.producto_id = i.producto_id
    SET i.stock_actual = i.stock_actual + pi.cantidad
    WHERE pi.pedido_id = p_pedido_id;

    INSERT INTO inventario_movimientos (producto_id, tipo, cantidad, motivo, usuario_id)
    SELECT pi.producto_id, 'entrada', pi.cantidad,
           CONCAT('Devolución pedido cancelado #', p_pedido_id), p_admin_id
    FROM pedido_items pi WHERE pi.pedido_id = p_pedido_id;
  END IF;

  SELECT ROW_COUNT() AS filas_afectadas;
END$$

-- ============================================================
-- MÓDULO 8: PAGOS
-- ============================================================

CREATE PROCEDURE sp_pago_registrar_comprobante(
  IN p_pedido_id       INT,
  IN p_referencia      VARCHAR(200),
  IN p_comprobante_url VARCHAR(500)
)
BEGIN
  UPDATE pagos
  SET referencia = p_referencia, comprobante_url = p_comprobante_url,
      estatus = 'verificando', fecha_pago = NOW()
  WHERE pedido_id = p_pedido_id;
  SELECT ROW_COUNT() AS filas_afectadas;
END$$

CREATE PROCEDURE sp_pago_verificar(
  IN p_pedido_id INT,
  IN p_estatus   ENUM('confirmado','rechazado'),
  IN p_admin_id  INT
)
BEGIN
  UPDATE pagos
  SET estatus = p_estatus, verificado_por = p_admin_id
  WHERE pedido_id = p_pedido_id;

  IF p_estatus = 'confirmado' THEN
    CALL sp_pedido_cambiar_estatus(p_pedido_id, 'en_proceso', 'Pago confirmado por admin', p_admin_id);
  END IF;

  SELECT ROW_COUNT() AS filas_afectadas;
END$$

-- ============================================================
-- MÓDULO 9: REPORTES
-- ============================================================

CREATE PROCEDURE sp_reporte_ventas(
  IN p_fecha_inicio DATE,
  IN p_fecha_fin    DATE
)
BEGIN
  SELECT
    COUNT(*)   AS total_pedidos,
    SUM(total) AS ingresos_totales,
    AVG(total) AS ticket_promedio,
    MIN(total) AS venta_minima,
    MAX(total) AS venta_maxima
  FROM pedidos
  WHERE DATE(creado_en) BETWEEN p_fecha_inicio AND p_fecha_fin
    AND estatus NOT IN ('cancelado');
END$$

CREATE PROCEDURE sp_reporte_ventas_por_dia(
  IN p_fecha_inicio DATE,
  IN p_fecha_fin    DATE
)
BEGIN
  SELECT DATE(creado_en) AS fecha, COUNT(*) AS total_pedidos, SUM(total) AS ingresos
  FROM pedidos
  WHERE DATE(creado_en) BETWEEN p_fecha_inicio AND p_fecha_fin
    AND estatus NOT IN ('cancelado')
  GROUP BY DATE(creado_en) ORDER BY fecha ASC;
END$$

CREATE PROCEDURE sp_reporte_productos_top(IN p_limite INT)
BEGIN
  SELECT * FROM vista_productos_vendidos LIMIT p_limite;
END$$

CREATE PROCEDURE sp_reporte_por_categoria()
BEGIN
  SELECT c.nombre AS categoria, COUNT(pi.id) AS total_ventas, SUM(pi.subtotal) AS ingresos
  FROM pedido_items pi
  JOIN productos p  ON p.id  = pi.producto_id
  JOIN categorias c ON c.id  = p.categoria_id
  JOIN pedidos ped  ON ped.id = pi.pedido_id
  WHERE ped.estatus NOT IN ('cancelado')
  GROUP BY c.id, c.nombre ORDER BY ingresos DESC;
END$$

CREATE PROCEDURE sp_dashboard_resumen()
BEGIN
  SELECT COUNT(*) AS pedidos_hoy, COALESCE(SUM(total), 0) AS ventas_hoy
  FROM pedidos WHERE DATE(creado_en) = CURDATE() AND estatus NOT IN ('cancelado');

  SELECT COUNT(*) AS pedidos_pendientes FROM pedidos WHERE estatus = 'pendiente';

  SELECT COUNT(*) AS productos_stock_bajo FROM vista_stock_bajo;

  SELECT COUNT(*) AS total_clientes FROM usuarios WHERE rol = 'cliente' AND activo = TRUE;
END$$

DELIMITER ;

-- ============================================================
-- 📌 REFERENCIA RÁPIDA — Cómo usar desde Node.js
-- ============================================================
-- const [rows] = await db.query('CALL sp_usuario_registrar(?,?,?,?,?)', [nombre, apellido, email, hash, tel]);
-- const [rows] = await db.query('CALL sp_pedido_crear(?,?,?,?)', [userId, dirId, metodo, notas]);
-- const [rows] = await db.query('CALL sp_reporte_ventas(?,?)', ['2025-01-01', '2025-12-31']);
-- ============================================================
