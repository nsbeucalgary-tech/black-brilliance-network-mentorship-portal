import { useState } from "react";
import { Eye, EyeOff } from 'lucide-react';

type PasswordProps = {
    labelText: string;
    placeholder: string;
    id: string;
    value: string;
    setValue: (value: string) => void;
}
export default function PasswordInput({ labelText, placeholder, id, value, setValue }: PasswordProps) {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
        <>
            <label htmlFor={id} className="text-sm font-semibold">{labelText}</label>
            <div className="relative">
                <input
                id={id}
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={placeholder}
                    className="w-full h-11 rounded-2xl border-0 px-4 bg-BBNLightGreen placeholder:text-gray-400"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-BBNDarkGreen cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? (<Eye />) : (<EyeOff />)}
                </button>
            </div>
        </>
    );
}