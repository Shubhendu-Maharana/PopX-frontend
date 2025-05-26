import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../supabaseClient";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const { email, password } = formData;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError({ loginError: error.message });
      console.log(error);
    } else {
      navigate("/dashboard", { replace: true });
    }
  };

  const allFieldsFilled = formData.email && formData.password;

  return (
    <div className="flex justify-center min-h-screen bg-[#f7f8f9] px-6 pt-10">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Signin to your <br /> PopX account
        </h2>
        <p className="text-gray-500 mb-6">
          Lorem ipsum dolor sit amet, <br /> consectetur adipiscing elit,
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-purple-600 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {error.email && (
            <p className="text-red-500 text-sm mt-1">{error.email}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-purple-600 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {error.password && (
            <p className="text-red-500 text-sm mt-1">{error.password}</p>
          )}
        </div>

        {error.loginError && (
          <p className="text-red-500 text-sm mb-4">{error.loginError}</p>
        )}

        <button
          type="submit"
          className={`w-full py-2 rounded transition duration-200 ${
            allFieldsFilled
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
