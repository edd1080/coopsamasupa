export interface ProjectType {
  id: string;
  value: string;
}

export const projectTypes: ProjectType[] = [
  { id: "1", value: "GUATEINVIERTE" },
  { id: "2", value: "WISE" },
  { id: "3", value: "FONDO DE GARANTÍA" },
  { id: "4", value: "EMPRENDEDORES" },
  { id: "5", value: "N/A" },
  { id: "6", value: "INAB" },
  { id: "7", value: "ASDI" },
  { id: "9", value: "CREDIEDUCA" },
  { id: "10", value: "IMIX" },
  { id: "11", value: "MUJER EMPRENDEDORA" },
  { id: "12", value: "GARANTÍA VERDE" },
  { id: "13", value: "CRÉDITO ROTATIVO" },
  { id: "14", value: "SWV" },
  { id: "15", value: "CRS" },
  { id: "16", value: "MINECO" },
  { id: "17", value: "FOPYMA" }
];

// Helper function to get project type by ID
export const getProjectTypeById = (id: string): ProjectType | undefined => {
  return projectTypes.find(type => type.id === id);
};