import { ReactElement, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Column } from "react-table";
import toast from "react-hot-toast";

import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { Skeleton } from "../../components/loader";
import { RootState } from "../../redux/store";
import { CustomError } from "../../types/api-types";
import { getDollarPrice, numberWithCommas, responseToast } from "../../utils/features";
import { useAllCouponsQuery, useDeleteCouponMutation } from "../../redux/api/paymentAPI";
import { FaTrash } from "react-icons/fa";

interface DataType {
    id: string;
    code: string;
    amount: string;
    action: ReactElement;
}

const columns: Column<DataType>[] = [
    {
        Header: "Id",
        accessor: "id",
    },
    {
        Header: "Code",
        accessor: "code",
    },
    {
        Header: "Discount",
        accessor: "amount",
    },
    {
        Header: "Action",
        accessor: "action",
    },
];

const Coupons = () => {
    const { user } = useSelector((state: RootState) => state.userReducer);

    const { isLoading, data, isError, error } = useAllCouponsQuery(user?._id!);
    const [deleteCoupon] = useDeleteCouponMutation();

    const [rows, setRows] = useState<DataType[]>([]);

    if (isError) {
        const err = error as CustomError;
        toast.error(err.data.message);
    }

    const deleteHandler = async (couponId: string) => {
        const res = await deleteCoupon({ couponId, userId: user?._id! });
        responseToast(res, null, "");
    };

    useEffect(() => {
        if (data)
            setRows(
                data.coupons.map((i) => ({
                    id: i._id,
                    code: i.code,
                    amount: `₹${numberWithCommas(i.amount)}~$${getDollarPrice(i.amount)}`,
                    action: (
                        <button onClick={() => deleteHandler(i._id)}>
                            <FaTrash />
                        </button>
                    ),
                }))
            );
    }, [data]);

    const Table = TableHOC<DataType>(
        columns,
        rows,
        "dashboard-product-box",
        "Coupons",
        rows.length > 6
    )();
    return (
        <div className="admin-container">
            <AdminSidebar />
            <main className="dashboard">
                {isLoading ? <Skeleton length={15} /> : Table}
            </main>
        </div>
    );
};

export default Coupons;
