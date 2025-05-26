import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";
import { useNavigate } from "react-router";

const Dashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from("profiles").select("*");
        if (error) throw error;
        setUsers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f8f9]">
      <div className="flex items-center justify-between p-6 bg-white text-black shadow-md">
        <p>Account Settings</p>
        <button
          onClick={handleLogout}
          className="py-2 px-4 bg-violet-600 text-white rounded-md font-semibold hover:bg-violet-700 transition cursor-pointer"
        >
          Logout
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        users.map((user, index) => (
          <div key={index} className="w-96 mt-10 mx-auto p-4">
            <div className="flex">
              <div className="relative w-25 h-25 mb-4">
                <img
                  src={`https://randomuser.me/api/portraits/men/${Math.floor(
                    Math.random() * 100
                  )}.jpg`}
                  alt="Profile"
                  className="rounded-full w-25 h-25 object-cover"
                />
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-bold">{user?.full_name}</h2>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
            <p className="mt-4 text-gray-500 text-sm leading-relaxed">
              Lorem Ipsum Dolor Sit Amet, Consetetur Sadipscing Elitr, Sed Diam
              Nonumy Eirmod Tempor Invidunt Ut Labore Et Dolore Magna Aliquyam
              Erat, Sed Diam
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;
