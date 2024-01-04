import { Column } from "react-table";
import TableHOC from "./TableHOC";
import { ReactElement, useEffect, useState } from "react";
import { getClass, getDollarPrice, numberWithCommas } from "../../utils/features";

interface DataType {
    _id: string;
    quantity: number;
    discount: number;
    amount: string | number;
    status: ReactElement | string;
}

const columns: Column<DataType>[] = [
    {
        Header: "Id",
        accessor: "_id",
    },
    {
        Header: "Quantity",
        accessor: "quantity",
    },
    {
        Header: "Discount",
        accessor: "discount",
    },
    {
        Header: "Amount",
        accessor: "amount",
    },
    {
        Header: "Status",
        accessor: "status",
    },
];

const DashboardTable = ({ data = [] }: { data: DataType[] }) => {
    const [rows, setRows] = useState<DataType[]>([]);

    useEffect(() => {
        if (data)
            setRows(
                data.map((i) => ({
                    _id: i._id,
                    quantity: i.quantity,
                    discount: i.discount,
                    amount: `₹${numberWithCommas(+i.amount)}~$${getDollarPrice(+i.amount)}`,
                    status: (
                        <span className={getClass(i.status as string)}>
                            {i.status}
                        </span>
                    ),
                }))
            );
    }, [data]);

    return TableHOC<DataType>(
        columns,
        rows,
        "transaction-box",
        "Top Transaction"
    )();
};

export default DashboardTable;
