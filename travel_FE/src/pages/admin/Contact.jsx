import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Clock,
  RefreshCw,
  Trash2,
} from "lucide-react";
import contactService from "../../services/contactService";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const Contact = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendReady, setBackendReady] = useState(false);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await contactService.getAllContacts();
      if (Array.isArray(res)) {
        setContacts(res);
        setBackendReady(true);
      } else {
        setContacts([]);
        setBackendReady(false);
      }
    } catch (err) {
      console.error("Lỗi tải danh sách liên hệ:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "resolved" ? "pending" : "resolved";
    try {
      await contactService.updateContactStatus(id, newStatus);
      setContacts((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c)),
      );
    } catch (e) {
      console.error("Lỗi cập nhật trạng thái:", e);
      alert("Không thể cập nhật trạng thái liên hệ!");
    }
  };

  const handleDeleteContact = async (id) => {
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa tin nhắn liên hệ này không?",
    );

    if (!confirmed) return;

    try {
      await contactService.deleteContact(id);

      setContacts((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Lỗi xóa liên hệ:", error);
      alert("Không thể xóa tin nhắn liên hệ!");
    }
  };

  return (
    <div
      className="fade-in"
      style={{ display: "flex", flexDirection: "column", gap: "18px" }}
    >
      {/* Thông báo trạng thái kết nối Backend */}
      <div
        style={{
          background: backendReady ? "#f0fdf4" : "#fffbeb",
          border: `1px solid ${backendReady ? "#bbf7d0" : "#fef3c7"}`,
          borderRadius: "8px",
          padding: "12px 16px",
          fontSize: "13px",
          color: backendReady ? "#166534" : "#92400e",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        
        <button
          onClick={fetchContacts}
          style={{
            background: "none",
            border: "none",
            color: "inherit",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontWeight: 600,
            fontSize: "12px",
          }}
        >
          <RefreshCw size={13} /> Làm mới
        </button>
      </div>

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e9ec",
          borderRadius: "8px",
          padding: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "10px",
              backgroundColor: "#e0f2fe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0284c7",
            }}
          >
            <Mail size={22} />
          </div>
          <div>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 800,
                margin: 0,
                color: "#0f172a",
              }}
            >
              Hòm Thư & Liên Hệ Khách Hàng
            </h2>
            <p
              style={{
                fontSize: "12px",
                color: "#64748b",
                margin: "4px 0 0 0",
              }}
            >
              Tiếp nhận yêu cầu tư vấn tour và phản hồi đóng góp từ khách hàng
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: "40px 0", textAlign: "center" }}>
            <LoadingSpinner text="Đang tải hòm thư..." />
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "13px",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#f8fafc",
                    borderBottom: "1px solid #e2e8f0",
                    color: "#475569",
                  }}
                >
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontWeight: 700,
                    }}
                  >
                    Khách hàng
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontWeight: 700,
                    }}
                  >
                    Email & SĐT
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontWeight: 700,
                    }}
                  >
                    Nội dung tin nhắn
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "center",
                      fontWeight: 700,
                    }}
                  >
                    Trạng thái
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "center",
                      fontWeight: 700,
                    }}
                  >
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {contacts.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        padding: "40px",
                        textAlign: "center",
                        color: "#64748b",
                      }}
                    >
                      Chưa có tin nhắn liên hệ
                    </td>
                  </tr>
                ) : (
                  contacts.map((c) => (
                    <tr
                      key={c._id}
                      style={{ borderBottom: "1px solid #f1f5f9" }}
                    >
                      <td
                        style={{
                          padding: "14px 16px",
                          fontWeight: 700,
                          color: "#0f172a",
                        }}
                      >
                        {c.fullName || c.name || "Khách hàng"}
                      </td>
                      <td style={{ padding: "14px 16px", color: "#334155" }}>
                        <div>{c.email}</div>
                        {c.phone && (
                          <div style={{ fontSize: "12px", color: "#64748b" }}>
                            {c.phone}
                          </div>
                        )}
                      </td>
                      <td
                        style={{
                          padding: "14px 16px",
                          color: "#475569",
                          maxWidth: "380px",
                          lineHeight: 1.5,
                        }}
                      >
                        {c.message}
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "center" }}>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            padding: "4px 10px",
                            borderRadius: "20px",
                            backgroundColor:
                              c.status === "resolved" ? "#dcfce7" : "#fef3c7",
                            color:
                              c.status === "resolved" ? "#166534" : "#92400e",
                          }}
                        >
                          {c.status === "resolved"
                            ? "Đã phản hồi"
                            : "Chờ xử lý"}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "14px 16px",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          {/* Nút đổi trạng thái */}
                          <button
                            onClick={() => handleToggleStatus(c._id, c.status)}
                            title={
                              c.status === "resolved"
                                ? "Đánh dấu chờ xử lý"
                                : "Đánh dấu đã phản hồi"
                            }
                            style={{
                              backgroundColor:
                                c.status === "resolved" ? "#f1f5f9" : "#0284c7",
                              color:
                                c.status === "resolved" ? "#475569" : "#ffffff",
                              border: "none",
                              borderRadius: "6px",
                              padding: "6px 12px",
                              fontSize: "12px",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            {c.status === "resolved"
                              ? "Đánh dấu chờ"
                              : "Đã phản hồi"}
                          </button>

                          {/* Nút xóa */}
                          <button
                            onClick={() => handleDeleteContact(c._id)}
                            title="Xóa liên hệ"
                            style={{
                              backgroundColor: "#fee2e2",
                              color: "#dc2626",
                              border: "none",
                              borderRadius: "6px",
                              padding: "7px 9px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;
