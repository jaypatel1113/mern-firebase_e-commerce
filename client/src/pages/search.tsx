import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import ProductCard from "../components/product-card";
import useDebounce from "../hooks/useDebounce";
import { Skeleton } from "../components/loader";
import { addToCart } from "../redux/reducer/cartReducer";
import { useCategoriesQuery, useSearchProductsQuery } from "../redux/api/productAPI";
import { conversion_rate } from "../redux/store";
import { getDollarPrice } from "../utils/features";
import { CartItem } from "../types/types";
import { CustomError } from "../types/api-types";

const Search = () => {
    const {
        data: categoriesResponse,
        isLoading: loadingCategories,
        isError,
        error,
    } = useCategoriesQuery("");

    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("");
    const [maxPrice, setMaxPrice] = useState(200000);
    const [category, setCategory] = useState("");
    const [page, setPage] = useState(1);

    const debouncedSearchValue = useDebounce(search, 500);
    const debouncedPriceValue = useDebounce(maxPrice, 500);
    // const throttledPrizeValue = useThrottle(maxPrice, 1000);

    const {
        isLoading: productLoading,
        data: searchedData,
        isError: productIsError,
        error: productError,
    } = useSearchProductsQuery({
        search: debouncedSearchValue,
        sort,
        category,
        page,
        price: debouncedPriceValue,
    });

    const dispatch = useDispatch();

    const addToCartHandler = (cartItem: CartItem) => {
        if (cartItem.stock < 1) return toast.error("Out of Stock");
        dispatch(addToCart(cartItem));
        toast.success("Added to cart");
    };

    const isPrevPage = page > 1;
    const isNextPage = searchedData && page < searchedData?.totalPage;

    if (isError) {
        const err = error as CustomError;
        toast.error(err.data.message);
    }
    if (productIsError) {
        const err = productError as CustomError;
        toast.error(err.data.message);
    }

    useEffect(() => {
        setPage(1);
    }, [category, sort, search]);

    return (
        <div className="product-search-page">
            <aside>
                <h2>Filters</h2>
                <div>
                    <h4>Sort</h4>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                    >
                        <option value="">None</option>
                        <option value="asc">Price (Low to High)</option>
                        <option value="dsc">Price (High to Low)</option>
                    </select>
                </div>

                <div>
                    <h4>Max Price: ${getDollarPrice(maxPrice) || ""}</h4>
                    <input
                        type="range"
                        min={conversion_rate}
                        max={200000}
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                    />
                </div>

                <div>
                    <h4>Category</h4>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">ALL</option>
                        {!loadingCategories &&
                            categoriesResponse?.categories.map((i) => (
                                <option key={i} value={i}>
                                    {i.toUpperCase()}
                                </option>
                            ))}
                    </select>
                </div>
            </aside>
            <main>
                <h1>Products</h1>
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {productLoading ? (
                    <Skeleton length={15} />
                ) : (
                    <div className="search-product-list">
                        {searchedData?.products.map((i) => (
                            <ProductCard
                                key={i._id}
                                productId={i._id}
                                name={i.name}
                                price={i.price}
                                stock={i.stock}
                                handler={addToCartHandler}
                                photo={i.photo}
                            />
                        ))}
                    </div>
                )}

                {searchedData && searchedData.totalPage > 1 && (
                    <article style={{ margin: "20px 0" }}>
                        <button
                            disabled={!isPrevPage}
                            onClick={() => setPage((prev) => prev - 1)}
                        >
                            Prev
                        </button>
                        <span>
                            {page} of {searchedData.totalPage}
                        </span>
                        <button
                            disabled={!isNextPage}
                            onClick={() => setPage((prev) => prev + 1)}
                        >
                            Next
                        </button>
                    </article>
                )}
            </main>
        </div>
    );
};

export default Search;
