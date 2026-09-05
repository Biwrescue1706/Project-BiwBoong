import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Plus, Pencil, Trash2, Wallet, X } from "lucide-react";
import api from "../api/axios";

const AccountPage = () => {
    const [accountTypes, setAccountTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [name, setName] = useState("");

    const fetchAccountTypes = async () => {
        try {
            setLoading(true);
            const response = await api.get("/account-types");

            if (response.data?.success) {
                setAccountTypes(response.data.data || []);
            } else {
                setAccountTypes([]);
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: error.response?.data?.message || "ไม่สามารถโหลดข้อมูลประเภทบัญชีได้"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccountTypes();
    }, []);

    const resetForm = () => {
        setName("");
        setEditingId(null);
        setShowForm(false);
    };

    const openAddForm = () => {
        setName("");
        setEditingId(null);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const accountTypeName = name.trim();

        if (!accountTypeName) {
            Swal.fire({
                icon: "warning",
                title: "กรุณากรอกชื่อประเภทบัญชี"
            });
            return;
        }

        try {
            setSaving(true);

            if (editingId) {
                await api.patch(`/account-types/${editingId}`, {
                    name: accountTypeName
                });

                await Swal.fire({
                    icon: "success",
                    title: "แก้ไขประเภทบัญชีสำเร็จ",
                    timer: 1200,
                    showConfirmButton: false
                });
            } else {
                await api.post("/account-types", {
                    name: accountTypeName
                });

                await Swal.fire({
                    icon: "success",
                    title: "เพิ่มประเภทบัญชีสำเร็จ",
                    timer: 1200,
                    showConfirmButton: false
                });
            }

            resetForm();
            await fetchAccountTypes();
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "ไม่สำเร็จ",
                text: error.response?.data?.message || "ไม่สามารถบันทึกข้อมูลได้"
            });
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (accountType) => {
        setEditingId(accountType.id);
        setName(accountType.name || "");
        setShowForm(true);
    };

    const handleDelete = async (accountType) => {
        const result = await Swal.fire({
            icon: "warning",
            title: "ลบประเภทบัญชี?",
            text: `ต้องการลบ "${accountType.name}" หรือไม่`,
            showCancelButton: true,
            confirmButtonText: "ลบ",
            cancelButtonText: "ยกเลิก",
            confirmButtonColor: "#dc2626"
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            await api.delete(`/account-types/${accountType.id}`);

            await Swal.fire({
                icon: "success",
                title: "ลบประเภทบัญชีสำเร็จ",
                timer: 1200,
                showConfirmButton: false
            });

            await fetchAccountTypes();
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "ลบไม่สำเร็จ",
                text: error.response?.data?.message || "ไม่สามารถลบข้อมูลได้"
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
                            ประเภทบัญชี
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            จัดการประเภทบัญชีเงินของคุณ
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openAddForm}
                        className="flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-cyan-700"
                    >
                        <Plus size={20} />
                        เพิ่มประเภทบัญชี
                    </button>
                </div>

                {showForm && (
                    <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">
                                    {editingId ? "แก้ไขประเภทบัญชี" : "เพิ่มประเภทบัญชี"}
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    กรอกชื่อประเภทบัญชี
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={resetForm}
                                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    ชื่อประเภทบัญชี
                                </label>

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="เช่น เงินสด, เงินในบัญชี"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                                />
                            </div>

                            <div className="mt-5 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="rounded-xl border border-gray-200 px-5 py-3 font-medium text-gray-600 transition hover:bg-gray-50"
                                >
                                    ยกเลิก
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-xl bg-cyan-600 px-5 py-3 font-medium text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving
                                        ? "กำลังบันทึก..."
                                        : editingId
                                            ? "บันทึกการแก้ไข"
                                            : "เพิ่มประเภทบัญชี"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="mb-4">
                    <h2 className="text-lg font-bold text-gray-800">
                        รายการประเภทบัญชี
                    </h2>
                    <p className="text-sm text-gray-500">
                        ทั้งหมด {accountTypes.length} รายการ
                    </p>
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
                            ยังไม่มีประเภทบัญชี
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            เริ่มต้นด้วยการเพิ่มประเภทบัญชี
                        </p>

                        <button
                            type="button"
                            onClick={openAddForm}
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 font-medium text-white transition hover:bg-cyan-700"
                        >
                            <Plus size={19} />
                            เพิ่มประเภทบัญชี
                        </button>
                    </div>
                ) : (
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
                                                ประเภทบัญชี
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 gap-1">
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(accountType)}
                                            className="rounded-lg p-2 text-gray-400 transition hover:bg-cyan-50 hover:text-cyan-600"
                                            title="แก้ไข"
                                        >
                                            <Pencil size={17} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDelete(accountType)}
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
                )}
            </div>
        </div>
    );
};

export default AccountPage;

