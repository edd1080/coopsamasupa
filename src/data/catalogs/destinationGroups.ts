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
  // AGRICULTURA (MicroCredito - id: 1)
  { id: "1", destinationId: "1", value: "Costo de producción" },
  { id: "2", destinationId: "1", value: "Mantenimiento" },
  { id: "3", destinationId: "1", value: "Activos fijos" },
  { id: "4", destinationId: "1", value: "Siembra" },
  
  // AGROINDUSTRIA (MicroCredito - id: 2)
  { id: "5", destinationId: "2", value: "Producción de productos agropecuarios" },
  { id: "6", destinationId: "2", value: "Comercialización de productos agropecuarios" },
  { id: "7", destinationId: "2", value: "Comercialización de productos forestales" },
  { id: "8", destinationId: "2", value: "Activos fijos" },
  
  // PECUARIO/AVICOLA (MicroCredito - id: 3)
  { id: "9", destinationId: "3", value: "Compra-venta" },
  { id: "10", destinationId: "3", value: "Crianza y engorde" },
  { id: "11", destinationId: "3", value: "Compra de materia prima y/o insumos" },
  { id: "12", destinationId: "3", value: "Activos fijos" },
  
  // COMERCIO (MicroCredito - id: 4)
  { id: "13", destinationId: "4", value: "Capital de trabajo" },
  { id: "14", destinationId: "4", value: "Activos fijos" },
  { id: "15", destinationId: "4", value: "Construcción y mejoras" },
  { id: "16", destinationId: "4", value: "Otros" },
  
  // SERVICIOS (MicroCredito - id: 5)
  { id: "17", destinationId: "5", value: "Capital de trabajo" },
  { id: "18", destinationId: "5", value: "Activos fijos" },
  { id: "19", destinationId: "5", value: "Construcción y mejoras" },
  
  // VIVIENDA (Grupo Vivienda - id: 6)
  { id: "20", destinationId: "6", value: "Construcción y mejoras" },
  { id: "21", destinationId: "6", value: "Activos fijos" },
  
  // CONSUMO (Grupo Consumo - id: 7)
  { id: "22", destinationId: "7", value: "Gastos personales" },
  { id: "23", destinationId: "7", value: "Consolidación de deuda" },
  { id: "24", destinationId: "7", value: "Compra de vehiculo" },
  
  // INDUSTRIA (MicroCredito - id: 8)
  { id: "25", destinationId: "8", value: "Capital de trabajo" },
  { id: "26", destinationId: "8", value: "Activos fijos" },
  
  // TARJETA DE CRÉDITO (Grupo Consumo - id: 9)
  { id: "27", destinationId: "9", value: "Gastos personales" },
  { id: "28", destinationId: "9", value: "Servicios" },
  { id: "29", destinationId: "9", value: "Comercio" },
  
  // REESTRUCTURA (MicroCredito - id: 10)
  { id: "30", destinationId: "10", value: "Reestructura" },
  
  // NOVACIÓN (Grupo Consumo - id: 11)
  { id: "31", destinationId: "11", value: "Novación" },
  
  // AGRICULTURA (Productivo - id: 12)
  { id: "32", destinationId: "12", value: "Costo de producción" },
  { id: "33", destinationId: "12", value: "Mantenimiento" },
  { id: "34", destinationId: "12", value: "Activos fijos" },
  { id: "35", destinationId: "12", value: "Siembra" },
  
  // AGROINDUSTRIA (Productivo - id: 13)
  { id: "36", destinationId: "13", value: "Producción de productos agropecuarios" },
  { id: "37", destinationId: "13", value: "Comercialización de productos agropecuarios" },
  { id: "38", destinationId: "13", value: "Comercialización de productos forestales" },
  { id: "39", destinationId: "13", value: "Activos fijos" },
  
  // PECUARIO/AVICOLA (Productivo - id: 14)
  { id: "40", destinationId: "14", value: "Compra-venta" },
  { id: "41", destinationId: "14", value: "Crianza y engorde" },
  { id: "42", destinationId: "14", value: "Compra de materia prima y/o insumos" },
  { id: "43", destinationId: "14", value: "Activos fijos" },
  
  // COMERCIO (Productivo - id: 15)
  { id: "44", destinationId: "15", value: "Capital de trabajo" },
  { id: "45", destinationId: "15", value: "Activos fijos" },
  { id: "46", destinationId: "15", value: "Construcción y mejoras" },
  { id: "47", destinationId: "15", value: "Otros" },
  
  // SERVICIOS (Productivo - id: 16)
  { id: "48", destinationId: "16", value: "Capital de trabajo" },
  { id: "49", destinationId: "16", value: "Activos fijos" },
  { id: "50", destinationId: "16", value: "Construcción y mejoras" },
  
  // INDUSTRIA (Productivo - id: 17)
  { id: "51", destinationId: "17", value: "Capital de trabajo" },
  { id: "52", destinationId: "17", value: "Activos fijos" },
  
  // REESTRUCTURA (Productivo - id: 18)
  { id: "53", destinationId: "18", value: "Reestructura" },
  
  // REESTRUCTURA (Grupo Consumo - id: 19)
  { id: "54", destinationId: "19", value: "Reestructura" }
];

export const getDestinationsByGroup = (groupId: string) => {
  return destinationsByGroup.filter(d => d.groupId === groupId);
};

export const getCategoriesByDestination = (destinationId: string) => {
  return destinationCategories.filter(c => c.destinationId === destinationId);
};