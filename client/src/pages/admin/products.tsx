import { ReactElement, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import toast from "react-hot-toast";

import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { Skeleton } from "../../components/loader";
import { useAllProductsQuery } from "../../redux/api/productAPI";
import { RootState, server } from "../../redux/store";
import { CustomError } from "../../types/api-types";
import { getDollarPrice, numberWithCommas } from "../../utils/features";

interface DataType {
    photo: ReactElement;
    name: string;
    price: string;
    stock: number;
    action: ReactElement;
}

const columns: Column<DataType>[] = [
    {
        Header: "Photo",
        accessor: "photo",
    },
    {
        Header: "Name",
        accessor: "name",
    },
    {
        Header: "Price",
        accessor: "price",
    },
    {
        Header: "Stock",
        accessor: "stock",
    },
    {
        Header: "Action",
        accessor: "action",
    },
];

const Products = () => {
    const { user } = useSelector((state: RootState) => state.userReducer);

    const { isLoading, isError, error, data } = useAllProductsQuery(user?._id!);

    const [rows, setRows] = useState<DataType[]>([]);

    if (isError) {
        const err = error as CustomError;
        toast.error(err.data.message);
    }

    useEffect(() => {
        if (data)
            setRows(
                data.products.map((i) => ({
                    photo: <img src={`${server}/${i.photo}`} />,
                    name: i.name,
                    price: `₹${numberWithCommas(i.price)}~$${getDollarPrice(i.price)}`,
                    stock: i.stock,
                    action: <Link to={`/admin/product/${i._id}`}>Manage</Link>,
                }))
            );
    }, [data]);

    const Table = TableHOC<DataType>(
        columns,
        rows,
        "dashboard-product-box",
        "Products",
        rows.length > 6
    )();

    return (
        <div className="admin-container">
            <AdminSidebar />
            <main className="dashboard">
                {isLoading ? <Skeleton length={15} /> : Table}
            </main>
            <Link to="/admin/product/new" className="create-product-btn">
                <FaPlus />
            </Link>
        </div>
    );
};

export default Products;
