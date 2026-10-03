import React, { useState } from "react";
import { Mail, Phone, User, MessageSquare, Send } from "lucide-react";
import contactService from "../../services/contactService";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await contactService.createContact(formData);

      alert("Gửi liên hệ thành công!");

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("Lỗi gửi liên hệ:", error);

      alert(
        error?.response?.data?.message ||
          "Không thể gửi liên hệ. Vui lòng thử lại!",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "12px",
          padding: "30px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
          border: "1px solid #e5e7eb",
        }}
      >
        {/* Tiêu đề */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              margin: "0 auto 12px",
              borderRadius: "12px",
              background: "#e0f2fe",
              color: "#0284c7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MessageSquare size={25} />
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: "24px",
              color: "#0f172a",
            }}
          >
            Liên hệ với chúng tôi
          </h2>

          <p
            style={{
              marginTop: "8px",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            Gửi yêu cầu tư vấn hoặc thắc mắc của bạn cho chúng tôi
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Họ tên */}
          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "7px",
                fontWeight: 600,
                color: "#334155",
              }}
            >
              Họ và tên
            </label>

            <div
              style={{
                position: "relative",
              }}
            >
              <User
                size={18}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                }}
              />

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
                required
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "11px 12px 11px 40px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "7px",
                  outline: "none",
                  fontSize: "14px",
                }}
              />
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "7px",
                fontWeight: 600,
                color: "#334155",
              }}
            >
              Email
            </label>

            <div
              style={{
                position: "relative",
              }}
            >
              <Mail
                size={18}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                }}
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                required
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "11px 12px 11px 40px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "7px",
                  outline: "none",
                  fontSize: "14px",
                }}
              />
            </div>
          </div>

          {/* Số điện thoại */}
          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "7px",
                fontWeight: 600,
                color: "#334155",
              }}
            >
              Số điện thoại
            </label>

            <div
              style={{
                position: "relative",
              }}
            >
              <Phone
                size={18}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                }}
              />

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0987654321"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "11px 12px 11px 40px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "7px",
                  outline: "none",
                  fontSize: "14px",
                }}
              />
            </div>
          </div>

          {/* Nội dung */}
          <div style={{ marginBottom: "22px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "7px",
                fontWeight: 600,
                color: "#334155",
              }}
            >
              Nội dung liên hệ
            </label>

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Nhập nội dung cần tư vấn..."
              required
              rows={6}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px",
                border: "1px solid #cbd5e1",
                borderRadius: "7px",
                outline: "none",
                fontSize: "14px",
                resize: "vertical",
              }}
            />
          </div>

          {/* Nút gửi */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              border: "none",
              borderRadius: "7px",
              background: loading ? "#94a3b8" : "#0284c7",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <Send size={17} />

            {loading ? "Đang gửi..." : "Gửi liên hệ"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
