import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext(() => {});

export const AuthProvider = (props) => {
    const [authData, setAuthData] = useState({
        Email: null,
        CustomerId: null,
        loading: true
    });

    useEffect(() => {
        console.log("useEffect in AuthContext");

        fetch("http://localhost:7000/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                query: `
                    query {
                        checkLoggedIn {
                            CustomerId
                            Email
                        }
                    }
                `
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log("PIPIPI", data);

            // ✅ Only call setAuth if data is valid
            if (data.data && data.data.checkLoggedIn) {
                const { CustomerId, Email } = data.data.checkLoggedIn;
                setAuth(CustomerId, Email);
            } else {
                setAuth(null, null);
            }
        })
        .catch(err => {
            console.error("Auth check failed:", err);
            setAuth(null, null);
        });
    }, []);

    const setAuth = (CustomerId, Email) => {
        setAuthData({
            CustomerId,
            Email,
            loading: false
        });
    };

    const logOut = () => {
        console.log("Logging out...");
        setAuthData({
            CustomerId: null,
            Email: null,
            loading: false
        });
        fetch("http://localhost:7000/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                query: `
                    mutation {
                        logOut{
                            message
                        }
                    }
                `
            })
        }).then(res => res.json())
          .then(data => {
              console.log("Logout response:", data);
          })
          .catch(err => {
              console.error("Logout failed:", err);
          });
    };

    return (
        <AuthContext.Provider value={{ ...authData, setAuth, logOut }}>
            {props.children}
        </AuthContext.Provider>
    );
};
