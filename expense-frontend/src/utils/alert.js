//Frontend/src/utils/alert.js
import Swal from "sweetalert2";

export const successAlert = (text) => {
  Swal.fire({
    icon: "success",
    title: "สำเร็จ",
    text,
    timer: 1500,
    showConfirmButton: false,
  });
};

export const errorAlert = (text) => {
  Swal.fire({
    icon: "error",
    title: "เกิดข้อผิดพลาด",
    text,
  });
};

export const confirmDelete = () => {
  return Swal.fire({
    title: "ยืนยันการลบ?",
    text: "ข้อมูลนี้จะไม่สามารถกู้คืนได้",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "ลบ",
    cancelButtonText: "ยกเลิก",
  });
};