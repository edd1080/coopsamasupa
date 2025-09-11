export const destinationGroups = [
  { id: "1", value: "Grupo Consumo" },
  { id: "2", value: "Grupo MicroCredito" },
  { id: "3", value: "Grupo Productivo" },
  { id: "4", value: "Grupo Vivienda" }
];

export const destinationsByGroup = [
  { id: "1", groupId: "2", value: "AGRICULTURA" },
  { id: "2", groupId: "2", value: "AGROINDUSTRIA" },
  { id: "3", groupId: "2", value: "PECUARIO/AVICOLA" },
  { id: "4", groupId: "2", value: "COMERCIO" },
  { id: "5", groupId: "2", value: "SERVICIOS" },
  { id: "6", groupId: "4", value: "VIVIENDA" },
  { id: "7", groupId: "1", value: "CONSUMO" },
  { id: "8", groupId: "2", value: "INDUSTRIA" },
  { id: "9", groupId: "1", value: "TARJETA DE CRÉDITO" },
  { id: "10", groupId: "2", value: "REESTRUCTURA" },
  { id: "11", groupId: "1", value: "NOVACIÓN" },
  { id: "12", groupId: "3", value: "AGRICULTURA" },
  { id: "13", groupId: "3", value: "AGROINDUSTRIA" },
  { id: "14", groupId: "3", value: "PECUARIO/AVICOLA" },
  { id: "15", groupId: "3", value: "COMERCIO" },
  { id: "16", groupId: "3", value: "SERVICIOS" },
  { id: "17", groupId: "3", value: "INDUSTRIA" },
  { id: "18", groupId: "3", value: "REESTRUCTURA" },
  { id: "19", groupId: "1", value: "REESTRUCTURA" }
];

export const destinationCategories = [
  { id: "1", destinationId: "1", value: "Costo de producción" },
  { id: "2", destinationId: "1", value: "Mantenimiento" },
  { id: "3", destinationId: "1", value: "Activos fijos" },
  { id: "4", destinationId: "1", value: "Siembra" },
  { id: "5", destinationId: "2", value: "Producción de productos agropecuarios" },
  { id: "6", destinationId: "2", value: "Comercialización de productos agropecuarios" },
  { id: "7", destinationId: "2", value: "Comercialización de productos forestales" },
  { id: "8", destinationId: "2", value: "Activos fijos" },
  { id: "9", destinationId: "3", value: "Compra-venta" },
  { id: "10", destinationId: "3", value: "Crianza y engorde" },
  { id: "11", destinationId: "3", value: "Compra de materia prima y/o insumos" },
  { id: "12", destinationId: "3", value: "Activos fijos" },
  { id: "13", destinationId: "4", value: "Capital de trabajo" },
  { id: "14", destinationId: "4", value: "Activos fijos" },
  { id: "15", destinationId: "4", value: "Construcción y mejoras" },
  { id: "16", destinationId: "4", value: "Otros" },
  { id: "17", destinationId: "5", value: "Capital de trabajo" },
  { id: "18", destinationId: "5", value: "Activos fijos" },
  { id: "19", destinationId: "5", value: "Construcción y mejoras" },
  { id: "20", destinationId: "6", value: "Construcción y mejoras" },
  { id: "21", destinationId: "6", value: "Activos fijos" },
  { id: "22", destinationId: "7", value: "Gastos personales" },
  { id: "23", destinationId: "7", value: "Consolidación de deuda" },
  { id: "24", destinationId: "7", value: "Compra de vehiculo" },
  { id: "25", destinationId: "8", value: "Capital de trabajo" },
  { id: "26", destinationId: "8", value: "Activos fijos" },
  { id: "27", destinationId: "9", value: "Gastos personales" },
  { id: "28", destinationId: "9", value: "Servicios" },
  { id: "29", destinationId: "9", value: "Comercio" },
  { id: "30", destinationId: "10", value: "Reestructura" },
  { id: "31", destinationId: "11", value: "Novación" }
  // ... (continuing with full mapping)
];

export const getDestinationsByGroup = (groupId: string) => {
  return destinationsByGroup.filter(d => d.groupId === groupId);
};

export const getCategoriesByDestination = (destinationId: string) => {
  return destinationCategories.filter(c => c.destinationId === destinationId);
};