import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

const Input = ({ type = 'text', placeholder, value, setValue, error }) => {
    // const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div>
            <div className="relative">
                <input
                    type={
                        type === 'password'
                            ? showPassword
                                ? 'text'
                                : 'password'
                            : 'text'
                    }
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full px-4 py-3 border border-[#1A3E32] rounded-xl outline-none"
                />
                {type === 'password' && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                        {showPassword ? (
                            <EyeOff size={20} />
                        ) : (
                            <Eye size={20} />
                        )}
                    </button>
                )}
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default Input;
