import React, { useState, useRef, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Compass,
  User,
  LogOut,
  Calendar,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  Menu,
  X,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const UserLayout = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Đóng mobile menu khi chuyển trang
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isCurrent = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f8fafc",
        fontFamily: "var(--font-family)",
      }}
    >
      {/* Top Banner Thông báo */}
      <div
        style={{
          backgroundColor: "#0f172a",
          color: "#94a3b8",
          fontSize: "13px",
          padding: "7px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Phone size={13} color="#38bdf8" /> Hotline:{" "}
              <strong style={{ color: "#f1f5f9" }}>0868236611</strong> (24/7)
            </span>
            <span
              style={{ display: "none", alignItems: "center", gap: "6px" }}
              className="top-banner-desktop"
            >
              <Mail size={13} color="#38bdf8" /> vuvietquan1884@gmail.com
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                color: "#10b981",
              }}
            >
              <Sparkles size={13} /> Cam kết giá tốt & đảm bảo giữ chỗ
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 24px",
            height: "72px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 10px rgba(2, 132, 199, 0.3)",
              }}
            >
              <Compass size={24} color="#ffffff" />
            </div>
            <div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "#0f172a",
                  letterSpacing: "-0.3px",
                }}
              >
                TRAVEL <span style={{ color: "#0284c7" }}>VIỆT</span>
              </div>
              <div
                style={{ fontSize: "11px", color: "#64748b", fontWeight: 500 }}
              >
                Hành trình vạn dặm yêu thương
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            style={{ display: "none", alignItems: "center", gap: "32px" }}
            className="desktop-nav"
          >
            <Link
              to="/"
              style={{
                fontSize: "15px",
                fontWeight: isCurrent("/") ? 700 : 500,
                color: isCurrent("/") ? "#0284c7" : "#334155",
                padding: "8px 0",
                borderBottom: isCurrent("/")
                  ? "2px solid #0284c7"
                  : "2px solid transparent",
                transition: "all 0.2s",
              }}
            >
              Trang Chủ
            </Link>

            <Link
              to="/tours"
              style={{
                fontSize: "15px",
                fontWeight: isCurrent("/tours") ? 700 : 500,
                color: isCurrent("/tours") ? "#0284c7" : "#334155",
                padding: "8px 0",
                borderBottom: isCurrent("/tours")
                  ? "2px solid #0284c7"
                  : "2px solid transparent",
                transition: "all 0.2s",
              }}
            >
              Khám Phá Tour
            </Link>

            <Link
              to="/bookings"
              style={{
                fontSize: "15px",
                fontWeight: isCurrent("/bookings") ? 700 : 500,
                color: isCurrent("/bookings") ? "#0284c7" : "#334155",
                padding: "8px 0",
                borderBottom: isCurrent("/bookings")
                  ? "2px solid #0284c7"
                  : "2px solid transparent",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Calendar size={16} />
              Đơn Của Tôi
            </Link>
            <Link
              to="/contact"
              style={{
                fontSize: "15px",
                fontWeight: isCurrent("/contact") ? 700 : 500,
                color: isCurrent("/contact") ? "#0284c7" : "#334155",
                padding: "8px 0",
                borderBottom: isCurrent("/contact")
                  ? "2px solid #0284c7"
                  : "2px solid transparent",
                transition: "all 0.2s",
              }}
            >
              Liên Hệ
            </Link>
          </nav>

          {/* User Auth Section */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {isAuthenticated ? (
              <div style={{ position: "relative" }} ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "6px 14px 6px 8px",
                    borderRadius: "30px",
                    border: "1px solid #e2e8f0",
                    backgroundColor: dropdownOpen ? "#f1f5f9" : "#ffffff",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                >
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      backgroundColor: "#0284c7",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "14px",
                      textTransform: "uppercase",
                    }}
                  >
                    {user?.name ? user.name.charAt(0) : "U"}
                  </div>
                  <div
                    style={{ textAlign: "left", display: "none" }}
                    className="user-name-desktop"
                  >
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#0f172a",
                        lineHeight: 1.2,
                      }}
                    >
                      {user?.name || "Khách hàng"}
                    </div>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>
                      {user?.email}
                    </div>
                  </div>
                  <ChevronDown size={15} color="#64748b" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "calc(100% + 8px)",
                      width: "230px",
                      backgroundColor: "#ffffff",
                      borderRadius: "12px",
                      boxShadow:
                        "0 10px 25px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.05)",
                      border: "1px solid #e2e8f0",
                      padding: "8px",
                      zIndex: 200,
                      animation: "fadeIn 0.15s ease-out",
                    }}
                  >
                    <div
                      style={{
                        padding: "8px 12px",
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: "14px",
                          color: "#0f172a",
                        }}
                      >
                        {user?.name}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#64748b",
                          wordBreak: "break-all",
                        }}
                      >
                        {user?.email}
                      </div>
                      <span
                        style={{
                          display: "inline-block",
                          marginTop: "4px",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          fontSize: "10px",
                          fontWeight: 700,
                          backgroundColor:
                            user?.role === "admin" ? "#fef3c7" : "#e0f2fe",
                          color: user?.role === "admin" ? "#b45309" : "#0369a1",
                        }}
                      >
                        {user?.role === "admin"
                          ? "Quản Trị Viên"
                          : "Khách Hàng Thành Viên"}
                      </span>
                    </div>

                    <div style={{ padding: "4px 0" }}>
                      <Link
                        to="/profile"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          fontSize: "13px",
                          color: "#334155",
                          textDecoration: "none",
                          fontWeight: 500,
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#f8fafc")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                      >
                        <User size={16} color="#0284c7" />
                        Hồ sơ cá nhân
                      </Link>

                      <Link
                        to="/bookings"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          fontSize: "13px",
                          color: "#334155",
                          textDecoration: "none",
                          fontWeight: 500,
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#f8fafc")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                      >
                        <Calendar size={16} color="#0284c7" />
                        Đơn đặt tour của tôi
                      </Link>

                      {isAdmin && user?.role === "admin" && (
                        <Link
                          to="/admin/dashboard"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "10px 12px",
                            borderRadius: "8px",
                            fontSize: "13px",
                            color: "#2563eb",
                            textDecoration: "none",
                            fontWeight: 600,
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#eff6ff")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "transparent")
                          }
                        >
                          <ShieldCheck size={16} color="#2563eb" />
                          Trang Quản trị Admin
                        </Link>
                      )}
                    </div>

                    <div
                      style={{
                        borderTop: "1px solid #f1f5f9",
                        paddingTop: "4px",
                      }}
                    >
                      <button
                        onClick={handleLogout}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          fontSize: "13px",
                          color: "#dc2626",
                          backgroundColor: "transparent",
                          border: "none",
                          cursor: "pointer",
                          fontWeight: 500,
                          textAlign: "left",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#fef2f2")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                      >
                        <LogOut size={16} />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Link
                  to="/login"
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#334155",
                    border: "1px solid #cbd5e1",
                    textDecoration: "none",
                    backgroundColor: "#ffffff",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f8fafc")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#ffffff")
                  }
                >
                  Đăng nhập
                </Link>

                <Link
                  to="/register"
                  style={{
                    padding: "8px 18px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#ffffff",
                    backgroundColor: "#0284c7",
                    textDecoration: "none",
                    boxShadow: "0 2px 6px rgba(2, 132, 199, 0.25)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#0369a1")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#0284c7")
                  }
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                backgroundColor: "#ffffff",
                color: "#334155",
              }}
              className="mobile-toggle"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            style={{
              borderTop: "1px solid #e2e8f0",
              backgroundColor: "#ffffff",
              padding: "16px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <Link
              to="/tours"
              style={{
                padding: "10px 14px",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: isCurrent("/tours") ? 700 : 500,
                color: isCurrent("/tours") ? "#0284c7" : "#334155",
                backgroundColor: isCurrent("/tours")
                  ? "#f0f9ff"
                  : "transparent",
                textDecoration: "none",
              }}
            >
              Khám Phá Tour
            </Link>
            <Link
              to="/bookings"
              style={{
                padding: "10px 14px",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: isCurrent("/bookings") ? 700 : 500,
                color: isCurrent("/bookings") ? "#0284c7" : "#334155",
                backgroundColor: isCurrent("/bookings")
                  ? "#f0f9ff"
                  : "transparent",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Calendar size={18} />
              Đơn Đặt Của Tôi
            </Link>
            {user && (
              <Link
                to="/profile"
                style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: isCurrent("/profile") ? 700 : 500,
                  color: isCurrent("/profile") ? "#0284c7" : "#334155",
                  backgroundColor: isCurrent("/profile")
                    ? "#f0f9ff"
                    : "transparent",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <User size={18} />
                Hồ Sơ Của Tôi
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Main Page Content */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* Comprehensive Footer */}
      <footer
        style={{
          backgroundColor: "#0f172a",
          color: "#94a3b8",
          paddingTop: "64px",
          paddingBottom: "32px",
          marginTop: "64px",
          borderTop: "1px solid #1e293b",
        }}
      >
        <div
          style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "40px",
              marginBottom: "48px",
            }}
          >
            {/* Col 1: Về Travel Việt */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    backgroundColor: "#0284c7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Compass size={22} color="#ffffff" />
                </div>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: 800,
                    color: "#f8fafc",
                  }}
                >
                  TRAVEL <span style={{ color: "#38bdf8" }}>VIỆT</span>
                </div>
              </div>
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: 1.6,
                  color: "#94a3b8",
                  marginBottom: "20px",
                }}
              >
                Đơn vị lữ hành hàng đầu chuyên cung cấp các tour du lịch trong
                nước cao cấp, trọn gói, mang đến trải nghiệm khám phá văn hóa và
                danh thắng tuyệt mỹ của Việt Nam.
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  fontSize: "13px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <MapPin size={15} color="#38bdf8" /> 23 Hoàng Xá, Quốc Oai, Hà
                  Nội
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Phone size={15} color="#38bdf8" /> Hotline tư vấn: 0868236611
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Mail size={15} color="#38bdf8" /> vuvietquan1884@gmail.com
                </div>
              </div>
            </div>

            {/* Col 2: Điểm đến thịnh hành */}
            <div>
              <h4
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#f8fafc",
                  marginBottom: "18px",
                }}
              >
                Điểm Đến Nổi Bật
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  fontSize: "14px",
                }}
              >
                <li>
                  <Link
                    to="/tours?query=Hạ+Long"
                    style={{ color: "#cbd5e1", textDecoration: "none" }}
                  >
                    Vịnh Hạ Long - Du Thuyền 5 Sao
                  </Link>
                </li>
                <li>
                  <Link
                    to="/tours?query=Fansipan"
                    style={{ color: "#cbd5e1", textDecoration: "none" }}
                  >
                    Trekking Fansipan - Sapa
                  </Link>
                </li>
                <li>
                  <Link
                    to="/tours?query=Mù+Cang+Chải"
                    style={{ color: "#cbd5e1", textDecoration: "none" }}
                  >
                    Mù Cang Chải Mùa Lúa Chín
                  </Link>
                </li>
                <li>
                  <Link
                    to="/tours?query=Đà+Nẵng"
                    style={{ color: "#cbd5e1", textDecoration: "none" }}
                  >
                    Đà Nẵng - Hội An - Bà Nà Hills
                  </Link>
                </li>
                <li>
                  <Link
                    to="/tours?query=Phú+Quốc"
                    style={{ color: "#cbd5e1", textDecoration: "none" }}
                  >
                    Phú Quốc - Đảo Ngọc Nghỉ Dưỡng
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Chính sách & Hỗ trợ */}
            <div>
              <h4
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#f8fafc",
                  marginBottom: "18px",
                }}
              >
                Chính Sách & Quy Định
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  fontSize: "14px",
                }}
              >
                <li style={{ color: "#cbd5e1" }}>
                  Chính sách hủy đơn & hoàn tiền linh hoạt
                </li>
                <li style={{ color: "#cbd5e1" }}>
                  Bảo hiểm du lịch tiêu chuẩn quốc tế
                </li>
                <li style={{ color: "#cbd5e1" }}>
                  Điều khoản & điều kiện dịch vụ
                </li>
                <li style={{ color: "#cbd5e1" }}>
                  Bảo mật thông tin khách hàng
                </li>
                <li style={{ color: "#cbd5e1" }}>
                  Quy chế hoạt động sàn đặt tour trực tuyến
                </li>
              </ul>
            </div>

            {/* Col 4: Thanh toán an toàn */}
            <div>
              <h4
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#f8fafc",
                  marginBottom: "18px",
                }}
              >
                Thanh Toán An Toàn
              </h4>
              <p
                style={{
                  fontSize: "13px",
                  color: "#94a3b8",
                  marginBottom: "14px",
                }}
              >
                Hỗ trợ đa dạng các phương thức thanh toán an toàn, bảo mật cao:
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                <span
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#1e293b",
                    borderRadius: "6px",
                    fontSize: "12px",
                    color: "#f1f5f9",
                    fontWeight: 500,
                  }}
                >
                  VietQR Chuyển Khoản
                </span>
                <span
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#1e293b",
                    borderRadius: "6px",
                    fontSize: "12px",
                    color: "#f1f5f9",
                    fontWeight: 500,
                  }}
                >
                  Ví MoMo
                </span>
                <span
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#1e293b",
                    borderRadius: "6px",
                    fontSize: "12px",
                    color: "#f1f5f9",
                    fontWeight: 500,
                  }}
                >
                  Thẻ Visa/Mastercard
                </span>
                <span
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#1e293b",
                    borderRadius: "6px",
                    fontSize: "12px",
                    color: "#f1f5f9",
                    fontWeight: 500,
                  }}
                >
                  Tiền mặt tại VP
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid #1e293b",
              paddingTop: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
              fontSize: "13px",
            }}
          >
            <div>
              © 2026 Travel Việt. Bản quyền thuộc về Công ty Cổ phần Du lịch &
              Lữ hành Việt Nam.
            </div>
            <div style={{ display: "flex", gap: "20px" }}>
              <span style={{ color: "#64748b" }}>Phiên bản Hệ Thống v2.5</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Responsive style helper */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .user-name-desktop { display: block !important; }
          .top-banner-desktop { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default UserLayout;
