import { useState } from "react";
import { Users, Settings, Layers, Send } from "lucide-react";
import CosmicBackground from "./CosmicBackground";

/* ═══════════════════════════════════════════════════════════════
   VIVID SIGNATURE PRO™ — ADMIN PORTAL
   Employee Onboarding • Master Signatures • Dept/Role Management
   ═══════════════════════════════════════════════════════════════ */

const DEPARTMENTS = [
    "Executive Leadership",
    "Project Management",
    "Estimating",
    "Field Operations",
    "Business Development",
    "Marketing",
    "Accounting / Finance",
    "HR / Administration",
    "IT / Technology",
    "Legal / Compliance",
    "Consultants",
    "Safety Managers",
];

const ROLES = [
    "Owner / Principal",
    "Vice President",
    "Director",
    "Senior Manager",
    "Project Manager",
    "Superintendent",
    "Estimator",
    "Coordinator",
    "Analyst",
    "Assistant",
];

const DEFAULT_EMPLOYEES = [
    {
        id: 1,
        name: "Justin J. Waterman, PE",
        email: "info@watermanconsultingservices.com",
        phone: "+1 (832) 405-5028",
        cell: "+1 (832) 377-1419",
        title: "Principal Executive, WCS Enterprise Suite\u2122",
        title2: "PMP, LEED AP BD+C, Google Antigravity Ai Pilot, SaaS DevOps",
        department: "Executive Leadership",
        role: "Owner / Principal",
        status: "active",
        signatureTemplate: "master",
        logoUrl: "https://static.wixstatic.com/media/7f7b7e_0a344c34678f4ef9ab0892557b4eef82~mv2.gif",
    },
];

const MASTER_TEMPLATE = {
    company: "Waterman Consulting Services",
    tagline: "Built on the Rock. Engineered for the Future.",
    accentColor: "#dcc49b",
    barColor: "#dcc49b",
    nameColor: "#f7f7f7",
    titleColor: "#dcc49b",
    bodyColor: "#cbd5e1",
    bgColor: "#081e3b",
    logoUrl: "https://static.wixstatic.com/media/7f7b7e_0a344c34678f4ef9ab0892557b4eef82~mv2.gif",
    website: "watermanconsultingservices.com",
    location: "Houston, TX 77070",
};

export default function AdminPortal({ onBack }) {
    const [activeTab, setActiveTab] = useState("employees");
    const [employees, setEmployees] = useState(DEFAULT_EMPLOYEES);
    const [masterTemplate, setMasterTemplate] = useState(MASTER_TEMPLATE);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [newEmployee, setNewEmployee] = useState({
        name: "", email: "", phone: "", title: "", title2: "",
        department: DEPARTMENTS[0], role: ROLES[4], status: "active",
        signatureTemplate: "master", logoUrl: "",
    });

    const [hoveredPanel, setHoveredPanel] = useState(null);

    // Department card color variety
    const DEPT_COLORS = [
        "#dcc49b", "#60a5fa", "#a855f7", "#22c55e", "#f97316",
        "#ec4899", "#06b6d4", "#eab308", "#6366f1", "#14b8a6",
        "#f43f5e", "#84cc16",
    ];

    const updateMaster = (key, val) => setMasterTemplate(p => ({ ...p, [key]: val }));
    const addEmployee = () => {
        setEmployees(p => [...p, { ...newEmployee, id: Date.now() }]);
        setNewEmployee({ name: "", email: "", phone: "", title: "", title2: "", department: DEPARTMENTS[0], role: ROLES[4], status: "active", signatureTemplate: "master", logoUrl: "" });
        setShowAddModal(false);
    };
    const removeEmployee = (id) => setEmployees(p => p.filter(e => e.id !== id));
    const updateEmployee = (id, key, val) => setEmployees(p => p.map(e => e.id === id ? { ...e, [key]: val } : e));

    const [hoveredTab, setHoveredTab] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [hoveredDept, setHoveredDept] = useState(null);

    const TABS = [
        { key: "employees", label: "EMPLOYEES", Icon: Users },
        { key: "templates", label: "MASTER TEMPLATE", Icon: Settings },
        { key: "departments", label: "DEPARTMENTS", Icon: Layers },
        { key: "deploy", label: "DEPLOY", Icon: Send },
    ];

    const sheenStyle = {
        background: "linear-gradient(135deg, #f7f7f7 0%, #dcc49b 40%, #f3e3ad 60%, #f7f7f7 100%)",
        backgroundSize: "200% 200%",
        backgroundClip: "text", WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: "sheenSweep 4s ease-in-out infinite",
    };

    return (
        <div style={{ position: "fixed", inset: 0, fontFamily: "'Space Grotesk','Inter',sans-serif", color: "#f7f7f7", background: "#000000", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* ═══ BACKGROUND ═══ */}
            <CosmicBackground showCinematic={true} />

            {/* ═══ FOREGROUND CONTENT ═══ */}
            <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

            {/* ═══ NAV ═══ */}
            <nav style={{
                flexShrink: 0,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "8px 32px",
                background: "rgba(8,22,59,0.92)",
                backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
                borderBottom: "1px solid rgba(220,196,155,0.25)",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {/* Animated logo */}
                    <div style={{ animation: "logoGlow 3s ease-in-out infinite", borderRadius: "8px" }}>
                        <img src="/vivid-signature-logo.png"
                            alt="Vivid Signature Logo"
                            style={{ height: "34px", width: "auto", display: "block", animation: "logoFloat 4s ease-in-out infinite", filter: "drop-shadow(0 0 6px rgba(220,196,155,0.45))" }} />
                    </div>
                    <span style={{ fontSize: "17px", fontWeight: 900, letterSpacing: "0.1em",
                        fontFamily: "'Rajdhani', sans-serif", textTransform: "uppercase", ...sheenStyle }}>
                        Vivid Signature Pro™
                    </span>
                    {/* Pill badges removed — not visible on current origin */}
                </div>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <button onClick={onBack} style={{
                        padding: "8px 20px", borderRadius: "8px", border: "1px solid rgba(220,196,155,0.4)",
                        background: "linear-gradient(135deg, rgba(220,196,155,0.15), rgba(220,196,155,0.05))",
                        backdropFilter: "blur(12px)", color: "#dcc49b", fontWeight: 700, fontSize: "12px",
                        cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase",
                        transition: "all 0.3s ease",
                    }}>← Back</button>
                </div>
            </nav>

            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 1, maxWidth: "1300px", width: "100%", margin: "0 auto", padding: "32px 24px" }}>
                {/* ── HEADER ── */}
                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                    <h1 style={{
                        fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900,
                        fontFamily: "'Orbitron', sans-serif",
                        letterSpacing: "0.04em", marginBottom: "12px",
                        ...sheenStyle,
                    }}>Signature Administration</h1>
                    <div style={{ display: "inline-block", padding: "6px 20px", borderRadius: "100px", background: "rgba(220,196,155,0.1)", border: "1px solid rgba(220,196,155,0.3)", color: "#dcc49b", fontSize: "13px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        Manage employee signatures, set organization-wide templates, and deploy unified brand identity
                    </div>
                </div>

                {/* ── TAB BAR ── */}
                <div style={{
                    display: "flex", gap: "4px", marginBottom: "32px",
                    background: "rgba(5,20,41,0.6)",
                    borderRadius: "12px", padding: "4px",
                    border: "1px solid rgba(220,196,155,0.1)",
                }}>
                    {TABS.map(t => {
                        const isActive = activeTab === t.key;
                        const isHovered = hoveredTab === t.key;
                        return (
                            <button
                                key={t.key}
                                onClick={() => setActiveTab(t.key)}
                                onMouseEnter={() => setHoveredTab(t.key)}
                                onMouseLeave={() => setHoveredTab(null)}
                                style={{
                                    flex: 1, padding: "12px 16px", borderRadius: "8px", border: "none",
                                    background: isActive
                                        ? "linear-gradient(135deg, rgba(220,196,155,0.22), rgba(220,196,155,0.10))"
                                        : isHovered
                                            ? "rgba(220,196,155,0.07)"
                                            : "transparent",
                                    color: isActive ? "#dcc49b" : isHovered ? "rgba(220,196,155,0.75)" : "rgba(247,247,247,0.4)",
                                    fontWeight: 700, fontSize: "11px", cursor: "pointer",
                                    letterSpacing: "0.1em", textTransform: "uppercase",
                                    transition: "all 0.3s ease",
                                    borderBottom: isActive ? "2px solid #dcc49b" : "2px solid transparent",
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
                                    boxShadow: isActive ? "0 2px 16px rgba(220,196,155,0.08)" : "none",
                                }}
                            >
                                <t.Icon size={14} style={{ flexShrink: 0, color: isActive ? "#dcc49b" : isHovered ? "rgba(220,196,155,0.75)" : "rgba(247,247,247,0.4)", transition: "color 0.3s ease", animation: isActive ? "iconPulse 2s ease-in-out infinite" : "none", filter: isActive ? "drop-shadow(0 0 4px rgba(220,196,155,0.6))" : "none" }} />
                                {t.label}
                            </button>
                        );
                    })}
                </div>

                {/* ══════════════════════ EMPLOYEES TAB ══════════════════════ */}
                {activeTab === "employees" && (
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                            <div>
                                <span style={{ fontSize: "20px", fontWeight: 800, fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                                    Manage Employee Signatures
                                </span>
                                <span style={{
                                    marginLeft: "12px", fontSize: "10px", padding: "3px 10px", borderRadius: "999px",
                                    background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)",
                                    color: "#22c55e", fontWeight: 700,
                                    display: "inline-flex", alignItems: "center", gap: "5px",
                                }}>
                                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 6px rgba(34,197,94,0.6)", animation: "iconPulse 2s ease-in-out infinite" }} />
                                    {employees.filter(e => e.status === "active").length} ACTIVE
                                </span>
                            </div>
                            <button onClick={() => setShowAddModal(true)} style={{
                                padding: "10px 24px", borderRadius: "8px", border: "none",
                                background: "linear-gradient(135deg, #dcc49b, #b8965a)",
                                color: "#081e3b", fontWeight: 800, fontSize: "12px", cursor: "pointer",
                                letterSpacing: "0.08em", textTransform: "uppercase",
                                boxShadow: "0 4px 20px rgba(220,196,155,0.2)",
                            }}>+ Add Employee</button>
                        </div>

                        {/* Employee Cards */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "16px" }}>
                            {employees.map(emp => (
                                <div
                                    key={emp.id}
                                    className="motion-border-gold"
                                    onMouseEnter={() => setHoveredCard(emp.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    style={{
                                        borderRadius: "16px", padding: "24px", border: hoveredCard === emp.id ? "1px solid rgba(220,196,155,0.4)" : "1px solid rgba(220,196,155,0.08)",
                                        background: hoveredCard === emp.id ? "rgba(220,196,155,0.06)" : "rgba(5,20,41,0.7)",
                                        backdropFilter: "blur(20px)",
                                        transition: "all 0.3s ease",
                                        transform: hoveredCard === emp.id ? "scale(1.015)" : "scale(1)",
                                        boxShadow: hoveredCard === emp.id ? "0 8px 32px rgba(220,196,155,0.12)" : "none",
                                        position: "relative", overflow: "hidden",
                                    }}>
                                    <div style={{ display: "flex", gap: "14px", marginBottom: "14px" }}>
                                        {/* Avatar */}
                                        <div style={{
                                            width: "52px", height: "52px", borderRadius: "50%",
                                            background: emp.logoUrl
                                                ? `url(${emp.logoUrl}) center/cover`
                                                : "linear-gradient(135deg, #081e3b, #0f172a)",
                                            border: "2px solid rgba(220,196,155,0.3)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            flexShrink: 0,
                                        }}>
                                            {!emp.logoUrl && <span style={{ color: "#dcc49b", fontSize: "16px", fontWeight: 900 }}>
                                                {emp.name.split(" ").map(n => n[0]).join("")}
                                            </span>}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: "16px", fontWeight: 700, color: "#f7f7f7" }}>{emp.name}</div>
                                            <div style={{ fontSize: "11px", color: "#dcc49b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{emp.title}</div>
                                            {emp.title2 && <div style={{ fontSize: "11px", color: "rgba(247,247,247,0.4)" }}>{emp.title2}</div>}
                                        </div>
                                        {/* Status Badge */}
                                        <div style={{
                                            height: "fit-content",
                                            padding: "3px 10px", borderRadius: "999px", fontSize: "9px", fontWeight: 700,
                                            background: emp.status === "active" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                                            border: `1px solid ${emp.status === "active" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                                            color: emp.status === "active" ? "#22c55e" : "#ef4444",
                                            letterSpacing: "0.1em", textTransform: "uppercase",
                                        }}>{emp.status}</div>
                                    </div>

                                    {/* Details */}
                                    <div style={{ fontSize: "12px", color: "rgba(247,247,247,0.5)", lineHeight: 2 }}>
                                        <div>📧 {emp.email}</div>
                                        {emp.phone && <div>📞 {emp.phone}</div>}
                                        <div>🏢 {emp.department}</div>
                                        <div>👤 {emp.role}</div>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: "flex", gap: "8px", marginTop: "14px", borderTop: "1px solid rgba(220,196,155,0.08)", paddingTop: "14px" }}>
                                        <select
                                            value={emp.signatureTemplate}
                                            onChange={(e) => updateEmployee(emp.id, "signatureTemplate", e.target.value)}
                                            style={{
                                                flex: 1, padding: "8px 10px", borderRadius: "6px", fontSize: "11px",
                                                background: "#051429", border: "1px solid rgba(220,196,155,0.15)",
                                                color: "#dcc49b", fontWeight: 600,
                                            }}
                                        >
                                            <option value="master">Master Template</option>
                                            <option value="department">Department Template</option>
                                            <option value="custom">Custom Signature</option>
                                        </select>
                                        <button onClick={() => setEditingEmployee(emp.id === editingEmployee ? null : emp.id)} style={{
                                            padding: "8px 14px", borderRadius: "6px", fontSize: "11px",
                                            background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)",
                                            color: "#60a5fa", fontWeight: 700, cursor: "pointer", letterSpacing: "0.05em",
                                        }}>✏ Edit</button>
                                        {emp.id !== 1 && (
                                            <button onClick={() => removeEmployee(emp.id)} style={{
                                                padding: "8px 14px", borderRadius: "6px", fontSize: "11px",
                                                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                                                color: "#ef4444", fontWeight: 700, cursor: "pointer",
                                            }}>✕</button>
                                        )}
                                    </div>

                                    {/* Edit Panel */}
                                    {editingEmployee === emp.id && (
                                        <div style={{ marginTop: "14px", padding: "14px", borderRadius: "8px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(220,196,155,0.08)" }}>
                                            <div style={{ fontSize: "10px", fontWeight: 700, color: "#dcc49b", letterSpacing: "0.1em", marginBottom: "10px", textTransform: "uppercase" }}>EDIT EMPLOYEE</div>
                                            {["name", "email", "phone", "title", "title2"].map(field => (
                                                <input key={field} placeholder={field.toUpperCase()} value={emp[field]}
                                                    onChange={e => updateEmployee(emp.id, field, e.target.value)}
                                                    style={{
                                                        width: "100%", padding: "8px 10px", borderRadius: "6px", fontSize: "12px",
                                                        background: "#051429", border: "1px solid rgba(220,196,155,0.1)",
                                                        color: "#f7f7f7", marginBottom: "6px", fontFamily: "inherit",
                                                    }}
                                                />
                                            ))}
                                            <div style={{ display: "flex", gap: "6px" }}>
                                                <select value={emp.department} onChange={e => updateEmployee(emp.id, "department", e.target.value)}
                                                    style={{ flex: 1, padding: "8px", borderRadius: "6px", fontSize: "11px", background: "#051429", border: "1px solid rgba(220,196,155,0.1)", color: "#f7f7f7" }}>
                                                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                                </select>
                                                <select value={emp.role} onChange={e => updateEmployee(emp.id, "role", e.target.value)}
                                                    style={{ flex: 1, padding: "8px", borderRadius: "6px", fontSize: "11px", background: "#051429", border: "1px solid rgba(220,196,155,0.1)", color: "#f7f7f7" }}>
                                                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* ── ADD EMPLOYEE MODAL ── */}
                        {showAddModal && (
                            <div style={{
                                position: "fixed", inset: 0, zIndex: 1000,
                                background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                <div style={{
                                    width: "460px", maxWidth: "90%", borderRadius: "16px", padding: "32px",
                                    background: "rgba(5,20,41,0.95)", border: "1px solid rgba(220,196,155,0.15)",
                                    backdropFilter: "blur(24px)",
                                }}>
                                    <div style={{
                                        fontSize: "18px", fontWeight: 800, marginBottom: "24px",
                                        fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase",
                                        ...sheenStyle,
                                    }}>Onboard New Employee</div>

                                    {["name", "email", "phone", "title", "title2"].map(field => (
                                        <div key={field} style={{ marginBottom: "10px" }}>
                                            <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: "#dcc49b", letterSpacing: "0.1em", marginBottom: "4px", textTransform: "uppercase" }}>{field.replace("title2", "Sub-Title")}</label>
                                            <input
                                                value={newEmployee[field]}
                                                onChange={e => setNewEmployee(p => ({ ...p, [field]: e.target.value }))}
                                                placeholder={`Enter ${field}`}
                                                style={{
                                                    width: "100%", padding: "10px 14px", borderRadius: "8px", fontSize: "13px",
                                                    background: "#051429", border: "1px solid rgba(220,196,155,0.15)",
                                                    color: "#f7f7f7", fontFamily: "inherit",
                                                }}
                                            />
                                        </div>
                                    ))}

                                    <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: "#dcc49b", letterSpacing: "0.1em", marginBottom: "4px", textTransform: "uppercase" }}>Department</label>
                                            <select value={newEmployee.department} onChange={e => setNewEmployee(p => ({ ...p, department: e.target.value }))}
                                                style={{ width: "100%", padding: "10px", borderRadius: "8px", fontSize: "12px", background: "#051429", border: "1px solid rgba(220,196,155,0.15)", color: "#f7f7f7" }}>
                                                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: "#dcc49b", letterSpacing: "0.1em", marginBottom: "4px", textTransform: "uppercase" }}>Role</label>
                                            <select value={newEmployee.role} onChange={e => setNewEmployee(p => ({ ...p, role: e.target.value }))}
                                                style={{ width: "100%", padding: "10px", borderRadius: "8px", fontSize: "12px", background: "#051429", border: "1px solid rgba(220,196,155,0.15)", color: "#f7f7f7" }}>
                                                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: "20px" }}>
                                        <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: "#dcc49b", letterSpacing: "0.1em", marginBottom: "4px", textTransform: "uppercase" }}>Profile Photo URL</label>
                                        <input
                                            value={newEmployee.logoUrl}
                                            onChange={e => setNewEmployee(p => ({ ...p, logoUrl: e.target.value }))}
                                            placeholder="https://..."
                                            style={{
                                                width: "100%", padding: "10px 14px", borderRadius: "8px", fontSize: "13px",
                                                background: "#051429", border: "1px solid rgba(220,196,155,0.15)",
                                                color: "#f7f7f7", fontFamily: "inherit",
                                            }}
                                        />
                                    </div>

                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <button onClick={() => setShowAddModal(false)} style={{
                                            flex: 1, padding: "12px", borderRadius: "8px",
                                            border: "1px solid rgba(220,196,155,0.2)", background: "transparent",
                                            color: "#dcc49b", fontWeight: 700, fontSize: "12px", cursor: "pointer",
                                            letterSpacing: "0.08em", textTransform: "uppercase",
                                        }}>Cancel</button>
                                        <button onClick={addEmployee} disabled={!newEmployee.name || !newEmployee.email} style={{
                                            flex: 1, padding: "12px", borderRadius: "8px", border: "none",
                                            background: newEmployee.name && newEmployee.email
                                                ? "linear-gradient(135deg, #dcc49b, #b8965a)"
                                                : "rgba(220,196,155,0.15)",
                                            color: newEmployee.name && newEmployee.email ? "#081e3b" : "rgba(220,196,155,0.4)",
                                            fontWeight: 800, fontSize: "12px", cursor: newEmployee.name ? "pointer" : "not-allowed",
                                            letterSpacing: "0.08em", textTransform: "uppercase",
                                        }}>Add Employee</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ══════════════════════ MASTER TEMPLATE TAB ══════════════════════ */}
                {activeTab === "templates" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px", paddingBottom: "40px" }}>
                        {/* Settings Panel */}
                        <div className="motion-border-gold"
                            onMouseEnter={() => setHoveredPanel("settings")}
                            onMouseLeave={() => setHoveredPanel(null)}
                            style={{
                            borderRadius: "16px", padding: "28px",
                            background: "rgba(5,20,41,0.7)", backdropFilter: "blur(20px)",
                            border: "none", transition: "all 0.4s ease",
                            transform: hoveredPanel === "settings" ? "translateY(-4px) scale(1.01)" : "none",
                            boxShadow: hoveredPanel === "settings" ? "0 16px 48px rgba(220,196,155,0.15), 0 0 24px rgba(220,196,155,0.08)" : "none",
                        }}>
                            <div style={{
                                fontSize: "18px", fontWeight: 800, marginBottom: "24px",
                                fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase",
                                ...sheenStyle,
                            }}>Organization Defaults</div>

                            {[
                                { key: "company", label: "Company Name" },
                                { key: "website", label: "Website" },
                                { key: "location", label: "Location" },
                                { key: "tagline", label: "Tagline / Motto" },
                                { key: "logoUrl", label: "Company Logo URL" },
                            ].map(({ key, label }) => (
                                <div key={key} style={{ marginBottom: "14px" }}>
                                    <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: "#dcc49b", letterSpacing: "0.1em", marginBottom: "4px", textTransform: "uppercase" }}>{label}</label>
                                    <input
                                        value={masterTemplate[key]}
                                        onChange={e => updateMaster(key, e.target.value)}
                                        style={{
                                            width: "100%", padding: "10px 14px", borderRadius: "8px", fontSize: "13px",
                                            background: "#051429", border: "1px solid rgba(220,196,155,0.15)",
                                            color: "#f7f7f7", fontFamily: "inherit",
                                        }}
                                    />
                                </div>
                            ))}

                            <div style={{ fontSize: "10px", fontWeight: 700, color: "#dcc49b", letterSpacing: "0.1em", marginTop: "20px", marginBottom: "10px", textTransform: "uppercase" }}>Brand Colors</div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                {[
                                    { key: "accentColor", label: "Accent" },
                                    { key: "barColor", label: "Bar" },
                                    { key: "nameColor", label: "Name" },
                                    { key: "titleColor", label: "Title" },
                                    { key: "bodyColor", label: "Body" },
                                    { key: "bgColor", label: "Background" },
                                ].map(({ key, label }) => (
                                    <div key={key} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <input type="color" value={masterTemplate[key]}
                                            onChange={e => updateMaster(key, e.target.value)}
                                            style={{ width: "28px", height: "28px", border: "none", borderRadius: "4px", cursor: "pointer" }}
                                        />
                                        <span style={{ fontSize: "11px", color: "rgba(247,247,247,0.5)", fontWeight: 600 }}>{label}</span>
                                        <span style={{ fontSize: "10px", color: "rgba(247,247,247,0.3)", fontFamily: "monospace" }}>{masterTemplate[key]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Preview Panel */}
                        <div className="motion-border-blue"
                            onMouseEnter={() => setHoveredPanel("preview")}
                            onMouseLeave={() => setHoveredPanel(null)}
                            style={{
                            borderRadius: "16px", padding: "28px",
                            background: "rgba(5,20,41,0.7)", backdropFilter: "blur(20px)",
                            border: "none", transition: "all 0.4s ease",
                            transform: hoveredPanel === "preview" ? "translateY(-4px) scale(1.01)" : "none",
                            boxShadow: hoveredPanel === "preview" ? "0 16px 48px rgba(96,165,250,0.15), 0 0 24px rgba(96,165,250,0.08)" : "none",
                        }}>
                            <div style={{
                                fontSize: "18px", fontWeight: 800, marginBottom: "24px",
                                fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase",
                                ...sheenStyle,
                            }}>Live Preview</div>

                            {/* Mini Signature Preview */}
                            <div style={{
                                padding: "20px",
                                background: masterTemplate.bgColor,
                                borderRadius: "12px",
                                border: `2px solid ${masterTemplate.barColor}`,
                            }}>
                                <div style={{ display: "flex", gap: "14px" }}>
                                    {masterTemplate.logoUrl && (
                                        <div style={{
                                            width: "60px", height: "60px", borderRadius: "50%",
                                            background: `url(${masterTemplate.logoUrl}) center/cover`,
                                            border: `2px solid ${masterTemplate.accentColor}40`,
                                            flexShrink: 0,
                                        }} />
                                    )}
                                    <div>
                                        <div style={{ fontSize: "16px", fontWeight: 700, color: masterTemplate.nameColor }}>John Doe</div>
                                        <div style={{ fontSize: "11px", color: masterTemplate.titleColor, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Project Manager</div>
                                        <div style={{ fontSize: "11px", color: masterTemplate.bodyColor, marginTop: "6px", lineHeight: 1.8 }}>
                                            📞 +1 (832) 555-0100<br />
                                            📧 jdoe@{masterTemplate.website}
                                        </div>
                                    </div>
                                </div>
                                {masterTemplate.tagline && (
                                    <div style={{
                                        fontSize: "10px", color: masterTemplate.bodyColor,
                                        marginTop: "12px", paddingTop: "8px",
                                        borderTop: `1px solid ${masterTemplate.barColor}40`,
                                        fontStyle: "italic", opacity: 0.7,
                                    }}>{masterTemplate.tagline}</div>
                                )}
                            </div>

                            <p style={{ fontSize: "11px", color: "rgba(247,247,247,0.3)", marginTop: "14px", textAlign: "center" }}>
                                This preview shows how employee signatures will appear using the master template.
                            </p>
                        </div>
                    </div>
                )}

                {/* ══════════════════════ DEPARTMENTS TAB ══════════════════════ */}
                {activeTab === "departments" && (
                    <div style={{ paddingBottom: "40px" }}>
                        <div style={{ marginBottom: "20px" }}>
                            <span style={{ fontSize: "20px", fontWeight: 800, fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                                Department Signature Overrides
                            </span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
                            {DEPARTMENTS.map((dept, i) => {
                                const deptEmployees = employees.filter(e => e.department === dept);
                                const colors = ["#dcc49b", "#3b82f6", "#a855f7", "#22c55e", "#2dd4bf", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#dcc49b"];
                                const color = colors[i % colors.length];
                                const borderClasses = ["motion-border-gold", "motion-border-blue", "motion-border-purple", "motion-border-green", "motion-border-teal", "motion-border-violet", "motion-border-cyan", "motion-border-emerald", "motion-border-gold", "motion-border-gold"];
                                const isDeptHovered = hoveredDept === dept;
                                return (
                                    <div
                                        key={dept}
                                        className={borderClasses[i % borderClasses.length]}
                                        onMouseEnter={() => setHoveredDept(dept)}
                                        onMouseLeave={() => setHoveredDept(null)}
                                        style={{
                                            borderRadius: "16px", padding: "24px",
                                            border: isDeptHovered ? `1px solid ${color}66` : "1px solid transparent",
                                            background: isDeptHovered ? `${color}0D` : "rgba(5,20,41,0.7)",
                                            backdropFilter: "blur(20px)",
                                            transition: "all 0.4s ease",
                                            transform: isDeptHovered ? "translateY(-3px) scale(1.02)" : "none",
                                            boxShadow: isDeptHovered ? `0 12px 36px ${color}20, 0 0 16px ${color}10` : "none",
                                            position: "relative", overflow: "hidden",
                                        }}
                                    >
                                        <div style={{
                                            padding: "12px", background: "#051429", borderRadius: "12px",
                                            border: `1px solid ${color}33`, display: "inline-flex",
                                            marginBottom: "14px",
                                            transition: "all 0.3s ease",
                                            transform: isDeptHovered ? "scale(1.1) rotate(12deg)" : "none",
                                            boxShadow: isDeptHovered ? `0 0 16px ${color}25` : "none",
                                        }}>
                                            <span style={{ fontSize: "22px", filter: `drop-shadow(0 0 ${isDeptHovered ? "8px" : "4px"} ${color}66)`, transition: "filter 0.3s ease" }}>🏢</span>
                                        </div>
                                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#f7f7f7", marginBottom: "4px", fontFamily: "'Rajdhani', sans-serif", textTransform: "uppercase", letterSpacing: "0.04em" }}>{dept}</div>
                                        <div style={{ fontSize: "11px", color: "rgba(247,247,247,0.4)", marginBottom: "12px" }}>
                                            {deptEmployees.length} member{deptEmployees.length !== 1 ? "s" : ""}
                                        </div>
                                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                            {deptEmployees.map(e => (
                                                <span key={e.id} style={{
                                                    fontSize: "10px", padding: "3px 8px", borderRadius: "999px",
                                                    background: `${color}15`, border: `1px solid ${color}30`,
                                                    color: color, fontWeight: 600,
                                                }}>{e.name.split(" ")[0]}</span>
                                            ))}
                                            {deptEmployees.length === 0 && (
                                                <span style={{ fontSize: "10px", color: "rgba(247,247,247,0.2)" }}>No members assigned</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ══════════════════════ DEPLOY TAB ══════════════════════ */}
                {activeTab === "deploy" && (
                    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
                        <div className="motion-border-gold" style={{
                            borderRadius: "16px", padding: "40px", textAlign: "center",
                            background: "rgba(5,20,41,0.7)", backdropFilter: "blur(20px)",
                            border: "none",
                        }}>
                            <div style={{ fontSize: "48px", marginBottom: "16px", animation: "rocketMotion 3s ease-in-out infinite", filter: "drop-shadow(0 0 8px rgba(220,196,155,0.6))" }}>🚀</div>
                            <h2 style={{
                                fontSize: "28px", fontWeight: 900, marginBottom: "12px",
                                fontFamily: "'Rajdhani', sans-serif", textTransform: "uppercase",
                                ...sheenStyle,
                            }}>Deploy Signatures</h2>
                            <p style={{ fontSize: "14px", color: "rgba(247,247,247,0.45)", marginBottom: "32px", maxWidth: "440px", margin: "0 auto 32px" }}>
                                Generate and deploy signatures for all team members using the master template and department overrides.
                            </p>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", maxWidth: "400px", margin: "0 auto 24px" }}>
                                <div
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px) scale(1.04)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(220,196,155,0.15)"; e.currentTarget.style.borderColor = "rgba(220,196,155,0.4)"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "rgba(220,196,155,0.15)"; }}
                                    style={{
                                    padding: "16px", borderRadius: "10px",
                                    background: "rgba(220,196,155,0.06)", border: "1px solid rgba(220,196,155,0.15)",
                                    transition: "all 0.3s ease", cursor: "default",
                                }}>
                                    <div style={{ padding: "8px", background: "#051429", borderRadius: "10px", border: "1px solid rgba(220,196,155,0.2)", display: "inline-flex", marginBottom: "8px", animation: "iconRotatePull 3s ease-in-out infinite" }}>
                                        <span style={{ fontSize: "20px", filter: "drop-shadow(0 0 6px rgba(220,196,155,0.5))" }}>👥</span>
                                    </div>
                                    <div style={{ fontSize: "28px", fontWeight: 900, color: "#dcc49b" }}>{employees.length}</div>
                                    <div style={{ fontSize: "10px", color: "rgba(247,247,247,0.4)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Team Members</div>
                                </div>
                                <div
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px) scale(1.04)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(34,197,94,0.15)"; e.currentTarget.style.borderColor = "rgba(34,197,94,0.4)"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "rgba(34,197,94,0.15)"; }}
                                    style={{
                                    padding: "16px", borderRadius: "10px",
                                    background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)",
                                    transition: "all 0.3s ease", cursor: "default",
                                }}>
                                    <div style={{ padding: "8px", background: "#051429", borderRadius: "10px", border: "1px solid rgba(34,197,94,0.2)", display: "inline-flex", marginBottom: "8px", animation: "iconRotatePull 3s ease-in-out infinite", animationDelay: "0.5s" }}>
                                        <span style={{ fontSize: "20px", filter: "drop-shadow(0 0 6px rgba(34,197,94,0.5))" }}>✅</span>
                                    </div>
                                    <div style={{ fontSize: "28px", fontWeight: 900, color: "#22c55e" }}>{employees.filter(e => e.status === "active").length}</div>
                                    <div style={{ fontSize: "10px", color: "rgba(247,247,247,0.4)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Active</div>
                                </div>
                            </div>

                            <button
                                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px) scale(1.04)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(220,196,155,0.4), 0 0 20px rgba(220,196,155,0.15)"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(220,196,155,0.25)"; }}
                                style={{
                                padding: "16px 44px", borderRadius: "12px", border: "none",
                                background: "linear-gradient(135deg, #dcc49b, #b8965a)",
                                color: "#081e3b", fontWeight: 800, fontSize: "14px", cursor: "pointer",
                                letterSpacing: "0.08em", textTransform: "uppercase",
                                boxShadow: "0 8px 32px rgba(220,196,155,0.25)",
                                marginBottom: "16px", transition: "all 0.3s ease",
                            }}>Generate All Signatures</button>

                            <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                                <button
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px) scale(1.05)"; e.currentTarget.style.boxShadow = "0 0 16px rgba(96,165,250,0.3)"; e.currentTarget.style.borderColor = "rgba(96,165,250,0.6)"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "rgba(96,165,250,0.3)"; }}
                                    style={{
                                    padding: "10px 20px", borderRadius: "8px",
                                    border: "1px solid rgba(96,165,250,0.3)",
                                    background: "rgba(96,165,250,0.08)",
                                    color: "#60a5fa", fontWeight: 700, fontSize: "11px", cursor: "pointer",
                                    letterSpacing: "0.06em", textTransform: "uppercase", transition: "all 0.3s ease",
                                }}>📧 Inject All Gmail</button>
                                <button
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px) scale(1.05)"; e.currentTarget.style.boxShadow = "0 0 16px rgba(168,85,247,0.3)"; e.currentTarget.style.borderColor = "rgba(168,85,247,0.6)"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "rgba(168,85,247,0.3)"; }}
                                    style={{
                                    padding: "10px 20px", borderRadius: "8px",
                                    border: "1px solid rgba(168,85,247,0.3)",
                                    background: "rgba(168,85,247,0.08)",
                                    color: "#a855f7", fontWeight: 700, fontSize: "11px", cursor: "pointer",
                                    letterSpacing: "0.06em", textTransform: "uppercase", transition: "all 0.3s ease",
                                }}>📨 Inject All Outlook</button>
                                <button
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px) scale(1.05)"; e.currentTarget.style.boxShadow = "0 0 16px rgba(34,197,94,0.3)"; e.currentTarget.style.borderColor = "rgba(34,197,94,0.6)"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "rgba(34,197,94,0.3)"; }}
                                    style={{
                                    padding: "10px 20px", borderRadius: "8px",
                                    border: "1px solid rgba(34,197,94,0.3)",
                                    background: "rgba(34,197,94,0.08)",
                                    color: "#22c55e", fontWeight: 700, fontSize: "11px", cursor: "pointer",
                                    letterSpacing: "0.06em", textTransform: "uppercase", transition: "all 0.3s ease",
                                }}>📋 Export All HTML</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            </div>{/* end scrollable content */}

            {/* ═══ FOOTER ═══ */}
            <footer style={{
                flexShrink: 0,
                padding: "20px", textAlign: "center",
                borderTop: "1px solid rgba(220,196,155,0.2)",
                color: "rgba(247,247,247,0.7)", fontSize: "12px",
                background: "rgba(4,12,24,0.98)",
            }}>
                <div style={{ marginBottom: "6px" }}>
                    <span style={{ color: "#dcc49b", fontWeight: 700 }}>Vivid Signature Pro™</span>{" "}
                    | A ForgedOps.AI™ Product
                </div>
                <div>© 2026 Waterman Consulting Services. All Rights Reserved. | Built on the Rock. Engineered for the Future.</div>
            </footer>

            {/* Inline keyframes */}
            <style>{`
        @keyframes sheenSweep {
          0% { background-position: 200% 200%; }
          50% { background-position: 0% 0%; }
          100% { background-position: 200% 200%; }
        }
        @keyframes logoGlow {
          0%, 100% { filter: drop-shadow(0 0 4px rgba(220,196,155,0.2)); }
          50% { filter: drop-shadow(0 0 14px rgba(220,196,155,0.7)) drop-shadow(0 0 28px rgba(220,196,155,0.3)); }
        }
        @keyframes aegisGlow {
          0%, 100% { box-shadow: 0 0 0px rgba(139,92,246,0); border-color: rgba(139,92,246,0.3); }
          50% { box-shadow: 0 0 8px rgba(139,92,246,0.4); border-color: rgba(139,92,246,0.7); }
        }
        @keyframes iconPulse {
          0%, 100% { filter: drop-shadow(0 0 2px rgba(220,196,155,0.3)); }
          50% { filter: drop-shadow(0 0 6px rgba(220,196,155,0.8)); }
        }
        @keyframes rocketMotion {
          0%, 100% { transform: translateY(0px) rotate(-12deg) scale(1); }
          25% { transform: translateY(-6px) rotate(-8deg) scale(1.08); }
          50% { transform: translateY(-2px) rotate(-15deg) scale(1.04); }
          75% { transform: translateY(-8px) rotate(-5deg) scale(1.1); }
        }
        @keyframes iconRotatePull {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.06) rotate(6deg); }
          50% { transform: scale(1.02) rotate(-3deg); }
          75% { transform: scale(1.08) rotate(8deg); }
        }
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-3px) scale(1.04); }
        }
        @keyframes pillGlowGold {
          0%, 100% { box-shadow: 0 0 0px rgba(220,196,155,0); border-color: rgba(220,196,155,0.25); }
          50% { box-shadow: 0 0 7px rgba(220,196,155,0.45); border-color: rgba(220,196,155,0.65); }
        }
        @keyframes pillGlowGreen {
          0%, 100% { box-shadow: 0 0 0px rgba(34,197,94,0); border-color: rgba(34,197,94,0.25); }
          50% { box-shadow: 0 0 7px rgba(34,197,94,0.4); border-color: rgba(34,197,94,0.6); }
        }
      `}</style>
        </div>
        </div>
    );
}


