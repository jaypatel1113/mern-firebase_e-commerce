import { ReactElement, useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Column } from "react-table";
import toast from "react-hot-toast";

import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { Skeleton } from "../../components/loader";
import { useAllUsersQuery, useDeleteUserMutation, useUpdateUserMutation } from "../../redux/api/userAPI";
import { RootState } from "../../redux/store";
import { CustomError } from "../../types/api-types";
import { responseToast } from "../../utils/features";

interface DataType {
    avatar: ReactElement;
    name: string;
    email: string;
    gender: string;
    role: string;
    action: ReactElement;
}

const columns: Column<DataType>[] = [
    {
        Header: "Avatar",
        accessor: "avatar",
    },
    {
        Header: "Name",
        accessor: "name",
    },
    {
        Header: "Gender",
        accessor: "gender",
    },
    {
        Header: "Email",
        accessor: "email",
    },
    {
        Header: "Role",
        accessor: "role",
    },
    {
        Header: "Action",
        accessor: "action",
    },
];

const Customers = () => {
    const { user } = useSelector((state: RootState) => state.userReducer);

    const { isLoading, data, isError, error } = useAllUsersQuery(user?._id!);

    const [rows, setRows] = useState<DataType[]>([]);

    const [deleteUser] = useDeleteUserMutation();
    const [updateUser] = useUpdateUserMutation();

    const deleteHandler = async (userId: string) => {
        const res = await deleteUser({ userId, adminUserId: user?._id! });
        responseToast(res, null, "");
    };
    const updateHandler = async (userId: string) => {
        const res = await updateUser({ userId, adminUserId: user?._id! });
        responseToast(res, null, "");
    };

    if (isError) {
        const err = error as CustomError;
        toast.error(err.data.message);
    }

    useEffect(() => {
        if (data)
            setRows(
                data.users.map((i) => ({
                    avatar: (
                        <img
                            style={{ borderRadius: "50%" }}
                            src={i.photo}
                            alt={i.name}
                        />
                    ),
                    name: i.name,
                    email: i.email,
                    gender: i.gender,
                    role: i.role,
                    action: (
                        <>
                            <button
                                style={{
                                    color: "rgb(56, 207, 56)",
                                    fontSize: 20,
                                    marginRight: "0.2rem",
                                }}
                                onClick={() => updateHandler(i._id)}
                            >
                                <FaEdit />
                            </button>
                            <button onClick={() => deleteHandler(i._id)}>
                                <FaTrash />
                            </button>
                        </>
                    ),
                }))
            );
    }, [data]);

    const Table = TableHOC<DataType>(
        columns,
        rows,
        "dashboard-product-box",
        "Customers",
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

export default Customers;
