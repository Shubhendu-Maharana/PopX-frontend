import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    company: "",
    isAgency: "",
  });
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Full Name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(form.phone))
      newErrors.phone = "Phone must be 10 digits";

    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email))
      newErrors.email = "Invalid email format";

    if (!form.password.trim()) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!form.company.trim()) newErrors.company = "Company name is required";

    if (!form.isAgency)
      newErrors.isAgency = "Please select if you are an agency";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!validate()) return;

    setLoading(true);
    const { name, phone, email, password, company, isAgency } = form;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
          company,
          isAgency,
        },
      },
    });

    if (error) {
      alert(error.message);
      return;
    }

    const userId = data.user?.id;

    if (userId) {
      const { error: insertError } = await supabase.from("profiles").insert([
        {
          id: userId,
          full_name: name,
          email,
          phone,
          company,
          is_agency: isAgency,
        },
      ]);

      setLoading(false);

      if (insertError) {
        setErrors(
          `⚠️ Account created, but failed to store profile: ${insertError.message}`
        );
      } else {
        setErrors(
          "✅ Account created successfully! Check your email to confirm."
        );
        setForm({
          name: "",
          email: "",
          phone: "",
          password: "",
          company: "",
          isAgency: "",
        });
      }
    }

    navigate("/dashboard");
  };

  return (
    <div className="flex justify-center min-h-screen bg-[#f7f8f9] px-6 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm flex flex-col justify-between min-h-full"
      >
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Create your <br /> PopX account
          </h2>

          {["name", "phone", "email", "password", "company"].map(
            (field, index) => (
              <div key={index} className="mb-4">
                <label className="block text-sm font-medium text-purple-600 mb-1 capitalize">
                  {field === "name"
                    ? "Full Name"
                    : field === "company"
                    ? "Company name"
                    : field === "phone"
                    ? "Phone number"
                    : field === "email"
                    ? "Email address"
                    : field}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type={
                    field === "password"
                      ? "password"
                      : field === "email"
                      ? "email"
                      : "text"
                  }
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {errors[field] && (
                  <p className="text-red-500 text-sm">{errors[field]}</p>
                )}
              </div>
            )
          )}

          <div className="mb-4">
            <p className="text-sm font-medium text-purple-600 mb-2">
              Are you an Agency?<span className="text-red-500">*</span>
            </p>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isAgency"
                  value="yes"
                  checked={form.isAgency === "yes"}
                  onChange={handleChange}
                  className="mr-2 accent-purple-600"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isAgency"
                  value="no"
                  checked={form.isAgency === "no"}
                  onChange={handleChange}
                  className="mr-2 accent-purple-600"
                />
                No
              </label>
            </div>
            {errors.isAgency && (
              <p className="text-red-500 text-sm">{errors.isAgency}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white p-3 rounded hover:bg-purple-700 transition-colors"
        >
          {loading ? "Loading..." : "Create Account"}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
