import { ReactElement, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import toast from "react-hot-toast";

import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { Skeleton } from "../../components/loader";
import { useAllOrdersQuery } from "../../redux/api/orderAPI";
import { RootState } from "../../redux/store";
import { CustomError } from "../../types/api-types";
import { getClass, getDollarPrice, numberWithCommas } from "../../utils/features";

interface DataType {
    user: string;
    amount: string;
    discount: string;
    quantity: number;
    status: ReactElement;
    action: ReactElement;
}

const columns: Column<DataType>[] = [
    {
        Header: "Name",
        accessor: "user",
    },
    {
        Header: "Amount",
        accessor: "amount",
    },
    {
        Header: "Discount",
        accessor: "discount",
    },
    {
        Header: "Quantity",
        accessor: "quantity",
    },
    {
        Header: "Status",
        accessor: "status",
    },
    {
        Header: "Action",
        accessor: "action",
    },
];

const Transaction = () => {
    const { user } = useSelector((state: RootState) => state.userReducer);

    const { isLoading, data, isError, error } = useAllOrdersQuery(user?._id!);

    const [rows, setRows] = useState<DataType[]>([]);

    if (isError) {
        const err = error as CustomError;
        toast.error(err.data.message);
    }

    useEffect(() => {
        if (data)
            setRows(
                data.orders.map((i) => ({
                    user: i.user.name,
                    amount: `₹${numberWithCommas(i.total)}~$${getDollarPrice(i.total)}`,
                    discount: `$ ${getDollarPrice(i.discount)}`,
                    quantity: i.orderItems.length,
                    status: (
                        <span className={getClass(i.status)}>
                            {i.status}
                        </span>
                    ),
                    action: (
                        <Link to={`/admin/transaction/${i._id}`}>Manage</Link>
                    ),
                }))
            );
    }, [data]);

    const Table = TableHOC<DataType>(
        columns,
        rows,
        "dashboard-product-box",
        "Transactions",
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

export default Transaction;
