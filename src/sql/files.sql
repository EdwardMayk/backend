-- Tabla usuario
CREATE TABLE usuario (
    id_usuario INT PRIMARY KEY,
    nombre VARCHAR(255),
    apellido VARCHAR(255),
    dni VARCHAR(20),
    telefono VARCHAR(15),
    email VARCHAR(255),
    usuario VARCHAR(50),
    contraseña VARCHAR(255),
    activo BOOLEAN,
    rol VARCHAR(20) -- Puedes ajustar la longitud según tus necesidades
);

-- Tabla periodos
CREATE TABLE periodos (
    id_periodo INT PRIMARY KEY,
    periodo VARCHAR(10),
    descripcion TEXT,
    activo BOOLEAN,
    id_usuario INT,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

-- Tabla areas
CREATE TABLE areas (
    id_area INT PRIMARY KEY,
    nombre_area VARCHAR(255),
    descripcion TEXT,
    publico BOOLEAN,
    id_periodo INT,
    FOREIGN KEY (id_periodo) REFERENCES periodos(id_periodo)
);

-- Tabla archivadores
CREATE TABLE archivadores (
    id_archivador INT PRIMARY KEY,
    nombre_archivador VARCHAR(255),
    codigo VARCHAR(50),
    estante VARCHAR(50),
    modulo VARCHAR(50),
    descripcion TEXT,
    publico BOOLEAN,
    id_area INT,
    FOREIGN KEY (id_area) REFERENCES areas(id_area)
);

-- Tabla documentos
CREATE TABLE documentos (
    id_documento INT PRIMARY KEY,
    archivo_documento BLOB, -- Aquí debes usar el tipo de dato correcto para almacenar archivos (BLOB, por ejemplo)
    numero_documento VARCHAR(50),
    numero_folio VARCHAR(50),
    persona_dirigido VARCHAR(255),
    ubicacion VARCHAR(255),
    descripcion TEXT,
    publico BOOLEAN,
    activo BOOLEAN,
    perdido BOOLEAN,
    fecha_creacion TIMESTAMP,
    id_usuario_creador INT,
    id_archivador INT,
    FOREIGN KEY (id_usuario_creador) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_archivador) REFERENCES archivadores(id_archivador)
);
