import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Plus, Pencil, Trash2, Wallet, X } from "lucide-react";
import api from "../api/axios";

const AccountPage = () => {
    const [accountTypes, setAccountTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [name, setName] = useState("");

    const fetchAccountTypes = async () => {
        try {
            setLoading(true);

            const response = await api.get("/account-types");

            if (response.data?.success) {
                setAccountTypes(
                    Array.isArray(response.data.data)
                        ? response.data.data
                        : []
                );
            } else {
                setAccountTypes([]);
            }
        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text:
                    error.response?.data?.message ||
                    "ไม่สามารถโหลดข้อมูลช่องทางบัญชีได้",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccountTypes();
    }, []);

    const closeModal = () => {
        if (saving) return;

        setShowModal(false);
        setEditingId(null);
        setName("");
    };

    const openAddModal = () => {
        setEditingId(null);
        setName("");
        setShowModal(true);
    };

    const openEditModal = (accountType) => {
        setEditingId(accountType.id);
        setName(accountType.name || "");
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const accountTypeName = name.trim();

        if (!accountTypeName) {
            Swal.fire({
                icon: "warning",
                title: "กรุณากรอกชื่อช่องทางบัญชี",
            });
            return;
        }

        const duplicate = accountTypes.some(
            (item) =>
                String(item.name || "")
                    .trim()
                    .toLowerCase() === accountTypeName.toLowerCase() &&
                String(item.id) !== String(editingId)
        );

        if (duplicate) {
            Swal.fire({
                icon: "warning",
                title: "มีช่องทางบัญชีนี้อยู่แล้ว",
                text: `ไม่สามารถใช้ชื่อ "${accountTypeName}" ซ้ำได้`,
            });
            return;
        }

        try {
            setSaving(true);

            if (editingId) {
                const response = await api.patch(
                    `/account-types/${editingId}`,
                    {
                        name: accountTypeName,
                    }
                );

                if (!response.data?.success) {
                    throw new Error(
                        response.data?.message ||
                            "ไม่สามารถแก้ไขช่องทางบัญชีได้"
                    );
                }

                closeModal();

                await Swal.fire({
                    icon: "success",
                    title: "แก้ไขช่องทางบัญชีสำเร็จ",
                    timer: 1200,
                    showConfirmButton: false,
                });
            } else {
                const response = await api.post("/account-types", {
                    name: accountTypeName,
                });

                if (!response.data?.success) {
                    throw new Error(
                        response.data?.message ||
                            "ไม่สามารถเพิ่มช่องทางบัญชีได้"
                    );
                }

                closeModal();

                await Swal.fire({
                    icon: "success",
                    title: "เพิ่มช่องทางบัญชีสำเร็จ",
                    timer: 1200,
                    showConfirmButton: false,
                });
            }

            await fetchAccountTypes();
        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "ไม่สำเร็จ",
                text:
                    error.response?.data?.message ||
                    error.message ||
                    "ไม่สามารถบันทึกข้อมูลได้",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (accountType) => {
        const result = await Swal.fire({
            icon: "warning",
            title: "ลบช่องทางบัญชี?",
            text: `ต้องการลบ "${accountType.name}" หรือไม่`,
            showCancelButton: true,
            confirmButtonText: "ลบ",
            cancelButtonText: "ยกเลิก",
            confirmButtonColor: "#dc2626",
        });

        if (!result.isConfirmed) return;

        try {
            const response = await api.delete(
                `/account-types/${accountType.id}`
            );

            if (!response.data?.success) {
                throw new Error(
                    response.data?.message ||
                        "ไม่สามารถลบช่องทางบัญชีได้"
                );
            }

            await Swal.fire({
                icon: "success",
                title: "ลบช่องทางบัญชีสำเร็จ",
                timer: 1200,
                showConfirmButton: false,
            });

            await fetchAccountTypes();
        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "ลบไม่สำเร็จ",
                text:
                    error.response?.data?.message ||
                    error.message ||
                    "ไม่สามารถลบข้อมูลได้",
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
                            ช่องทางบัญชี
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            จัดการช่องทางที่ใช้รับและจ่ายเงิน
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openAddModal}
                        className="flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-cyan-700"
                    >
                        <Plus size={20} />
                        เพิ่มช่องทางบัญชี
                    </button>
                </div>

                {loading ? (
                    <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-cyan-600" />

                        <p className="mt-4 text-sm text-gray-500">
                            กำลังโหลดข้อมูล...
                        </p>
                    </div>
                ) : accountTypes.length === 0 ? (
                    <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-50 text-cyan-600">
                            <Wallet size={30} />
                        </div>

                        <h3 className="mt-4 text-lg font-semibold text-gray-800">
                            ยังไม่มีช่องทางบัญชี
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            เริ่มต้นด้วยการเพิ่มช่องทางบัญชี
                        </p>

                        <button
                            type="button"
                            onClick={openAddModal}
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 font-medium text-white transition hover:bg-cyan-700"
                        >
                            <Plus size={19} />
                            เพิ่มช่องทางบัญชี
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mb-4">
                            <h2 className="text-lg font-bold text-gray-800">
                                รายการช่องทางบัญชี
                            </h2>

                            <p className="text-sm text-gray-500">
                                ทั้งหมด {accountTypes.length} รายการ
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {accountTypes.map((accountType) => (
                                <div
                                    key={accountType.id}
                                    className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                                                <Wallet size={25} />
                                            </div>

                                            <div className="min-w-0">
                                                <h3 className="truncate font-semibold text-gray-800">
                                                    {accountType.name}
                                                </h3>

                                                <p className="mt-1 text-xs text-gray-400">
                                                    ช่องทางบัญชี
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 gap-1">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openEditModal(accountType)
                                                }
                                                className="rounded-lg p-2 text-gray-400 transition hover:bg-cyan-50 hover:text-cyan-600"
                                                title="แก้ไข"
                                            >
                                                <Pencil size={17} />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(accountType)
                                                }
                                                className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                                                title="ลบ"
                                            >
                                                <Trash2 size={17} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {showModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            closeModal();
                        }
                    }}
                >
                    <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">
                                    {editingId
                                        ? "แก้ไขช่องทางบัญชี"
                                        : "เพิ่มช่องทางบัญชี"}
                                </h2>

                                <p className="mt-1 text-xs text-gray-500">
                                    {editingId
                                        ? "แก้ไขชื่อช่องทางบัญชี"
                                        : "เพิ่มช่องทางที่ใช้รับและจ่ายเงิน"}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={saving}
                                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5">
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                ชื่อช่องทางบัญชี
                            </label>

                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="เช่น เงินสด"
                                autoFocus
                                disabled={saving}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 disabled:bg-gray-100"
                            />

                            <div className="mt-5 flex gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={saving}
                                    className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    ยกเลิก
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 rounded-xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving
                                        ? "กำลังบันทึก..."
                                        : editingId
                                          ? "บันทึกการแก้ไข"
                                          : "เพิ่มช่องทางบัญชี"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountPage;