import React from "react";
import { Link, useLoaderData, useLocation, useNavigate, useParams } from "react-router";
import { logoutUser } from "~/appwrite/auth";
import { cn } from "~/lib/utils";

const RootNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const user = useLoaderData();

    const handleLogout = async () => {
        await logoutUser();
        navigate("/");
    };

    const isDetailPage = location.pathname === `/travel/${params.tripId}`;

    return (
        <nav
            className={cn(
                isDetailPage
                    ? "bg-white shadow-lg border-b border-gray-100"
                    : "backdrop-blur-md bg-black/20",
                "w-full fixed top-0 z-50 transition-all duration-300"
            )}
        >
            <header className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 flex justify-between items-center h-16">

                <Link
                    to="/"
                    className="flex items-center hover:scale-105 transition-transform duration-300"
                >
                    <img src="/assets/icons/logo.webp" alt="logo" className="size-18 mt-2" />
                    <h1 className={cn(
                        "text-2xl font-bold bg-gradient-to-r from-[#FF6B6B] to-[#00B4D8] bg-clip-text text-transparent",
                        { "from-[#FF6B6B] to-[#00B4D8]": isDetailPage }
                    )}>
                        TourPilot
                    </h1>
                </Link>

                <aside className="flex items-center gap-6">
                    {user?.status === "admin" && (
                        <Link
                            to="/dashboard"
                            className={cn(
                                "font-semibold hover:scale-105 transition-all duration-300",
                                {
                                    "text-[#2C3E50] hover:text-[#FF6B6B]": isDetailPage,
                                    "text-white/90 hover:text-white": !isDetailPage,
                                }
                            )}
                        >
                            Dashboard
                        </Link>
                    )}

                    {user ? (
                        <div className="flex items-center gap-4">
                            <img
                                src={user?.imageUrl || "/assets/images/default-user.webp"}
                                alt="user"
                                className="size-8 rounded-full object-cover border-2 border-white/50 hover:border-[#FF6B6B] transition-all duration-300"
                            />
                            <button
                                onClick={handleLogout}
                                className="cursor-pointer hover:scale-110 transition-transform duration-300 p-2 rounded-full hover:bg-white/10"
                                aria-label="Logout"
                            >
                                <img
                                    src="/assets/icons/logout.svg"
                                    alt="logout"
                                    className="size-5 rotate-180"
                                />
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/sign-in"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] text-white font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm"
                        >
                            Connexion / Inscription
                        </Link>
                    )}
                </aside>
            </header>
        </nav>
    );
};

export default RootNavbar;