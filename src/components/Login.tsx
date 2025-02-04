import { useState } from "react";
import { useAxios } from "../hooks/useAxios";

interface LoginProps {
    idInstance: string;
    apiTokenInstance: string;
    onLogin: (idInstance: string, apiTokenInstance: string) => void;
}

export const Login: React.FC<LoginProps> = ({ idInstance, apiTokenInstance, onLogin }) => {
    const [localIdInstance, setLocalIdInstance] = useState(idInstance);
    const [localApiTokenInstance, setLocalApiTokenInstance] = useState(apiTokenInstance);

    const handleLogin = async () => {
        if (localIdInstance && localApiTokenInstance) {
            try {
                const response = await useAxios().get(
                    `/waInstance${localIdInstance}/getStateInstance/${localApiTokenInstance}`
                );

                if (response.data.stateInstance === "authorized") {
                    onLogin(localIdInstance, localApiTokenInstance);
                } else {
                    alert("Invalid credentials. Please check your idInstance and apiTokenInstance.");
                }
            } catch (error) {
                console.error("Error validating credentials:", error);
                alert("Failed to validate credentials. Please try again.");
            }
        } else {
            alert("Please enter both idInstance and apiTokenInstance.");
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">Login</h2>
            <input
                type="text"
                placeholder="idInstance"
                value={localIdInstance}
                onChange={(e) => setLocalIdInstance(e.target.value)}
                className="w-full p-2 border rounded"
            />
            <input
                type="text"
                placeholder="apiTokenInstance"
                value={localApiTokenInstance}
                onChange={(e) => setLocalApiTokenInstance(e.target.value)}
                className="w-full p-2 border rounded"
            />
            <button
                onClick={handleLogin}
                className="w-full bg-green-500 text-white py-2 rounded cursor-pointer"
            >
                Login
            </button>
        </div>
    );
};
