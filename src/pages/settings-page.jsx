import { useEffect, useState } from "react";

import { mapPermissionKeysToLabels, mapPermissionLabelsToKeys, roleOptions } from "@/shared/config/access-control";
import { sidebarItems } from "@/shared/config/sidebar-navigation";
import { getCompanyInfo, saveCompanyInfo } from "@/shared/lib/accounts-api";
import { createUser, deleteUser, getUsers, updateUser } from "@/shared/lib/auth-api";

const permissionGroupTitles = {
  Dashboard: "Dashboard",
  "Buyer Management": "Party",
  "Raw Material Supplier": "Party",
  "Project Goods Supplier": "Party",
  "Supplier Assignment": "Party",
  "Sales Orders": "Order",
  Projects: "Order",
  Invoices: "Order",
  "Raw Material Stock": "Stock",
  "Material Purchase": "Stock",
  "Material Allocation": "Stock",
  "Finished Goods": "Stock",
  "Factory Product Tracking": "Production",
  "Supplier Products Tracking": "Production",
  "Delivery/Shipment": "Production",
  "Delivery History": "Production",
  "Material Supplier Payment": "Accounts",
  "Goods Supplier Payment": "Accounts",
  Accounts: "Accounts",
  Settings: "System",
};

const permissionGroupOrder = ["Dashboard", "Party", "Order", "Stock", "Production", "Accounts", "System"];

const permissionGroups = permissionGroupOrder
  .map((title) => [
    title,
    sidebarItems
      .filter((item) => (permissionGroupTitles[item.label] ?? "Other") === title)
      .map((item) => ({ label: item.label, key: item.permissionKey })),
  ])
  .filter(([, permissions]) => permissions.length > 0)
  .map(([title, permissions]) => ({ title, permissions }));

const allPermissionLabels = sidebarItems.map((item) => item.label);

const initialCompanyInfo = {
  companyName: "Factory Manufacturing Inc",
  email: "contact@factory.com",
  phone: "+1-234-567-8900",
  address: "Industrial District, NY 10001",
};

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function Field({ label, name, value, onChange, placeholder = "", type = "text" }) {
  return (
    <label className="block space-y-2">
      <span className="text-[13px] font-medium text-[#d6ddea]">{label}</span>
      <input
        className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none placeholder:text-[#7c8aa0]"
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </label>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <label className="block space-y-2">
      <span className="text-[13px] font-medium text-[#d6ddea]">{label}</span>
      <select
        className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none"
        name={name}
        onChange={onChange}
        value={value}
      >
        <option value="">Select role</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function formatRoleLabel(role) {
  return roleOptions.find((option) => option.value === role)?.label || role;
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Users & Roles");
  const [users, setUsers] = useState([]);
  const [usersError, setUsersError] = useState("");
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [isUserSaving, setIsUserSaving] = useState(false);
  const [companyInfo, setCompanyInfo] = useState(initialCompanyInfo);
  const [companyInfoMessage, setCompanyInfoMessage] = useState("");
  const [companyInfoError, setCompanyInfoError] = useState("");
  const [isCompanyInfoSaving, setIsCompanyInfoSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formValues, setFormValues] = useState({ name: "", email: "", role: "", password: "", status: "active" });
  const [permissionMode, setPermissionMode] = useState("role");
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function loadUsers() {
      try {
        setIsUsersLoading(true);
        setUsersError("");
        const usersResponse = await getUsers();

        if (isMounted) {
          setUsers(
            usersResponse.map((user) => ({
              ...user,
              permissions: mapPermissionKeysToLabels(user.permissions || []),
              status: String(user.status || "").toLowerCase() === "active" ? "Active" : "Inactive",
            })),
          );
        }
      } catch (error) {
        if (isMounted) {
          setUsersError(error.message || "Failed to load users.");
        }
      } finally {
        if (isMounted) {
          setIsUsersLoading(false);
        }
      }
    }

    async function loadCompanyInfo() {
      try {
        setCompanyInfoError("");
        const data = await getCompanyInfo();

        if (isMounted && data) {
          setCompanyInfo({
            companyName: data.companyName || "",
            email: data.email || "",
            phone: data.phone || "",
            address: data.address || "",
          });
        }
      } catch (error) {
        if (isMounted) {
          setCompanyInfoError(error.message || "Failed to load company info.");
        }
      }
    }

    loadUsers();
    loadCompanyInfo();

    return () => {
      isMounted = false;
    };
  }, []);

  function openModal(user = null) {
    if (user) {
      setEditingUserId(user.id);
      setFormValues({
        name: user.name,
        email: user.email,
        role: user.role,
        password: "",
        status: user.status === "Active" ? "active" : "inactive",
      });
      setPermissionMode(user.permissionMode || "role");
      setSelectedPermissions(user.permissionMode === "custom" ? mapPermissionLabelsToKeys(user.permissions || []) : []);
    } else {
      setEditingUserId(null);
      setFormValues({ name: "", email: "", role: "", password: "", status: "active" });
      setPermissionMode("role");
      setSelectedPermissions([]);
    }
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingUserId(null);
  }

  function handleUserFormChange(event) {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  }

  function togglePermission(permissionKey) {
    setSelectedPermissions((current) =>
      current.includes(permissionKey) ? current.filter((item) => item !== permissionKey) : [...current, permissionKey],
    );
  }

  function handleCompanyInfoChange(event) {
    const { name, value } = event.target;
    setCompanyInfoMessage("");
    setCompanyInfoError("");
    setCompanyInfo((current) => ({ ...current, [name]: value }));
  }

  async function handleAddUser(event) {
    event.preventDefault();

    try {
      setIsUserSaving(true);
      setUsersError("");
      const payload = {
        ...formValues,
        permissionMode,
        permissions: permissionMode === "custom" ? selectedPermissions : [],
      };
      const savedUser = editingUserId ? await updateUser(editingUserId, payload) : await createUser(payload);
      const normalizedUser = {
        ...savedUser,
        permissions: mapPermissionKeysToLabels(savedUser.permissions || []),
        status: String(savedUser.status || "").toLowerCase() === "active" ? "Active" : "Inactive",
      };

      setUsers((current) =>
        editingUserId ? current.map((user) => (user.id === editingUserId ? normalizedUser : user)) : [normalizedUser, ...current],
      );
      closeModal();
    } catch (error) {
      setUsersError(error.message || "Failed to save user.");
    } finally {
      setIsUserSaving(false);
    }
  }

  async function toggleUserStatus(user) {
    try {
      setUsersError("");
      const updatedUser = await updateUser(user.id, {
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status === "Active" ? "inactive" : "active",
        permissionMode: user.permissionMode || "role",
        permissions: user.permissionMode === "custom" ? mapPermissionLabelsToKeys(user.permissions || []) : [],
      });

      setUsers((current) =>
        current.map((item) =>
          item.id === user.id
            ? {
                ...updatedUser,
                permissions: mapPermissionKeysToLabels(updatedUser.permissions || []),
                status: String(updatedUser.status || "").toLowerCase() === "active" ? "Active" : "Inactive",
              }
            : item,
        ),
      );
    } catch (error) {
      setUsersError(error.message || "Failed to update user status.");
    }
  }

  async function handleDeleteUser(user) {
    try {
      setUsersError("");
      await deleteUser(user.id);
      setUsers((current) => current.filter((item) => item.id !== user.id));
    } catch (error) {
      setUsersError(error.message || "Failed to delete user.");
    }
  }

  async function handleSaveCompanyInfo(event) {
    event.preventDefault();

    try {
      setIsCompanyInfoSaving(true);
      setCompanyInfoError("");
      setCompanyInfoMessage("");
      const data = await saveCompanyInfo(companyInfo);

      setCompanyInfo({
        companyName: data.companyName || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
      });
      setCompanyInfoMessage("Company info saved successfully.");
    } catch (error) {
      setCompanyInfoError(error.message || "Failed to save company info.");
    } finally {
      setIsCompanyInfoSaving(false);
    }
  }

  return (
    <section className="w-full min-w-0 space-y-5">
      <div className="space-y-2">
        <h2 className="text-[18px] font-semibold leading-none text-[#e6ebf4]">Settings</h2>
        <p className="text-[11px] text-[#8f9cb0]">Manage system configuration and preferences</p>
      </div>

      <section className="flex flex-wrap gap-2">
        {["Users & Roles", "Company Info"].map((tab) => (
          <button
            className={[
              "rounded-[4px] px-4 py-[8px] text-[12px] font-medium leading-none transition",
              activeTab === tab ? "bg-[#f5a30f] text-[#172136]" : "bg-[#4a5875] text-[#edf2f7] hover:bg-[#5a6886]",
            ].join(" ")}
            key={tab}
            onClick={() => setActiveTab(tab)}
            type="button"
          >
            {tab}
          </button>
        ))}
      </section>

      {activeTab === "Users & Roles" ? (
        <section className="rounded-[5px] border border-[#344059] bg-[#202b3f] px-4 py-4">
          <div className="text-[13px] font-semibold text-[#d7deea]">User Management</div>
          {usersError ? <div className="mt-4 rounded-md border border-[#5b3540] bg-[#37242a] px-4 py-3 text-[13px] text-[#f7c8cf]">{usersError}</div> : null}

          <div className="mt-4 overflow-x-auto">
            <table className="w-full table-fixed border-collapse text-left">
              <thead>
                <tr className="border-b border-[#344059] text-[10px] uppercase tracking-[0.14em] text-[#98a3b8]">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isUsersLoading ? (
                  <tr>
                    <td className="py-8 text-center text-[14px] text-[#98a5bb]" colSpan={5}>
                      Loading users...
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr className="border-b border-[#344059] text-[13px] text-[#d7deea]" key={user.id}>
                      <td className="py-4">{user.name}</td>
                      <td className="py-4 text-[#9aa5ba]">{user.email}</td>
                      <td className="py-4">{formatRoleLabel(user.role)}</td>
                      <td className="py-4">
                        <span
                          className={[
                            "inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium",
                            user.status === "Active" ? "bg-[rgba(245,158,11,0.18)] text-[#65a30d]" : "bg-[#e2e8f0] text-[#64748b]",
                          ].join(" ")}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            className="rounded-md border border-[#334156] px-3 py-2 text-[12px] font-medium text-[#d6ddea] transition hover:border-[#4e6180] hover:text-white"
                            onClick={() => openModal(user)}
                            type="button"
                          >
                            Edit
                          </button>
                          <button
                            className="rounded-md border border-[#334156] px-3 py-2 text-[12px] font-medium text-[#d6ddea] transition hover:border-[#4e6180] hover:text-white"
                            onClick={() => toggleUserStatus(user)}
                            type="button"
                          >
                            {user.status === "Active" ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            className="rounded-md border border-[#5b3340] px-3 py-2 text-[12px] font-medium text-[#ff9fb1] transition hover:border-[#7a4354] hover:text-[#ffd5de]"
                            onClick={() => handleDeleteUser(user)}
                            type="button"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <button
              className="inline-flex items-center rounded-[4px] bg-[#f5a30f] px-5 py-3 text-[12px] font-medium text-[#172136] transition hover:bg-[#ffb327]"
              onClick={openModal}
              type="button"
            >
              Add User
            </button>
          </div>
        </section>
      ) : null}

      {activeTab === "Company Info" ? (
        <section className="rounded-[5px] border border-[#344059] bg-[#202b3f] px-4 py-4">
          <div className="text-[13px] font-semibold text-[#d7deea]">Company Information</div>

          <form className="mt-4 space-y-4" onSubmit={handleSaveCompanyInfo}>
            {companyInfoError ? <div className="rounded-md border border-[#5b3540] bg-[#37242a] px-4 py-3 text-[13px] text-[#f7c8cf]">{companyInfoError}</div> : null}
            {companyInfoMessage ? <div className="rounded-md border border-[#38513a] bg-[#24372a] px-4 py-3 text-[13px] text-[#a7f3c0]">{companyInfoMessage}</div> : null}
            <Field label="Company Name" name="companyName" onChange={handleCompanyInfoChange} value={companyInfo.companyName} />
            <Field label="Email" name="email" onChange={handleCompanyInfoChange} value={companyInfo.email} />
            <Field label="Phone" name="phone" onChange={handleCompanyInfoChange} value={companyInfo.phone} />
            <Field label="Address" name="address" onChange={handleCompanyInfoChange} value={companyInfo.address} />

            <div>
              <button
                className="inline-flex items-center rounded-[4px] bg-[#f5a30f] px-5 py-3 text-[12px] font-medium text-[#172136] transition hover:bg-[#ffb327]"
                disabled={isCompanyInfoSaving}
                type="submit"
              >
                {isCompanyInfoSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </section>
      ) : null}

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#0d1422]/70 px-4 py-4">
          <div className="w-full max-h-[calc(100vh-2rem)] max-w-[570px] overflow-y-auto rounded-md border border-[#314058] bg-[#222d40] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-[#314058] px-4 py-4">
              <h3 className="text-[22px] font-semibold text-[#e6ebf4]">{editingUserId ? "Edit User" : "Add New User"}</h3>
              <button className="text-[#d7deea] transition hover:text-white" onClick={closeModal} type="button">
                <CloseIcon />
              </button>
            </div>

            <form className="space-y-4 px-4 py-4" onSubmit={handleAddUser}>
              <Field label="Name *" name="name" onChange={handleUserFormChange} placeholder="Enter user name" value={formValues.name} />
              <Field label="Email *" name="email" onChange={handleUserFormChange} placeholder="Enter email address" type="email" value={formValues.email} />
              <SelectField label="Role *" name="role" onChange={handleUserFormChange} options={roleOptions} value={formValues.role} />
              <Field
                label={editingUserId ? "Password" : "Password *"}
                name="password"
                onChange={handleUserFormChange}
                placeholder={editingUserId ? "Leave blank to keep current password" : "Enter password"}
                type="password"
                value={formValues.password}
              />

              <section className="space-y-4 rounded-md border border-[#314058] bg-[#243045] px-4 py-4">
                <div>
                  <div className="text-[14px] font-semibold text-[#e6ebf4]">Permission Mode</div>
                  <div className="mt-3 space-y-3">
                    <label className="flex items-center gap-2 text-[13px] text-[#d7deea]">
                      <input
                        checked={permissionMode === "role"}
                        className="h-4 w-4 accent-[#f6a313]"
                        name="permission_mode"
                        onChange={() => setPermissionMode("role")}
                        type="radio"
                      />
                      <span>Use Role Permissions Only</span>
                    </label>
                    <label className="flex items-center gap-2 text-[13px] text-[#d7deea]">
                      <input
                        checked={permissionMode === "custom"}
                        className="h-4 w-4 accent-[#f6a313]"
                        name="permission_mode"
                        onChange={() => setPermissionMode("custom")}
                        type="radio"
                      />
                      <span>Customize Individual Permissions</span>
                    </label>
                  </div>
                </div>
              </section>

              <section className="space-y-4 rounded-md border border-[#314058] bg-[#243045] px-4 py-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-[14px] font-semibold text-[#e6ebf4]">Individual Permission Selection</div>
                  <div className="flex gap-2">
                    <button
                      className="rounded-md border border-[#334156] px-3 py-2 text-[12px] font-medium text-[#d6ddea] transition hover:border-[#4e6180] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={permissionMode !== "custom"}
                      onClick={() => setSelectedPermissions(mapPermissionLabelsToKeys(allPermissionLabels))}
                      type="button"
                    >
                      Select All
                    </button>
                    <button
                      className="rounded-md border border-[#334156] px-3 py-2 text-[12px] font-medium text-[#d6ddea] transition hover:border-[#4e6180] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={permissionMode !== "custom"}
                      onClick={() => setSelectedPermissions([])}
                      type="button"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                <div className="rounded-md border border-[#80561a] bg-[#3a352d] px-3 py-3 text-[12px] text-[#f6a313]">
                  Note: Custom permissions will override default role access.
                </div>

                <div
                  className={[
                    "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3",
                    permissionMode !== "custom" && "pointer-events-none opacity-50",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {permissionGroups.map((group) => (
                    <div className="rounded-md border border-[#334156] bg-[#202b3f] px-4 py-4" key={group.title}>
                      <div className="text-[14px] font-semibold text-[#e6ebf4]">{group.title}</div>
                      <div className="mt-3 space-y-2">
                        {group.permissions.map((permission) => (
                          <label className="flex items-center gap-2 text-[12px] text-[#d7deea]" key={permission.key}>
                            <input
                              checked={selectedPermissions.includes(permission.key)}
                              className="h-4 w-4 accent-[#f6a313]"
                              onChange={() => togglePermission(permission.key)}
                              type="checkbox"
                            />
                            <span>{permission.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <div className="flex justify-end gap-3 border-t border-[#314058] pt-4">
                <button className="px-2 text-[14px] font-medium text-[#d6ddea] transition hover:text-white" onClick={closeModal} type="button">
                  Cancel
                </button>
                <button
                  className="inline-flex h-11 items-center rounded-md bg-[#f6a313] px-5 text-[14px] font-medium text-[#111827] transition hover:bg-[#ffb733] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isUserSaving}
                  type="submit"
                >
                  {isUserSaving ? "Saving..." : editingUserId ? "Save Changes" : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
