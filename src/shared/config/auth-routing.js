export const roleRoutePrefixes = {
  admin: "/admin",
  manager: "/manager",
  production_manager: "/production-manager",
  salesman: "/salesman",
};

export function getRoleRoutePrefix(role) {
  return roleRoutePrefixes[role] || "";
}

export function prefixPathForRole(role, path = "/") {
  const rolePrefix = getRoleRoutePrefix(role);

  if (!rolePrefix) {
    return path;
  }

  if (path === "/") {
    return rolePrefix;
  }

  return `${rolePrefix}${path}`;
}

export function stripRolePrefix(pathname = "") {
  const normalizedPath = pathname || "/";

  for (const prefix of Object.values(roleRoutePrefixes)) {
    if (normalizedPath === prefix) {
      return "/";
    }

    if (normalizedPath.startsWith(`${prefix}/`)) {
      return normalizedPath.slice(prefix.length);
    }
  }

  return normalizedPath;
}

export function getPostLoginPath(user, fromPath) {
  if (fromPath && fromPath !== "/" && fromPath !== "/login") {
    return fromPath;
  }

  return prefixPathForRole(user?.role, "/");
}
