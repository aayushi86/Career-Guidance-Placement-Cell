import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaTimes, FaChevronDown, FaCheck, FaBriefcase, FaLayerGroup } from "react-icons/fa";
import { request } from "../../services/api";

/**
 * CareerRoleSelector - Reusable searchable multi-domain & role selector.
 * Used in CareerTest, SkillGap, CareerRoadmap, and ResumeAnalyzer.
 */
export default function CareerRoleSelector({
  selectedDomain = "",
  onSelectDomain,
  selectedRole = "",
  onSelectRole,
  disabled = false,
  className = "",
  showDomainSelect = true,
  labelRole = "Target Career Role",
  labelDomain = "Career Domain",
  placeholderRole = "Search or select career role...",
}) {
  const [domains, setDomains] = useState([]);
  const [rolesByDomain, setRolesByDomain] = useState({});
  const [allRoles, setAllRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [roleQuery, setRoleQuery] = useState(selectedRole);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Synchronize internal search query when prop changes externally
  useEffect(() => {
    setRoleQuery(selectedRole);
  }, [selectedRole]);

  // Fetch centralized domains & roles from backend API
  useEffect(() => {
    let isMounted = true;
    const fetchDomainsData = async () => {
      try {
        const data = await request("/career/domains");
        if (isMounted && data?.success) {
          setDomains(data.domains || []);
          setRolesByDomain(data.rolesByDomain || {});
          setAllRoles(data.roles || []);
        }
      } catch (err) {
        console.warn("Failed to load centralized career domains API:", err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchDomainsData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle click outside dropdown to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get available suggestions based on selected domain and search query
  const getSuggestions = () => {
    let pool = [];
    if (selectedDomain && rolesByDomain[selectedDomain]) {
      pool = rolesByDomain[selectedDomain];
    } else {
      pool = allRoles;
    }

    if (!roleQuery || !roleQuery.trim()) {
      return pool;
    }

    const q = roleQuery.toLowerCase().trim();
    return pool.filter((role) => role.toLowerCase().includes(q));
  };

  const handleDomainChange = (e) => {
    const newDomain = e.target.value;
    if (onSelectDomain) {
      onSelectDomain(newDomain);
    }
  };

  const handleRoleInputChange = (e) => {
    const val = e.target.value;
    setRoleQuery(val);
    setIsDropdownOpen(true);
    if (onSelectRole) {
      onSelectRole(val, selectedDomain);
    }
  };

  const handleSelectSuggestion = (role) => {
    setRoleQuery(role);
    setIsDropdownOpen(false);

    // Auto-detect domain if not currently selected
    let inferredDomain = selectedDomain;
    if (!inferredDomain) {
      for (const [dom, roleList] of Object.entries(rolesByDomain)) {
        if (roleList.includes(role)) {
          inferredDomain = dom;
          if (onSelectDomain) onSelectDomain(dom);
          break;
        }
      }
    }

    if (onSelectRole) {
      onSelectRole(role, inferredDomain);
    }
  };

  const handleClearRole = () => {
    setRoleQuery("");
    setIsDropdownOpen(false);
    if (onSelectRole) {
      onSelectRole("", selectedDomain);
    }
  };

  const suggestions = getSuggestions();

  return (
    <div className={`space-y-4 ${className}`} ref={dropdownRef}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* DOMAIN SELECTOR */}
        {showDomainSelect && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <FaLayerGroup className="text-blue-600" />
              {labelDomain}
            </label>
            <div className="relative">
              <select
                value={selectedDomain}
                onChange={handleDomainChange}
                disabled={disabled || loading}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 text-sm font-semibold focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition appearance-none cursor-pointer disabled:opacity-60 pr-10"
              >
                <option value="">All Domains (Search All 50 Roles)</option>
                {domains.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                <FaChevronDown />
              </div>
            </div>
          </div>
        )}

        {/* ROLE SEARCH / INPUT */}
        <div className={showDomainSelect ? "" : "col-span-full"}>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
            <FaBriefcase className="text-blue-600" />
            {labelRole}
          </label>
          <div className="relative">
            <div className="relative flex items-center">
              <div className="absolute left-4 text-slate-400 text-sm pointer-events-none">
                <FaSearch />
              </div>
              <input
                type="text"
                value={roleQuery}
                onChange={handleRoleInputChange}
                onFocus={() => setIsDropdownOpen(true)}
                disabled={disabled || loading}
                placeholder={placeholderRole}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-10 py-3 text-slate-800 text-sm font-semibold focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition disabled:opacity-60"
              />
              {roleQuery && !disabled && (
                <button
                  type="button"
                  onClick={handleClearRole}
                  className="absolute right-3.5 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
                  title="Clear role selection"
                >
                  <FaTimes className="text-xs" />
                </button>
              )}
            </div>

            {/* SEARCH SUGGESTIONS POPUP */}
            {isDropdownOpen && !disabled && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 max-h-64 overflow-y-auto divide-y divide-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-2 text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50 sticky top-0 border-b border-slate-100 flex justify-between items-center">
                  <span>
                    {selectedDomain ? `${selectedDomain} Roles` : "All Career Roles"} ({suggestions.length})
                  </span>
                  {selectedDomain && (
                    <button
                      type="button"
                      onClick={() => onSelectDomain && onSelectDomain("")}
                      className="text-blue-600 hover:underline capitalize"
                    >
                      Clear Domain Filter
                    </button>
                  )}
                </div>

                {suggestions.length > 0 ? (
                  suggestions.map((role) => {
                    const isSelected = selectedRole.toLowerCase().trim() === role.toLowerCase().trim();
                    return (
                      <div
                        key={role}
                        onClick={() => handleSelectSuggestion(role)}
                        className={`px-4 py-3 text-sm font-semibold cursor-pointer transition flex items-center justify-between ${
                          isSelected
                            ? "bg-blue-50 text-blue-700 font-bold"
                            : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                        }`}
                      >
                        <span>{role}</span>
                        {isSelected && <FaCheck className="text-blue-600 text-xs" />}
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-xs text-slate-500 font-medium">
                    No matching roles found. You can keep your custom title: <strong>"{roleQuery}"</strong>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
