import { useSession, signIn, signOut } from "next-auth/react";
import Head from 'next/head';
import Link from "next/link";
import React from "react";

const IndexPage = () => {
    const { data: session, status } = useSession();
    const loading = status === "loading";

    const signInButtonNode = () => {
        if (session) {
            return null;
        }

        return (
            <div>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        signIn();
                    }}
                >
                    Sign In
                </button>
            </div>
        );
    };

    const signOutButtonNode = () => {
        if (!session) {
            return null;
        }

        return (
            <div>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        signOut();
                    }}
                >
                    Sign Out
                </button>
            </div>
        );
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!session) {
        return (
            <div className="hero">
                <div className="navbar">
                    {signInButtonNode()}
                </div>
                <div className="text">
                    You aren't authorized to view this page
                </div>
            </div>
        )
    }

    return (
        <div className="hero">
            <Head>
                <title>Index Page</title>
            </Head>
            <div className="navbar">
                {signOutButtonNode()}
            </div>
            <div className="text">
                Hello world
            </div>
        </div>
    );
};

export default IndexPage;