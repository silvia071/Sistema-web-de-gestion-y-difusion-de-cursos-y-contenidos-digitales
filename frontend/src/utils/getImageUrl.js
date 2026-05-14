import api from "../services/api";

export const getImageUrl = (path) => {
  if (!path) return "/placeholder-curso.png";

  if (path.startsWith("http")) return path;

  return `${api.defaults.baseURL}${path}`;
};
