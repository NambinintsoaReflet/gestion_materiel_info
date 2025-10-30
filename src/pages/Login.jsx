import React, { useState } from "react";
import logo from "../assets/logo.png";
import logoHita from "../assets/logo_hita_png.png";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { api } from "../api/axios";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, isPending, error } = useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/login", { email, password });
      return data;
    },
    onSuccess: (data) => {
      login(data.token, data.user);
    },
  });

  return (
    <div className="flex items-center min-h-screen bg-[#282c34] text-gray-900">
      {/* <!-- Container --> */}
      <div className="mx-auto w-full">
        <div className="flex items-center justify-center px-2 py-6 w-full ">
          <div className="flex justify-center w-full xl:w-3/4 lg:w-12/12 min-h-[92vh]">
            <div className="w-full h-auto bg-login hidden sm:block md:w-5/12 bg-cover rounded-2xl">
              <div className="flex flex-col items-center justify-center h-full p-8 rounded-2xl text-white text-center">
                <h1 className="text-3xl">
                  Gestion des matériels informatiques HITA
                </h1>
                <p className="text-base mt-2 max-w-2xl">
                  Cette application facilite la gestion du stock et du suivi des
                  matériels informatiques. Elle permet de gérer les entrées, les
                  sorties, les achats et la maintenance de manière simple et
                  efficace.
                </p>
              </div>
            </div>

            <div className=" flex w-full max-w-sm items-center lg:w-7/12 lg:max-w-md text-white rounded-lg lg:rounded-l-none md:flex md:justify-center bg-[#20232a]">
              <div className="w-full lg:w-sm">
                <p className="flex justify-self-center mt-4 m-2 text-white">
                  IT MANAGER
                </p>

                <div className="flex justify-self-center">
                  <div className="w-10 h-10 flex mr-2 justify-self-center p-1 border rounded-full border-[#a9a9a9] mx-auto shadow-xs">
                    <img src={logo} alt="" />
                  </div>
                  <div className="w-10 h-10 flex justify-self-center p-1 bg-white border rounded-full border-[#a9a9a9] mx-auto shadow-xs">
                    <img src={logoHita} alt="" />
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    mutate();
                  }}
                  className="px-8 pt-6 pb-8 text-white rounded"
                >
                  <div className="mb-4">
                    <label
                      className="block mb-2 text-sm font-bold "
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      className="w-full px-3 py-2 mb-3 text-sm leading-tight  border border-gray-400 rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="Email"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block mb-2 text-sm font-bold "
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <input
                      className="w-full px-3 py-2 mb-3 text-sm leading-tight  border border-gray-400 rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      placeholder="Password"
                      required
                    />
                  </div>
                  <div className="mb-6 text-center">
                    {error && (
                      <p className="text-red-600 text-sm">
                        {error.response?.data?.message ||
                          error.message ||
                          "Erreur de connexion"}
                      </p>
                    )}

                    <button
                      className="w-full mt-2 px-4 py-2 font-bold cursor-pointer text-white bg-[#4face4] rounded hover:bg-blue-700 dark:bg-blue-700 dark:text-white dark:hover:bg-blue-900 focus:outline-none focus:shadow-outline"
                      type="submit"
                      disabled={isPending}
                    >
                      {isPending ? "Connexion..." : "Se connecter"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
