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

    return (
        <nav
            className={cn(
                location.pathname === `/travel/${params.tripId}` ? "bg-white" : "glassmorphism",
                "w-full fixed z-50"
            )}
        >
            <header className="root-nav wrapper flex justify-between items-center">
                <Link to="/" className="link-logo flex items-center gap-2">
                    <img src="/assets/icons/logo.svg" alt="logo" className="size-[30px]" />
                    <h1>Tourpilot</h1>
                </Link>

                <aside className="flex items-center gap-4">
                    {user?.status === "admin" && (
                        <Link
                            to="/dashboard"
                            className={cn("text-base font-semibold text-white", {
                                "text-dark-100": location.pathname.startsWith("/travel"),
                            })}
                        >
                            Dashboard
                        </Link>
                    )}

                    {user ? (
                        <>
                            <img
                                src={user?.imageUrl || "/assets/images/default-user.webp"}
                                alt="user"
                                referrerPolicy="no-referrer"
                                className="rounded-full w-8 h-8 object-cover"
                            />

                            <button onClick={handleLogout} className="cursor-pointer ml-2" aria-label="Logout">
                                <img
                                    src="/assets/icons/logout.svg"
                                    alt="logout"
                                    className="size-6 rotate-180"
                                />
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/sign-in"
                            className="ml-4 p-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
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
