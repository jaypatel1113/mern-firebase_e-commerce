import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import CartItemCard from "../components/cart-item";
import { addToCart, calculatePrice, discountApplied, removeCartItem } from "../redux/reducer/cartReducer";
import { RootState } from "../redux/store";
import { useCouponValidityQuery } from "../redux/api/paymentAPI";
import { CartItem } from "../types/types";
import { getDollarPrice } from "../utils/features";
import useDebounce from "../hooks/useDebounce";

const Cart = () => {
    const { cartItems, subtotal, tax, total, shippingCharges, discount } = useSelector((state: RootState) => state.cartReducer);

    const dispatch = useDispatch();

    const [couponCode, setCouponCode] = useState<string>("");
    const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

    const debounceCouponCode = useDebounce(couponCode, 800);

    let { isLoading, data, isError, error } = useCouponValidityQuery(debounceCouponCode);

    const incrementHandler = (cartItem: CartItem) => {
        if (cartItem.quantity >= cartItem.stock) return;

        dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
    };
    const decrementHandler = (cartItem: CartItem) => {
        if (cartItem.quantity <= 1) return;

        dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
    };
    const removeHandler = (productId: string) => {
        dispatch(removeCartItem(productId));
    };

    useEffect(() => {
        if (isError && !isLoading) {
            dispatch(discountApplied(0));
            setIsValidCouponCode(false);
            dispatch(calculatePrice());
        } else if (!isError && data && !isLoading) {
            dispatch(discountApplied(data.discount));
            setIsValidCouponCode(true);
            dispatch(calculatePrice());
        } else {
            dispatch(discountApplied(0));
            setIsValidCouponCode(false);
            dispatch(calculatePrice());
        }
    }, [data, couponCode, isLoading, isError, error]);

    useEffect(() => {
        if (isValidCouponCode) {
            setIsValidCouponCode(false);
        }
    }, [couponCode]);

    useEffect(() => {
        dispatch(calculatePrice());
    }, [cartItems]);

    return (
        <div className="cart">
            <main>
                {cartItems.length > 0 ? (
                    cartItems.map((i, idx) => (
                        <CartItemCard
                            incrementHandler={incrementHandler}
                            decrementHandler={decrementHandler}
                            removeHandler={removeHandler}
                            key={idx}
                            cartItem={i}
                        />
                    ))
                ) : (
                    <h1>No Items Added</h1>
                )}
            </main>
            <aside>
                <p>Subtotal: ${getDollarPrice(subtotal)}</p>
                <p>Shipping Charges: ${getDollarPrice(shippingCharges)}</p>
                <p>Tax: ${getDollarPrice(tax)}</p>
                <p>
                    Discount: <em className="red"> - ${getDollarPrice(discount)}</em>
                </p>
                <p>
                    <b>Total: ${getDollarPrice(total)}</b>
                </p>

                <input
                    type="text"
                    placeholder="Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                />

                {couponCode &&
                    (isValidCouponCode ? (
                        <span className="green">
                            ${getDollarPrice(discount)} off using the{" "}
                            <code>{couponCode}</code>
                        </span>
                    ) : (
                        <span className="red">
                            {isLoading ? "Checking validity..." : (
                                <>
                                    Invalid Coupon <VscError />
                                </>
                            )}
                        </span>
                    ))}

                {cartItems.length > 0 && <Link to="/shipping">Checkout</Link>}
            </aside>
        </div>
    );
};

export default Cart;
