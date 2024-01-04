import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { saveShippingInfo } from "../redux/reducer/cartReducer";
import { useCreateMutation } from "../redux/api/paymentAPI";
import { RootState } from "../redux/store";
import { getDPrice } from "../utils/features";

const Shipping = () => {
    const { cartItems, total } = useSelector((state: RootState) => state.cartReducer);
    const { user } = useSelector((state: RootState) => state.userReducer);
    const [createPayment] = useCreateMutation();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [shippingInfo, setShippingInfo] = useState({
        address: "",
        city: "",
        state: "",
        country: "",
        pinCode: "",
    });

    const changeHandler = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setShippingInfo((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        dispatch(saveShippingInfo(shippingInfo));

        const data = {
            amount: +getDPrice(total),
            name: user?.name!,
            shippingInfo: shippingInfo,
        };

        const res = await createPayment(data);
        if ("data" in res) {
            const clientSecret = res.data.clientSecret;

            navigate("/pay", {
                state: clientSecret,
            });
        } else {
            toast.error("Something went wrong");
            console.error("Error in createPayment:", res.error);
        }
    };

    useEffect(() => {
        if (cartItems.length <= 0) return navigate("/cart");
    }, [cartItems]);

    return (
        <div className="shipping">
            <button className="back-btn" onClick={() => navigate("/cart")}>
                <BiArrowBack />
            </button>

            <form onSubmit={submitHandler}>
                <h1>Shipping Address</h1>

                <input
                    required
                    type="text"
                    placeholder="Address"
                    name="address"
                    value={shippingInfo.address}
                    onChange={changeHandler}
                />

                <input
                    required
                    type="text"
                    placeholder="City"
                    name="city"
                    value={shippingInfo.city}
                    onChange={changeHandler}
                />

                <input
                    required
                    type="text"
                    placeholder="State"
                    name="state"
                    value={shippingInfo.state}
                    onChange={changeHandler}
                />

                <select
                    name="country"
                    required
                    value={shippingInfo.country}
                    onChange={changeHandler}
                >
                    <option value="">Choose Country</option>
                    <option value="india">India</option>
                </select>

                <input
                    required
                    type="number"
                    placeholder="Pin Code"
                    name="pinCode"
                    value={shippingInfo.pinCode}
                    onChange={changeHandler}
                />

                <button type="submit">Pay Now</button>
            </form>
        </div>
    );
};

export default Shipping;
