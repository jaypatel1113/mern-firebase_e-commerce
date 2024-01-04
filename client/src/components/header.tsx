import { useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaShoppingBag, FaSignInAlt, FaUser, FaSignOutAlt } from "react-icons/fa";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";

import { auth } from "../firebase";
import { User } from "../types/types";

interface PropsType {
    user: User | null;
}

const Header = ({ user }: PropsType) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const logoutHandler = async () => {
        try {
            await signOut(auth);
            toast.success("Sign Out Successfully");
            setIsOpen(false);
        } catch (error) {
            toast.error("Sign Out Fail");
        }
    };

    return (
        <nav className="header">
            <Link onClick={() => setIsOpen(false)} to={"/"}>
                HOME
            </Link>
            <Link onClick={() => setIsOpen(false)} to={"/search"}>
                <FaSearch />
            </Link>
            <Link onClick={() => setIsOpen(false)} to={"/cart"}>
                <FaShoppingBag />
            </Link>

            {user?._id ? (
                <>
                    <button onClick={() => setIsOpen((prev) => !prev)}>
                        <FaUser />
                    </button>
                    <dialog open={isOpen}>
                        <div>
                            {user.role === "admin" && (
                                <Link
                                    onClick={() => setIsOpen(false)}
                                    to="/admin/dashboard"
                                >
                                    Admin
                                </Link>
                            )}

                            <Link onClick={() => setIsOpen(false)} to="/orders">
                                Orders
                            </Link>
                            <button
                                onClick={logoutHandler}
                                style={{
                                    marginTop: "0.5rem",
                                    alignSelf: "flex-end",
                                }}
                            >
                                <FaSignOutAlt />
                            </button>
                        </div>
                    </dialog>
                </>
            ) : (
                <Link to={"/login"}>
                    <FaSignInAlt />
                </Link>
            )}
        </nav>
    );
};

export default Header;
