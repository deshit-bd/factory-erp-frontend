import { useState } from "react";

import { sidebarItems } from "@/shared/config/sidebar-navigation";

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
  "Raw Material Supplier Payment": "Accounts",
  Accounts: "Accounts",
  Settings: "System",
};

const permissionGroupOrder = ["Dashboard", "Party", "Order", "Stock", "Production", "Accounts", "System"];

const permissionGroups = permissionGroupOrder
  .map((title) => [
    title,
    sidebarItems
      .filter((item) => (permissionGroupTitles[item.label] ?? "Other") === title)
      .map((item) => item.label),
  ])
  .filter(([, permissions]) => permissions.length > 0)
  .map(([title, permissions]) => ({ title, permissions }));

const allPermissionLabels = sidebarItems.map((item) => item.label);

const initialUsers = [
  {
    name: "Admin User",
    email: "admin@factory.com",
    role: "Administrator",
    status: "Active",
    permissions: allPermissionLabels,
  },
  {
    name: "Manager User",
    email: "manager@factory.com",
    role: "Manager",
    status: "Active",
    permissions: [
      "Dashboard",
      "Sales Orders",
      "Projects",
      "Raw Material Supplier",
      "Project Goods Supplier",
      "Raw Material Supplier Payment",
      "Invoices",
      "Accounts",
      "Settings",
    ],
  },
];

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

function Field({ label, name, value, onChange, placeholder = "" }) {
  return (
    <label className="block space-y-2">
      <span className="text-[13px] font-medium text-[#d6ddea]">{label}</span>
      <input
        className="h-11 w-full rounded-md border border-[#334156] bg-[#243045] px-4 text-[14px] text-[#e6ebf4] outline-none placeholder:text-[#7c8aa0]"
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        type="text"
        value={value}
      />
    </label>
  );
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Users & Roles");
  const [users, setUsers] = useState(initialUsers);
  const [companyInfo, setCompanyInfo] = useState(initialCompanyInfo);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserEmail, setEditingUserEmail] = useState(null);
  const [formValues, setFormValues] = useState({ name: "", email: "", role: "" });
  const [permissionMode, setPermissionMode] = useState("custom");
  const [selectedPermissions, setSelectedPermissions] = useState(allPermissionLabels);

  function openModal(user = null) {
    if (user) {
      setEditingUserEmail(user.email);
      setFormValues({ name: user.name, email: user.email, role: user.role });
      setPermissionMode(user.permissions?.length ? "custom" : "role");
      setSelectedPermissions(user.permissions?.length ? user.permissions : allPermissionLabels);
    } else {
      setEditingUserEmail(null);
      setFormValues({ name: "", email: "", role: "" });
      setPermissionMode("custom");
      setSelectedPermissions(allPermissionLabels);
    }
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingUserEmail(null);
  }

  function handleUserFormChange(event) {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  }

  function togglePermission(label) {
    setSelectedPermissions((current) =>
      current.includes(label) ? current.filter((item) => item !== label) : [...current, label],
    );
  }

  function handleCompanyInfoChange(event) {
    const { name, value } = event.target;
    setCompanyInfo((current) => ({ ...current, [name]: value }));
  }

  function handleAddUser(event) {
    event.preventDefault();
    if (editingUserEmail) {
      setUsers((current) =>
        current.map((user) =>
          user.email === editingUserEmail
            ? {
                ...user,
                ...formValues,
                role: formValues.role || "Custom Role",
                permissions: permissionMode === "custom" ? selectedPermissions : [],
              }
            : user,
        ),
      );
    } else {
      setUsers((current) => [
        ...current,
        {
          ...formValues,
          role: formValues.role || "Custom Role",
          status: "Active",
          permissions: permissionMode === "custom" ? selectedPermissions : [],
        },
      ]);
    }
    closeModal();
  }

  function toggleUserStatus(email) {
    setUsers((current) =>
      current.map((user) =>
        user.email === email
          ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" }
          : user,
      ),
    );
  }

  function deleteUser(email) {
    setUsers((current) => current.filter((user) => user.email !== email));
  }

  function handleSaveCompanyInfo(event) {
    event.preventDefault();
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
                {users.map((user) => (
                  <tr className="border-b border-[#344059] text-[13px] text-[#d7deea]" key={user.email}>
                    <td className="py-4">{user.name}</td>
                    <td className="py-4 text-[#9aa5ba]">{user.email}</td>
                    <td className="py-4">{user.role}</td>
                    <td className="py-4">
                      <span
                        className={[
                          "inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium",
                          user.status === "Active"
                            ? "bg-[rgba(245,158,11,0.18)] text-[#65a30d]"
                            : "bg-[#e2e8f0] text-[#64748b]",
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
                          onClick={() => toggleUserStatus(user.email)}
                          type="button"
                        >
                          {user.status === "Active" ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          className="rounded-md border border-[#5b3340] px-3 py-2 text-[12px] font-medium text-[#ff9fb1] transition hover:border-[#7a4354] hover:text-[#ffd5de]"
                          onClick={() => deleteUser(user.email)}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
            <Field label="Company Name" name="companyName" onChange={handleCompanyInfoChange} value={companyInfo.companyName} />
            <Field label="Email" name="email" onChange={handleCompanyInfoChange} value={companyInfo.email} />
            <Field label="Phone" name="phone" onChange={handleCompanyInfoChange} value={companyInfo.phone} />
            <Field label="Address" name="address" onChange={handleCompanyInfoChange} value={companyInfo.address} />

            <div>
              <button
                className="inline-flex items-center rounded-[4px] bg-[#f5a30f] px-5 py-3 text-[12px] font-medium text-[#172136] transition hover:bg-[#ffb327]"
                type="submit"
              >
                Save Changes
              </button>
            </div>
          </form>
        </section>
      ) : null}

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#0d1422]/70 px-4 py-4">
          <div className="w-full max-h-[calc(100vh-2rem)] max-w-[570px] overflow-y-auto rounded-md border border-[#314058] bg-[#222d40] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-[#314058] px-4 py-4">
              <h3 className="text-[22px] font-semibold text-[#e6ebf4]">{editingUserEmail ? "Edit User" : "Add New User"}</h3>
              <button className="text-[#d7deea] transition hover:text-white" onClick={closeModal} type="button">
                <CloseIcon />
              </button>
            </div>

            <form className="space-y-4 px-4 py-4" onSubmit={handleAddUser}>
              <Field label="Name *" name="name" onChange={handleUserFormChange} placeholder="Enter user name" value={formValues.name} />
              <Field label="Email *" name="email" onChange={handleUserFormChange} placeholder="Enter email address" value={formValues.email} />
              <Field label="Role *" name="role" onChange={handleUserFormChange} placeholder="Enter role name" value={formValues.role} />

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
                      onClick={() => setSelectedPermissions(allPermissionLabels)}
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
                          <label className="flex items-center gap-2 text-[12px] text-[#d7deea]" key={permission}>
                            <input
                              checked={selectedPermissions.includes(permission)}
                              className="h-4 w-4 accent-[#f6a313]"
                              onChange={() => togglePermission(permission)}
                              type="checkbox"
                            />
                            <span>{permission}</span>
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
                  className="inline-flex h-11 items-center rounded-md bg-[#f6a313] px-5 text-[14px] font-medium text-[#111827] transition hover:bg-[#ffb733]"
                  type="submit"
                >
                  {editingUserEmail ? "Save Changes" : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
