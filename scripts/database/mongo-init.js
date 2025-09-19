// Conectar a la base de datos
db = db.getSiblingDB('university_cvs');

// Crear colección de carreras con datos iniciales
db.careers.insertMany([
  {
    name: 'Ingeniería en Sistemas',
    department: 'Ingeniería',
    faculty: 'Facultad de Ingeniería',
    description: 'Carrera enfocada en el desarrollo de software y sistemas computacionales',
    isActive: true,
    createdAt: new Date()
  },
  {
    name: 'Administración de Empresas',
    department: 'Administración',
    faculty: 'Facultad de Ciencias Económicas',
    description: 'Carrera enfocada en la gestión y administración empresarial',
    isActive: true,
    createdAt: new Date()
  },
  {
    name: 'Derecho',
    department: 'Jurisprudencia',
    faculty: 'Facultad de Derecho',
    description: 'Carrera enfocada en ciencias jurídicas y legales',
    isActive: true,
    createdAt: new Date()
  },
  {
    name: 'Medicina',
    department: 'Medicina',
    faculty: 'Facultad de Medicina',
    description: 'Carrera enfocada en ciencias de la salud y medicina',
    isActive: true,
    createdAt: new Date()
  }
]);

// Crear índices para optimizar consultas
db.careers.createIndex({ "name": 1 });
db.careers.createIndex({ "department": 1 });
db.careers.createIndex({ "faculty": 1 });
db.careers.createIndex({ "isActive": 1 });

// Crear colección de profesores con índices
db.professors.createIndex({ "personalInfo.email": 1 }, { unique: true });
db.professors.createIndex({ "personalInfo.firstName": 1 });
db.professors.createIndex({ "personalInfo.lastName": 1 });
db.professors.createIndex({ "career.name": 1 });
db.professors.createIndex({ "career.department": 1 });
db.professors.createIndex({ "metadata.isActive": 1 });
db.professors.createIndex({ "metadata.createdAt": -1 });

// Crear índices de texto para búsqueda
db.professors.createIndex({
  "personalInfo.firstName": "text",
  "personalInfo.lastName": "text",
  "academicInfo.specialization": "text",
  "career.name": "text"
}, { name: "search_index" });

print('Base de datos MongoDB inicializada correctamente');